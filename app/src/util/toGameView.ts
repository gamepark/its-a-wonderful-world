import GameState from '@gamepark/its-a-wonderful-world/GameState'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'

// Server returns a raw GameState after Game Over; convert it to the GameView our components expect.
export default function toGameView(game: GameState | GameView, playerId?: EmpireName): GameView {
  if (typeof game.deck === 'number') return game as GameView
  const state = game as GameState
  return {
    ...state,
    deck: state.deck.length,
    players: state.players.map(player => {
      if (player.empire === playerId) return player
      const view = {...player, hand: Array.isArray(player.hand) ? player.hand.length : player.hand} as PlayerView
      if ((player as any).chosenCard !== undefined) view.chosenCard = true
      return view
    })
  }
}
