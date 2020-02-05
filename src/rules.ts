import {Rules} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction, Phase} from './ItsAWonderfulWorld'
import Character from './material/Character'
import Development from './material/Development'
import DevelopmentsAnatomy from './material/Developments'
import Empire from './material/Empire'
import Resource, {isResource} from './material/Resource'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {completeConstruction} from './moves/CompleteConstruction'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import {discardLeftoverCards, isDiscardLeftoverCardsView} from './moves/DiscardLeftoverCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isPassCardsView, passCards} from './moves/PassCards'
import {placeResource} from './moves/PlaceResource'
import {recycle} from './moves/Recycle'
import {isRevealChosenCardsView, revealChosenCards} from './moves/RevealChosenCards'
import {slateForConstruction} from './moves/SlateForConstruction'
import {startPhase} from './moves/StartPhase'
import {transformIntoKrystallium} from './moves/TransformIntoKrystallium'
import shuffle from './util/shuffle'

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire, ItsAWonderfulWorld, MoveView<Empire>> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(0, 2).map(empire => ({
        empire, hand: [], draftArea: [], constructionArea: [], availableResources: [], empireCardResources: [], constructedDevelopments: []
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
          if (game.players[0].draftArea.length < 7) {
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
        break
      case Phase.Production:
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
        break
    }
    player.availableResources.forEach(resource => {
      player.constructionArea.forEach((developmentUnderConstruction, constructionIndex) => {
        getSpacesMissingItem(developmentUnderConstruction, item => item == resource)
          .forEach(space => moves.push(placeResource(empire, resource, constructionIndex, space)))
      })
      moves.push(placeResource(empire, resource))
    })
    if (player.empireCardResources.some(resource => resource == Resource.Krystallium)) {
      player.constructionArea.forEach((developmentUnderConstruction, constructionIndex) => {
        getSpacesMissingItem(developmentUnderConstruction, item => isResource(item))
          .forEach(space => moves.push(placeResource(empire, Resource.Krystallium, constructionIndex, space)))
      })
    }
    return moves
  },

  play(move, game) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards: {
        game.players.forEach(player => player.hand = game.deck.splice(0, 10))
        if (isDealDevelopmentCardsView<Empire>(move)) {
          getPlayer(game, move.playerId).hand = move.playerCards
        }
        break
      }
      case MoveType.ChooseDevelopmentCard: {
        const player = getPlayer(game, move.playerId)
        player.chosenCard = player.hand.splice(move.cardIndex, 1)[0]
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
        if (move.constructionIndex && move.space) {
          player.constructionArea[move.constructionIndex].costSpaces[move.space] = move.resource
        } else {
          player.empireCardResources.push(move.resource)
        }
        break
      }
      case MoveType.CompleteConstruction: {
        const player = getPlayer(game, move.playerId)
        player.constructedDevelopments.push(player.constructionArea.splice(move.constructionIndex, 1)[0].development)
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
            console.log(player.draftArea[player.draftArea.length - 1])
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

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules