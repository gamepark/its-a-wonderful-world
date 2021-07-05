import Character from './Character'
import DevelopmentType from './DevelopmentType'
import EmpireSide from './EmpireSide'
import Resource from './Resource'

type Empire = {
  [key in EmpireSide]: {
    victoryPoints?: { [key in DevelopmentType | Character]?: number }
    production: { [key in Resource]?: number }
    krystallium?: number
  }
}

export default Empire