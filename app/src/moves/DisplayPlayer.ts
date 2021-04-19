import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'

export default interface DisplayPlayer {
  type: 'DisplayPlayer'
  playerId: EmpireName
}

export const displayPlayerMove = (playerId: EmpireName): DisplayPlayer => ({
  type: 'DisplayPlayer', playerId
})

export function displayPlayer(state: GameView, move: DisplayPlayer) {
  state.displayedPlayer = move.playerId
}