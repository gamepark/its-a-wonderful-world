import Empire from '../material/Empire'
import MoveType from './MoveType'

export default interface TransformIntoKrystallium {
  type: typeof MoveType.TransformIntoKrystallium
  playerId: Empire
}

export function transformIntoKrystallium(playerId: Empire): TransformIntoKrystallium {
  return {type: MoveType.TransformIntoKrystallium, playerId}
}