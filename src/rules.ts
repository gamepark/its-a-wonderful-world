import Developments from './material/Developments'
import EmpireCards from './material/Empires'
import shuffle from './util/shuffle'

const ItsAWonderfulWorldRules: Rules<ItsAWonderfulWorldState> = {
  setup() {
    return {
      players: shuffle(EmpireCards).slice(2).reduce<PlayersMap>((players, empireCard) => {
        players[empireCard.name] = {}
        return players
      }, {}),
      deck: shuffle(Developments.flatMap(development => Array(development.numberOfCopies || 1).fill(development)))
    }
  },

  getPlayerIds(game) {
    return Object.keys(game.players)
  }
}

export default ItsAWonderfulWorldRules