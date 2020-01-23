import Development from './material/Development'
import Developments from './material/Developments'
import Empire from './material/Empire'
import DealDevelopmentCards from './moves/DealDevelopmentCards'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import shuffle from './util/shuffle'

type ItsAWonderfulWorldState = {
  players: PlayersMap,
  deck: Development[],
  round: number,
  phase: Phase
}

type PlayersMap = { [key in Empire]?: Player }

type Player = {
  hand: Development[]
}

enum Phase {Draft, Planning, Production}

const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorldState, Move> = {
  setup() {
    return {
      players: shuffle(Object.values(Empire)).slice(2).reduce<PlayersMap>((players, empire) => {
        players[empire] = {hand: []}
        return players
      }, {}),
      deck: shuffle(Developments.flatMap(development => Array(development.numberOfCopies || 1).fill(development))),
      round: 1,
      phase: Phase.Draft
    }
  },

  getPlayerIds(game) {
    return Object.keys(game.players)
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
  }
}

// noinspection JSUnusedGlobalSymbols
export default ItsAWonderfulWorldRules