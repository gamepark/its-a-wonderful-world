import GameState from '../GameState'
import GameView from '../GameView'
import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

export default interface TellYouAreReady {
  type: typeof MoveType.TellYouAreReady
  playerId: EmpireName
}

export const tellYouAreReadyMove = (playerId: EmpireName): TellYouAreReady => ({
  type: MoveType.TellYouAreReady, playerId
})

export function tellYouAreReady(state: GameState | GameView, move: TellYouAreReady) {
  const player = state.players.find(player => player.empire === move.playerId)
  if (!player) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  player.ready = true
}

export function isTellYouAreReady(move: Move | MoveView): move is TellYouAreReady {
  return move.type === MoveType.TellYouAreReady
}