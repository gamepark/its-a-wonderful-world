import Resource from '../material/Resource'
import Move, {MoveView} from './Move'
import MoveType from './MoveType'

export default interface Produce {
  type: typeof MoveType.Produce
  resource: Resource
}

export function produce(resource: Resource): Produce {
  return {type: MoveType.Produce, resource}
}

export function isProduce(move: Move | MoveView): move is Produce {
  return move.type === MoveType.Produce
}