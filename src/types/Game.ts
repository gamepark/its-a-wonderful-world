import Resource from '../material/resources/Resource'
import Phase from './Phase'
import Player from './Player'

type Game = {
  players: Player[]
  deck: number[]
  discard: number[]
  round: number
  phase: Phase
  productionStep?: Resource
  tutorial?: boolean
}

export default Game