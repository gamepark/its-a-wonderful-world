import Game from './Game'
import Player from './Player'
import PlayerView from './PlayerView'

type GameView = Omit<Game, 'deck' | 'players'> & {
  deck: number
  players: (Player | PlayerView)[]
}

export default GameView