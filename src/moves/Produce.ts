import Resource from '../material/resources/Resource'
import MoveType from './MoveType'

export default interface Produce {
  type: typeof MoveType.Produce
  resource: Resource
}

export function produce(resource: Resource): Produce {
  return {type: MoveType.Produce, resource}
}