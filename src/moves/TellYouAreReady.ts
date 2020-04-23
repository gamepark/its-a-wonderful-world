import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface TellYouAreReady {
  type: typeof MoveType.TellYouAreReady
  playerId: EmpireName
}

export function tellYourAreReady(playerId: EmpireName): TellYouAreReady {
  return {type: MoveType.TellYouAreReady, playerId}
}