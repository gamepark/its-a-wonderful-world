import Empire from '../material/empires/Empire'
import MoveType from './MoveType'

export default interface TellYouAreReady {
  type: typeof MoveType.TellYouAreReady
  playerId: Empire
}

export function tellYourAreReady(playerId: Empire): TellYouAreReady {
  return {type: MoveType.TellYouAreReady, playerId}
}