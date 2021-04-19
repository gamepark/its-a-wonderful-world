import GameState from './GameState'
import EmpireName from './material/EmpireName'
import Player from './Player'
import PlayerView from './PlayerView'

type GameView = Omit<GameState, 'deck' | 'players'> & {
  deck: number
  players: (Player | PlayerView)[]
  displayedPlayer?: EmpireName
}

export default GameView