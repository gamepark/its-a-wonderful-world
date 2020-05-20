import Phase from '../types/Phase'
import MoveType from './MoveType'

type StartPhase = { type: typeof MoveType.StartPhase, phase: Phase }

export default StartPhase

export function startPhase(phase: Phase): StartPhase {
  return {type: MoveType.StartPhase, phase}
}
