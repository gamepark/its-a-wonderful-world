import Character from '../characters/Character'
import DevelopmentType from '../developments/DevelopmentType'
import Resource from '../resources/Resource'
import EmpireSide from './EmpireSide'

type Empire = {
  [key in EmpireSide]: {
    victoryPoints?: { [key in DevelopmentType | Character]?: number }
    production: { [key in Resource]?: number }
  }
}

export default Empire