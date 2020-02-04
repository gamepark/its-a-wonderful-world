import {Rules} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase} from './ItsAWonderfulWorld'
import Development from './material/Development'
import DevelopmentsAnatomy from './material/Developments'
import Empire from './material/Empire'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {dealDevelopmentCards, isDealDevelopmentCardsView} from './moves/DealDevelopmentCards'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {isRevealChosenCardsAndPassTheRestView, revealChosenCardsAndPassTheRest} from './moves/RevealChosenCardsAndPassTheRest'
import shuffle from './util/shuffle'

// noinspection JSUnusedGlobalSymbols
const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire, ItsAWonderfulWorld, MoveView<Empire>> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(0, 2).map(empire => ({empire, hand: [], draftArea: [], constructionArea: [], constructedDevelopments: []})),
      deck: shuffle(Object.values(Development).flatMap<Development>(development => Array(DevelopmentsAnatomy.get(development).numberOfCopies || 1).fill(development))),
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
        const players = Object.values(game.players)
        const player1 = players[0]
        if (!player1.hand.length && !player1.draftArea.length) {
          return dealDevelopmentCards()
        }
        if (players.every(player => player.chosenCard)) {
          return revealChosenCardsAndPassTheRest()
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
        Object.values(game.players).forEach(player => player.hand = game.deck.splice(0, 10))
        if (isDealDevelopmentCardsView<Empire>(move)) {
          getPlayer(game, move.playerId).hand = move.playerCards
        }
        break
      case MoveType.ChooseDevelopmentCard:
        const player = getPlayer(game, move.playerId)
        player.chosenCard = player.hand.splice(move.cardIndex, 1)[0]
        break
      case MoveType.RevealChosenCardsAndPassTheRest:
        if (isRevealChosenCardsAndPassTheRestView(move)) {
          const player = getPlayer(game, move.playerId)
          player.hand = move.receivedCards
          game.players.forEach(player => player.draftArea.push(move.revealedCards[player.empire]))
        } else {
          game.players.forEach(player => player.draftArea.push(player.chosenCard as Development))
          if (game.round % 2) {
            let firstPlayerHand = game.players[0].hand
            for (let i = game.players.length - 1; i > 0; i--) {
              game.players[i - 1].hand = game.players[i].hand
            }
            game.players[game.players.length - 1].hand = firstPlayerHand
          } else {
            let lastPlayerHand = game.players[game.players.length - 1].hand
            for (let i = 1; i < game.players.length - 1; i++) {
              game.players[i].hand = game.players[i - 1].hand
            }
            game.players[0].hand = lastPlayerHand
          }
        }
        game.players.forEach(player => delete player.chosenCard)
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
      case MoveType.RevealChosenCardsAndPassTheRest:
        return {
          ...move, playerId, receivedCards: playerId ? getPlayer(game, playerId).hand : undefined,
          revealedCards: Object.entries(game.players).reduce<{ [key in Empire]?: Development }>((revealedCards, [empire, player]) => {
            revealedCards[empire as Empire] = player.draftArea[player.draftArea.length - 1]
            return revealedCards
          }, {})
        }
    }
    return move
  }
}

function getPlayer(game: ItsAWonderfulWorld, empire: Empire) {
  return game.players.find(player => player.empire == empire)
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules