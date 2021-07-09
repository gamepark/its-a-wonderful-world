import GameState from './GameState'
import GameView from './GameView'
import Player from './Player'
import PlayerView from './PlayerView'

export function isGameView(game: GameState | GameView): game is GameView {
  return typeof game.deck === 'number'
}

export function isPlayer(player: Player | PlayerView): player is Player {
  return (player as Player).hand !== undefined
}

export function isPlayerView(player: Player | PlayerView): player is PlayerView {
  return (player as PlayerView).hiddenHand !== undefined
}