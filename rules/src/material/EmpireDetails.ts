import type { Production } from '../Production'
import type { ComboVictoryPoints } from '../Scoring'
import { EmpireSide } from './EmpireSide'

export type EmpireDetails = {
  [key in EmpireSide]: {
    victoryPoints?: ComboVictoryPoints
    production: Production
    krystallium?: number
  }
}
