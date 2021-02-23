import EmpireName from '../material/EmpireName'
import Move from './Move'
import MoveType from './MoveType'

export default interface TellYouAreReady {
  type: typeof MoveType.TellYouAreReady
  playerId: EmpireName
}

export function tellYourAreReady(playerId: EmpireName): TellYouAreReady {
  return {type: MoveType.TellYouAreReady, playerId}
}

export function isTellYouAreReady(move: Move): move is TellYouAreReady {
  return move.type === MoveType.TellYouAreReady
}