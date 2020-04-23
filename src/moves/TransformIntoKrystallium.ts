import EmpireName from '../material/empires/EmpireName'
import MoveType from './MoveType'

export default interface TransformIntoKrystallium {
  type: typeof MoveType.TransformIntoKrystallium
  playerId: EmpireName
}

export function transformIntoKrystallium(playerId: EmpireName): TransformIntoKrystallium {
  return {type: MoveType.TransformIntoKrystallium, playerId}
}