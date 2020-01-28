import {Rules} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase, PlayersMap} from './ItsAWonderfulWorld'
import Development from './material/Development'
import DevelopmentsAnatomy from './material/Developments'
import Empire from './material/Empire'
import DealDevelopmentCards from './moves/DealDevelopmentCards'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import shuffle from './util/shuffle'

const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorld, Move, Empire> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(0, 2).reduce<PlayersMap>((players, empire) => {
        players[empire] = {hand: []}
        return players
      }, {}),
      deck: shuffle(Object.values(Development).flatMap<Development>(development => Array(DevelopmentsAnatomy.get(development).numberOfCopies || 1).fill(development))),
      round: 1,
      phase: Phase.Draft
    }
  },

  getPlayerIds(game) {
    return Object.keys(game.players) as Empire[]
  },

  getAutomaticMove(game) {
    if (game.phase === Phase.Draft && Object.values(game.players).every(player => !player.hand.length)) {
      return DealDevelopmentCards
    }
  },

  play(move, game) {
    if (move.type === MoveType.DealDevelopmentCards) {
      Object.values(game.players).forEach(player => player.hand = game.deck.splice(0, 10))
    }
  },

  getView(game, playerId) {
    game.deck = game.deck.map(() => ({}))
    Object.entries(game.players).forEach(([key, player]) => {
      if (key !== playerId) {
        player.hand = player.hand.map(() => ({}))
      }
    })
    return game
  }
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules