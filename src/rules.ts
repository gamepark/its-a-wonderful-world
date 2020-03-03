import Rules from 'tabletop-game-workshop/dist/types/Rules'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction, Phase, Player} from './ItsAWonderfulWorld'
import Character, {ChooseCharacter, isCharacter} from './material/characters/Character'
import Development from './material/developments/Development'
import DevelopmentsAnatomy from './material/developments/Developments'
import {isDevelopmentType} from './material/developments/DevelopmentType'
import Empire from './material/empires/Empire'
import EmpiresProductionA from './material/empires/EmpiresProduction'
import Resource, {isResource} from './material/resources/Resource'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {completeConstruction} from './moves/CompleteConstruction'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import {discardLeftoverCards, isDiscardLeftoverCardsView} from './moves/DiscardLeftoverCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isPassCardsView, passCards} from './moves/PassCards'
import {placeCharacter} from './moves/PlaceCharacter'
import {placeResource} from './moves/PlaceResource'
import {produce} from './moves/Produce'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {recycle} from './moves/Recycle'
import {isRevealChosenCardsView, revealChosenCards} from './moves/RevealChosenCards'
import {slateForConstruction} from './moves/SlateForConstruction'
import {startPhase} from './moves/StartPhase'
import {tellYourAreReady} from './moves/TellYouAreReady'
import {transformIntoKrystallium} from './moves/TransformIntoKrystallium'
import shuffle from './util/shuffle'

export const numberOfCardsToDraft = 7
const numberOfCardsDeal2Players = 10

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire, ItsAWonderfulWorld, MoveView<Empire>> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(0, 2).map<Player>(empire => ({
        empire, hand: [], draftArea: [], constructionArea: [], availableResources: [], empireCardResources: [], constructedDevelopments: [], ready: false,
        characters: {[Character.Financier]: 0, [Character.General]: 0}, bonuses: []
      })),
      deck: shuffle(Object.values(Development).flatMap<Development>(development => Array(DevelopmentsAnatomy.get(development).numberOfCopies || 1).fill(development))),
      discard: [],
      round: 1,
      phase: Phase.Draft
    }
  },

  getPlayerIds(game) {
    return game.players.map(player => player.empire)
  },

  getAutomaticMove(game) {
    switch (game.phase) {
      case Phase.Draft:
        if (!game.players[0].hand.length && !game.players[0].draftArea.length) {
          return dealDevelopmentCards()
        } else if (game.players.every(player => player.chosenCard)) {
          return revealChosenCards()
        } else if (game.players[0].cardsToPass) {
          if (game.players[0].draftArea.length < numberOfCardsToDraft) {
            return passCards()
          } else if (game.players[0].cardsToPass.length) {
            return discardLeftoverCards()
          } else {
            return startPhase(Phase.Planning)
          }
        } else {
          for (const player of game.players) {
            if (player.hand.length == 1) {
              return chooseDevelopmentCard(player.empire, 0)
            }
          }
        }
        break
      case Phase.Planning:
        if (game.players.every(player => player.ready)) {
          return startPhase(Phase.Production)
        }
        break
      case Phase.Production:
        if (!game.productionStep) {
          return produce(Resource.Materials)
        } else if (game.players.every(player => player.ready)) {
          const nextProductionStep = getNextProductionStep(game)
          if (nextProductionStep) {
            return produce(nextProductionStep)
          } else if (game.round < 4) {
            return startPhase(Phase.Draft)
          }
        }
        break
    }
    for (const player of game.players) {
      for (const [constructionIndex, developmentUnderConstruction] of player.constructionArea.entries()) {
        if (developmentUnderConstruction.costSpaces.every(space => space != null)) {
          return completeConstruction(player.empire, constructionIndex)
        }
      }
      if (player.empireCardResources.filter(resource => resource != Resource.Krystallium).length >= 5) {
        return transformIntoKrystallium(player.empire)
      }
      const bonus = player.bonuses.find(bonus => bonus != ChooseCharacter)
      if (bonus == Resource.Krystallium) {
        return placeResource(player.empire, Resource.Krystallium)
      } else if (isCharacter(bonus)) {
        return receiveCharacter(player.empire, bonus)
      }
    }
  },

  getLegalMoves(game, empire) {
    const player = getPlayer(game, empire)
    const moves: Move[] = []
    switch (game.phase) {
      case Phase.Draft:
        if (!player.chosenCard) {
          player.hand.forEach((card, index) => moves.push(chooseDevelopmentCard(empire, index)))
        }
        break
      case Phase.Planning:
        player.draftArea.forEach((development, index) => moves.push(slateForConstruction(empire, index), recycle(empire, index)))
        if (!player.draftArea.length && !player.availableResources.length && !player.ready) {
          moves.push(tellYourAreReady(empire))
        }
        break
      case Phase.Production:
        if (player.bonuses.length && !player.availableResources.length && !player.ready) {
          moves.push(tellYourAreReady(empire))
        }
        break
    }
    player.availableResources.forEach(resource => {
      player.constructionArea.forEach((developmentUnderConstruction, constructionIndex) => {
        getSpacesMissingItem(developmentUnderConstruction, item => item == resource)
          .forEach(space => moves.push(placeResource(empire, resource, constructionIndex, space)))
      })
      moves.push(placeResource(empire, resource))
    })
    if (player.bonuses.some(bonus => bonus == ChooseCharacter)) {
      Object.values(Character).forEach(character => moves.push(receiveCharacter(empire, character)))
    }
    if (moves.length) {
      if (player.empireCardResources.some(resource => resource == Resource.Krystallium)) {
        player.constructionArea.forEach((developmentUnderConstruction, constructionIndex) => {
          getSpacesMissingItem(developmentUnderConstruction, item => isResource(item))
            .forEach(space => moves.push(placeResource(empire, Resource.Krystallium, constructionIndex, space)))
        })
      }
      Object.values(Character).forEach(character => {
        if (player.characters[character]) {
          player.constructionArea.forEach((developmentUnderConstruction, constructionIndex) => {
            getSpacesMissingItem(developmentUnderConstruction, item => item == character)
              .forEach(space => moves.push(placeCharacter(empire, character, constructionIndex, space)))
          })
        }
      })
    }
    return moves
  },

  play(move, game) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards: {
        game.players.forEach(player => player.hand = game.deck.splice(0, game.players.length == 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft))
        if (isDealDevelopmentCardsView<Empire>(move)) {
          getPlayer(game, move.playerId).hand = move.playerCards
        }
        break
      }
      case MoveType.ChooseDevelopmentCard: {
        const player = getPlayer(game, move.playerId)
        player.chosenCard = player.hand.splice(move.cardIndex, 1)[0] || true
        break
      }
      case MoveType.RevealChosenCards: {
        if (isRevealChosenCardsView(move)) {
          game.players.forEach(player => player.draftArea.push(move.revealedCards[player.empire]))
        } else {
          game.players.forEach(player => player.draftArea.push(player.chosenCard as Development))
        }
        game.players.forEach(player => {
          player.cardsToPass = player.hand
          delete player.chosenCard
        })
        break
      }
      case MoveType.PassCards: {
        if (isPassCardsView(move)) {
          const player = getPlayer(game, move.playerId)
          player.hand = move.receivedCards
        } else {
          const draftDirection = game.round % 2 ? 1 : -1
          for (let i = 0; i < game.players.length; i++) {
            game.players[i].hand = game.players[(i + draftDirection) % game.players.length].cardsToPass
          }
        }
        game.players.forEach(player => delete player.cardsToPass)
        break
      }
      case MoveType.DiscardLeftoverCards: {
        if (isDiscardLeftoverCardsView(move)) {
          game.players.forEach(player => player.hand = [])
          game.discard.push(...move.discardedCards)
        } else {
          game.players.forEach(player => game.discard.push(...player.hand.splice(0)))
        }
        break
      }
      case MoveType.StartPhase: {
        game.phase = move.phase
        game.players.forEach(player => player.ready = false)
        if (move.phase == Phase.Draft) {
          delete game.productionStep
          game.round++
        }
        break
      }
      case MoveType.SlateForConstruction: {
        const player = getPlayer(game, move.playerId)
        const development = player.draftArea.splice(move.cardIndex, 1)[0]
        player.constructionArea.push({development, costSpaces: Array(costSpaces(development)).fill(null)})
        break
      }
      case MoveType.Recycle: {
        const player = getPlayer(game, move.playerId)
        const development = player.draftArea.splice(move.cardIndex, 1)[0]
        player.availableResources.push(DevelopmentsAnatomy.get(development).recyclingBonus)
        break
      }
      case MoveType.PlaceResource: {
        const player = getPlayer(game, move.playerId)
        player.availableResources.splice(player.availableResources.indexOf(move.resource), 1)
        if (isNaN(move.constructionIndex) || isNaN(move.space)) {
          player.empireCardResources.push(move.resource)
        } else {
          player.constructionArea[move.constructionIndex].costSpaces[move.space] = move.resource
        }
        break
      }
      case MoveType.CompleteConstruction: {
        const player = getPlayer(game, move.playerId)
        let development = player.constructionArea.splice(move.constructionIndex, 1)[0].development
        player.constructedDevelopments.push(development)
        const bonus = DevelopmentsAnatomy.get(development).constructionBonus
        if (bonus) {
          if (isResource(bonus) || isCharacter(bonus)) {
            player.bonuses.push(bonus)
          } else {
            Object.keys(bonus).forEach((bonusType: Resource.Krystallium | Character) => player.bonuses.push(...new Array(bonus[bonusType]).fill(bonusType)))
          }
        }
        break
      }
      case MoveType.TransformIntoKrystallium: {
        const player = getPlayer(game, move.playerId)
        for (let i = 0; i < 5; i++) {
          player.empireCardResources.splice(player.empireCardResources.findIndex(resource => resource != Resource.Krystallium), 1)
        }
        player.empireCardResources.push(Resource.Krystallium)
        break
      }
      case MoveType.TellYouAreReady: {
        getPlayer(game, move.playerId).ready = true
        break
      }
      case MoveType.Produce: {
        game.productionStep = move.resource
        let highestProduction = 0
        let singleMostPlayer: Player = null
        game.players.forEach(player => {
          player.availableResources = new Array(getProduction(player, move.resource)).fill(move.resource)
          player.ready = false
          if (player.availableResources.length > highestProduction) {
            singleMostPlayer = player
            highestProduction = player.availableResources.length
          } else if (player.availableResources.length == highestProduction) {
            singleMostPlayer = null
          }
        })
        switch (move.resource) {
          case Resource.Materials:
          case Resource.Gold:
            singleMostPlayer.bonuses.push(Character.Financier)
            break
          case Resource.Energy:
          case Resource.Exploration:
            singleMostPlayer.bonuses.push(Character.General)
            break
          default:
            singleMostPlayer.bonuses.push(ChooseCharacter)
            break
        }
        break
      }
      case MoveType.ReceiveCharacter: {
        const player = getPlayer(game, move.playerId)
        player.characters[move.character]++
        let bonusIndex = player.bonuses.indexOf(move.character)
        if (bonusIndex == -1) {
          bonusIndex = player.bonuses.indexOf(ChooseCharacter)
        }
        player.bonuses.splice(bonusIndex, 1)
        break
      }
      case MoveType.PlaceCharacter: {
        const player = getPlayer(game, move.playerId)
        player.characters[move.character]--
        player.constructionArea[move.constructionIndex].costSpaces[move.space] = move.character
        break
      }
    }
  },

  getView(game, playerId) {
    game.deck = game.deck.map(() => null)
    game.players.forEach(player => {
      if (player.empire != playerId) {
        player.hand = player.hand.map(() => null)
        if (player.chosenCard) {
          player.chosenCard = true
        }
      }
    })
    return game
  },

  getMoveView(move, playerId, game) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        return playerId ? {...move, playerCards: getPlayer(game, playerId).hand, playerId} : move
      case MoveType.ChooseDevelopmentCard:
        return playerId != move.playerId ? {...move, cardIndex: 0} : move
      case MoveType.RevealChosenCards:
        return {
          ...move, revealedCards: game.players.reduce<{ [key in Empire]?: Development }>((revealedCards, player) => {
            revealedCards[player.empire] = player.draftArea[player.draftArea.length - 1]
            return revealedCards
          }, {})
        }
      case MoveType.PassCards:
        return {...move, playerId, receivedCards: playerId ? getPlayer(game, playerId).hand : undefined}
      case MoveType.DiscardLeftoverCards:
        return {...move, discardedCards: game.discard.slice()}
    }
    return move
  },

  getAnimationDuration(move) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return [0.5]
      /*case MoveType.DiscardLeftoverCards:
        return [0.5]*/
      default:
        return 0
    }
  }
}

function getPlayer(game: ItsAWonderfulWorld, empire: Empire) {
  return game.players.find(player => player.empire == empire)
}

function costSpaces(development: Development) {
  const cost = DevelopmentsAnatomy.get(development).constructionCost
  return Object.values(cost).reduce((sum, cost) => sum + cost)
}

function getSpacesMissingItem(developmentUnderConstruction: DevelopmentUnderConstruction, predicate: (item: Resource | Character) => boolean) {
  const cost = DevelopmentsAnatomy.get(developmentUnderConstruction.development).constructionCost
  let space = 0
  let spaces: number[] = []
  Array.of<Resource | Character>(...Object.values(Resource), ...Object.values(Character)).forEach(item => {
    for (let i = 0; i < cost[item] || 0; i++) {
      if (!developmentUnderConstruction.costSpaces[space] && predicate(item)) {
        spaces.push(space)
      }
      space++
    }
  })
  return spaces
}

function getNextProductionStep(game: ItsAWonderfulWorld): Resource {
  switch (game.productionStep) {
    case Resource.Materials:
      return Resource.Energy
    case Resource.Energy:
      return Resource.Science
    case Resource.Science:
      return Resource.Gold
    case Resource.Gold:
      return Resource.Exploration
    default:
      return undefined
  }
}

export function getProduction(player: Player, resource: Resource): number {
  return getBaseProduction(player.empire, resource) + player.constructedDevelopments.reduce((sum, development) => sum + getDevelopmentProduction(player, development, resource), 0)
}

function getBaseProduction(empire: Empire, resource: Resource): number {
  return EmpiresProductionA.get(empire)[resource] || 0
}

function getDevelopmentProduction(player: Player, development: Development, resource: Resource): number {
  const developmentAnatomy = DevelopmentsAnatomy.get(development)
  if (isResource(developmentAnatomy.production)) {
    return developmentAnatomy.production == resource ? 1 : 0
  } else {
    const production = developmentAnatomy.production[resource]
    if (isDevelopmentType(production)) {
      return player.constructedDevelopments.filter(development => DevelopmentsAnatomy.get(development).type == production).length
    } else {
      return production || 0
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules