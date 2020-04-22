import Rules from 'tabletop-game-workshop/dist/types/Rules'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction, Phase, Player} from './ItsAWonderfulWorld'
import Character, {ChooseCharacter, isCharacter} from './material/characters/Character'
import Development from './material/developments/Development'
import {developmentCards} from './material/developments/Developments'
import DevelopmentType, {isDevelopmentType} from './material/developments/DevelopmentType'
import Empire from './material/empires/Empire'
import EmpiresFaceA from './material/empires/EmpiresProduction'
import Resource, {isResource} from './material/resources/Resource'
import {chooseDevelopmentCard, isChooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
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
export const numberOfRounds = 4

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire, ItsAWonderfulWorld, MoveView<Empire>> = {
  setup(options) {
    return {
      players: setupPlayers(options?.players),
      deck: shuffle(Array.from(developmentCards.keys())),
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
        if (isGameView(game)) {
          return // There is hidden information during Draft phase, so consequences of actions cannot be predicted on client side
        }
        if (!game.players[0].hand.length && !game.players[0].draftArea.length) {
          return dealDevelopmentCards()
        } else if (game.players.every(player => player.chosenCard != undefined)) {
          return revealChosenCards()
        } else if (game.players[0].cardsToPass) {
          return passCards()
        } else if (game.players[0].draftArea.length == numberOfCardsToDraft) {
          if (game.players[0].hand.length) {
            return discardLeftoverCards()
          } else {
            return startPhase(Phase.Planning)
          }
        } else {
          for (const player of game.players) {
            if (player.chosenCard == undefined && player.hand.length == 1) {
              return chooseDevelopmentCard(player.empire, player.hand[0])
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
          } else if (game.round < numberOfRounds) {
            return startPhase(Phase.Draft)
          }
        }
        break
    }
    for (const player of game.players) {
      for (const developmentUnderConstruction of player.constructionArea) {
        if (developmentUnderConstruction.costSpaces.every(space => space != null)) {
          return completeConstruction(player.empire, developmentUnderConstruction.card)
        }
      }
      if (player.empireCardResources.filter(resource => resource != Resource.Krystallium).length >= 5) {
        return transformIntoKrystallium(player.empire)
      }
      const bonus = player.bonuses.find(bonus => bonus != ChooseCharacter)
      if (isResource(bonus)) {
        return placeResource(player.empire, bonus)
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
        if (player.chosenCard == undefined) {
          player.hand.forEach(card => moves.push(chooseDevelopmentCard(empire, card)))
        }
        break
      case Phase.Planning:
        player.draftArea.forEach(card => moves.push(slateForConstruction(empire, card), recycle(empire, card)))
        if (!player.draftArea.length && !player.availableResources.length && !player.ready) {
          moves.push(tellYourAreReady(empire))
        }
        break
      case Phase.Production:
        if (!player.bonuses.length && !player.availableResources.length && !player.ready) {
          moves.push(tellYourAreReady(empire))
        }
        break
    }
    player.availableResources.forEach(resource => {
      player.constructionArea.forEach(developmentUnderConstruction => {
        getSpacesMissingItem(developmentUnderConstruction, item => item == resource)
          .forEach(space => moves.push(placeResource(empire, resource, developmentUnderConstruction.card, space)))
      })
      moves.push(placeResource(empire, resource))
    })
    if (player.bonuses.some(bonus => bonus == ChooseCharacter)) {
      Object.values(Character).forEach(character => moves.push(receiveCharacter(empire, character)))
    }
    if (moves.length) {
      player.constructionArea.forEach(developmentUnderConstruction => {
        moves.push(recycle(empire, developmentUnderConstruction.card))
      })
      if (player.empireCardResources.some(resource => resource == Resource.Krystallium)) {
        player.constructionArea.forEach(developmentUnderConstruction => {
          getSpacesMissingItem(developmentUnderConstruction, item => isResource(item))
            .forEach(space => moves.push(placeResource(empire, Resource.Krystallium, developmentUnderConstruction.card, space)))
        })
      }
      Object.values(Character).forEach(character => {
        if (player.characters[character]) {
          player.constructionArea.forEach(developmentUnderConstruction => {
            getSpacesMissingItem(developmentUnderConstruction, item => item == character)
              .forEach(space => moves.push(placeCharacter(empire, character, developmentUnderConstruction.card, space)))
          })
        }
      })
    }
    return moves
  },

  play(move, game, playerId) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards: {
        game.players.forEach(player => player.hand = game.deck.splice(0, game.players.length == 2 ? numberOfCardsDeal2Players : numberOfCardsToDraft))
        if (isDealDevelopmentCardsView<Empire>(move)) {
          getPlayer(game, playerId).hand = move.playerCards
        }
        break
      }
      case MoveType.ChooseDevelopmentCard: {
        const player = getPlayer(game, move.playerId)
        if (isChooseDevelopmentCard(move)) {
          player.hand = player.hand.filter(card => card != move.card)
          player.chosenCard = move.card
        } else {
          player.hand.pop()
          player.chosenCard = true
        }
        break
      }
      case MoveType.RevealChosenCards: {
        if (isRevealChosenCardsView(move)) {
          game.players.forEach(player => player.draftArea.push(move.revealedCards[player.empire]))
        } else {
          game.players.forEach(player => player.draftArea.push(player.chosenCard as number))
        }
        game.players.forEach(player => {
          if (player.draftArea.length < numberOfCardsToDraft) {
            player.cardsToPass = player.hand
          }
          delete player.chosenCard
        })
        break
      }
      case MoveType.PassCards: {
        if (isPassCardsView(move)) {
          const player = getPlayer(game, playerId)
          player.hand = move.receivedCards
        } else {
          const draftDirection = game.round % 2 ? 1 : -1
          for (let i = 0; i < game.players.length; i++) {
            game.players[i].hand = game.players[(i + game.players.length + draftDirection) % game.players.length].cardsToPass
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
        player.draftArea = player.draftArea.filter(card => card != move.card)
        player.constructionArea.push({card: move.card, costSpaces: Array(costSpaces(developmentCards[move.card])).fill(null)})
        break
      }
      case MoveType.Recycle: {
        const player = getPlayer(game, move.playerId)
        const indexInDraftArea = player.draftArea.findIndex(card => card == move.card)
        if (indexInDraftArea != -1) {
          player.draftArea.splice(indexInDraftArea, 1)
          player.availableResources.push(developmentCards[move.card].recyclingBonus)
        } else {
          player.constructionArea = player.constructionArea.filter(developmentUnderConstruction => developmentUnderConstruction.card != move.card)
          player.bonuses.push(developmentCards[move.card].recyclingBonus)
        }
        game.discard.push(move.card)
        break
      }
      case MoveType.PlaceResource: {
        const player = getPlayer(game, move.playerId)
        const bonusIndex = player.bonuses.findIndex(bonus => bonus == move.resource)
        if (bonusIndex != -1) {
          player.bonuses.splice(bonusIndex, 1)
        } else if (move.resource != Resource.Krystallium) {
          player.availableResources.splice(player.availableResources.indexOf(move.resource), 1)
        } else {
          player.empireCardResources.splice(player.empireCardResources.indexOf(move.resource), 1)
        }
        if (isNaN(move.card) || isNaN(move.space)) {
          player.empireCardResources.push(move.resource)
        } else {
          player.constructionArea.find(developmentUnderConstruction => developmentUnderConstruction.card == move.card).costSpaces[move.space] = move.resource
        }
        break
      }
      case MoveType.CompleteConstruction: {
        const player = getPlayer(game, move.playerId)
        player.constructionArea = player.constructionArea.filter(developmentUnderConstruction => developmentUnderConstruction.card != move.card)
        player.constructedDevelopments.push(move.card)
        const bonus = developmentCards[move.card].constructionBonus
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
        if (singleMostPlayer) {
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
        player.constructionArea.find(developmentUnderConstruction => developmentUnderConstruction.card == move.card).costSpaces[move.space] = move.character
        break
      }
    }
  },

  canUndo(move, consecutiveMoves) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return !consecutiveMoves.some(move => move.type == MoveType.RevealChosenCards)
      case MoveType.SlateForConstruction:
        return !consecutiveMoves.some(m => m.type == MoveType.TellYouAreReady && m.playerId == move.playerId
          || m.type == MoveType.PlaceCharacter && m.card == move.card
          || m.type == MoveType.PlaceResource && m.card == move.card)
      case MoveType.Recycle:
        return !consecutiveMoves.some(m => m.type == MoveType.TellYouAreReady && m.playerId == move.playerId
          || m.type == MoveType.PlaceResource && m.playerId == move.playerId)
      case MoveType.PlaceCharacter:
      case MoveType.PlaceResource:
      case MoveType.ReceiveCharacter:
        return !consecutiveMoves.some(m => m.type == MoveType.TellYouAreReady && m.playerId == move.playerId
          || m.type == MoveType.PlaceResource && m.playerId == move.playerId && m.resource == Resource.Krystallium
          || m.type == MoveType.PlaceCharacter && m.playerId == move.playerId)
      case MoveType.TellYouAreReady:
        return !consecutiveMoves.some(m => m.type == MoveType.StartPhase || m.type == MoveType.Produce)
      default:
        return false
    }
  },

  getView(game, playerId) {
    game.deck = game.deck.map(() => null)
    game.players.forEach(player => {
      if (player.empire != playerId) {
        player.hand = player.hand.map(() => null)
        if (player.chosenCard != undefined) {
          player.chosenCard = true
        }
      }
    })
    return game
  },

  getMoveView(move, playerId, game) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        return playerId ? {...move, playerCards: getPlayer(game, playerId).hand} : move
      case MoveType.ChooseDevelopmentCard:
        if (playerId != move.playerId) {
          delete move.card
        }
        return move
      case MoveType.RevealChosenCards:
        return {
          ...move, revealedCards: game.players.reduce<{ [key in Empire]?: number }>((revealedCards, player) => {
            revealedCards[player.empire] = player.draftArea[player.draftArea.length - 1]
            return revealedCards
          }, {})
        }
      case MoveType.PassCards:
        return {...move, receivedCards: playerId ? getPlayer(game, playerId).hand : undefined}
      case MoveType.DiscardLeftoverCards:
        return {...move, discardedCards: game.discard.slice()}
    }
    return move
  },

  getAnimationDuration(move, playerId, game, undo) {
    switch (move.type) {
      case MoveType.ChooseDevelopmentCard:
        return undo ? 0 : [0.5]
      /*case MoveType.DiscardLeftoverCards:
        return [0.5]*/
      default:
        return 0
    }
  }
}

function setupPlayers(players?: number | [{ empire?: Empire }]) {
  if (Array.isArray(players) && players.length >= 2 && players.length <= 4) {
    const empiresLeft = shuffle(Object.values(Empire).filter(empire => players.some(player => player.empire == empire)))
    return players.map<Player>(player => setupPlayer(player.empire || empiresLeft.pop()))
  } else if (typeof players == 'number' && Number.isInteger(players) && players >= 2 && players <= 4) {
    return shuffle(Object.values(Empire)).slice(0, players).map<Player>(setupPlayer)
  } else {
    return shuffle(Object.values(Empire)).slice(0, 2).map<Player>(setupPlayer)
  }
}

function setupPlayer(empire: Empire): Player {
  return {
    empire, hand: [], draftArea: [], constructionArea: [], availableResources: [], empireCardResources: [], constructedDevelopments: [], ready: false,
    characters: {[Character.Financier]: 0, [Character.General]: 0}, bonuses: []
  }
}

function getPlayer(game: ItsAWonderfulWorld, empire: Empire) {
  return game.players.find(player => player.empire == empire)
}

function isGameView(game: ItsAWonderfulWorld) {
  return game.deck[0] === null
}

function costSpaces(development: Development) {
  return Object.values(development.constructionCost).reduce((sum, cost) => sum + cost)
}

export function getRemainingCost(developmentUnderConstruction: DevelopmentUnderConstruction): { item: Resource | Character, space: number }[] {
  const development = developmentCards[developmentUnderConstruction.card]
  return Array.of<Resource | Character>(...Object.values(Resource), ...Object.values(Character))
    .flatMap(item => Array(development.constructionCost[item] || 0).fill(item))
    .map((item, index) => ({item, space: index}))
    .filter(item => !developmentUnderConstruction.costSpaces[item.space])
}

function getSpacesMissingItem(developmentUnderConstruction: DevelopmentUnderConstruction, predicate: (item: Resource | Character) => boolean) {
  return getRemainingCost(developmentUnderConstruction).filter(cost => predicate(cost.item)).map(cost => cost.space)
}

export function getNextProductionStep(game: ItsAWonderfulWorld): Resource {
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
  return getBaseProduction(player.empire, resource) + player.constructedDevelopments.reduce((sum, card) => sum + getDevelopmentProduction(player, developmentCards[card], resource), 0)
}

function getBaseProduction(empire: Empire, resource: Resource): number {
  return EmpiresFaceA.get(empire).production[resource] || 0
}

function getDevelopmentProduction(player: Player, development: Development, resource: Resource): number {
  if (!development.production) {
    return 0
  } else if (isResource(development.production)) {
    return development.production == resource ? 1 : 0
  } else {
    const production = development.production[resource]
    if (isDevelopmentType(production)) {
      return player.constructedDevelopments.filter(card => developmentCards[card].type == production).length
    } else {
      return production || 0
    }
  }
}

function getCardVictoryPointsMultiplier(victoryPoints: number | { [key in DevelopmentType | Character]?: number }, item: DevelopmentType | Character) {
  return victoryPoints && typeof victoryPoints != 'number' && victoryPoints[item] ? victoryPoints[item] : 0
}

export function getVictoryPointsMultiplier(player: Player, item: DevelopmentType | Character): number {
  return getCardVictoryPointsMultiplier(EmpiresFaceA.get(player.empire).victoryPoints, item) +
    player.constructedDevelopments.map(card => developmentCards[card].victoryPoints)
      .reduce<number>((sum, victoryPoints) => sum + getCardVictoryPointsMultiplier(victoryPoints, item), 0)
}

export function getScore(player: Player): number {
  return getFlatVictoryPoints(player)
    + Object.values(DevelopmentType).reduce((sum, developmentType) => sum + getComboVictoryPoints(player, developmentType), 0)
    + Object.values(Character).reduce((sum, characterType) => sum + getComboVictoryPoints(player, characterType), 0)

}

export function getFlatVictoryPoints(player: Player): number {
  return player.constructedDevelopments.map(card => developmentCards[card].victoryPoints)
    .reduce<number>((sum, victoryPoints) => sum + (typeof victoryPoints == 'number' ? victoryPoints : 0), 0)
}

export function getComboVictoryPoints(player: Player, item: DevelopmentType | Character): number {
  const itemQuantity = isDevelopmentType(item) ? player.constructedDevelopments.filter(card => developmentCards[card].type == item).length :
    player.characters[item]
  const multiplier = isDevelopmentType(item) ? getVictoryPointsMultiplier(player, item) : getVictoryPointsMultiplier(player, item) + 1
  return itemQuantity * multiplier
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules