import Production from '../Production'
import {ComboVictoryPoints} from '../Scoring'
import EmpireSide from './EmpireSide'

type Empire = {
  [key in EmpireSide]: {
    victoryPoints?: ComboVictoryPoints
    production: Production
    krystallium?: number
  }
}

export default Empire