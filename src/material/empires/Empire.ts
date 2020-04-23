import {EmpireSide} from '../../ItsAWonderfulWorld'
import Character from '../characters/Character'
import DevelopmentType from '../developments/DevelopmentType'
import Resource from '../resources/Resource'

type Empire = {
  [key in EmpireSide]: {
    victoryPoints?: { [key in DevelopmentType | Character]?: number }
    production: { [key in Resource]?: number }
  }
}

export default Empire