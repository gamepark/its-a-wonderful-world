import GameState from '../GameState'
import GameView from '../GameView'
import Phase from '../Phase'
import MoveType from './MoveType'

type StartPhase = { type: typeof MoveType.StartPhase, phase: Phase }

export default StartPhase

export const startPhaseMove = (phase: Phase): StartPhase => ({
  type: MoveType.StartPhase, phase
})

export function startPhase(state: GameState | GameView, move: StartPhase) {
  state.phase = move.phase
  for (const player of state.players) {
    player.ready = false
  }
  if (move.phase === Phase.Draft) {
    delete state.productionStep
    state.round++
  }
}