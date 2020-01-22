import EmpireCards from './material/EmpireCards'
import shuffle from './util/shuffle'

const ItsAWonderfulWorldRules: Rules<GameState> = {
  setup() {
    return {
      players: shuffle(EmpireCards).slice(2).reduce<PlayersMap>((players, empireCard) => {
        players[empireCard.playerId] = {}
        return players
      }, {})
    }
  },

  getPlayerIds(game) {
    return Object.keys(game.players)
  }
}

export default ItsAWonderfulWorldRules