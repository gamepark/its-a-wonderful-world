import { Production } from '../Production'
import { ComboVictoryPoints } from '../Scoring'
import { EmpireSide } from './EmpireSide'

export type EmpireDetails = {
  [key in EmpireSide]: {
    victoryPoints?: ComboVictoryPoints
    production: Production
    krystallium?: number
  }
}
