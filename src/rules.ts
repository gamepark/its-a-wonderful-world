import {Rules} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase} from './ItsAWonderfulWorld'
import Development from './material/Development'
import DevelopmentsAnatomy from './material/Developments'
import Empire from './material/Empire'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import {discardLeftoverCards, isDiscardLeftoverCardsView} from './moves/DiscardLeftoverCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isPassCardsView, passCards} from './moves/PassCards'
import {isRevealChosenCardsView, revealChosenCards} from './moves/RevealChosenCards'
import {startPhase} from './moves/StartPhase'
import shuffle from './util/shuffle'

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire, ItsAWonderfulWorld, MoveView<Empire>> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(0, 2).map(empire => ({empire, hand: [], draftArea: [], constructionArea: [], constructedDevelopments: []})),
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
  },

  getLegalMoves(game, empire) {
    const player = getPlayer(game, empire)
    if (game.phase === Phase.Draft && !player.chosenCard) {
      return player.hand.map((card, index) => chooseDevelopmentCard(empire, index))
    }
    return []
  },

  play(move, game) {
    switch (move.type) {
      case MoveType.DealDevelopmentCards:
        game.players.forEach(player => player.hand = game.deck.splice(0, 10))
        if (isDealDevelopmentCardsView<Empire>(move)) {
          getPlayer(game, move.playerId).hand = move.playerCards
        }
        break
      case MoveType.ChooseDevelopmentCard:
        const player = getPlayer(game, move.playerId)
        player.chosenCard = player.hand.splice(move.cardIndex, 1)[0]
        break
      case MoveType.RevealChosenCards:
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
      case MoveType.PassCards:
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
      case MoveType.DiscardLeftoverCards:
        if (isDiscardLeftoverCardsView(move)) {
          game.players.forEach(player => player.hand = [])
          game.discard.push(...move.discardedCards)
        } else {
          game.players.forEach(player => game.discard.push(...player.hand.splice(0)))
        }
        break
      case MoveType.StartPhase:
        game.phase = move.phase
        break
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
        console.log("getMoveView RevealChosenCards")
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

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules