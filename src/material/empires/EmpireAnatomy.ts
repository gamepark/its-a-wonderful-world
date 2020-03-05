import Character from '../characters/Character'
import DevelopmentType from '../developments/DevelopmentType'
import Resource from '../resources/Resource'

type EmpireAnatomy = {
  victoryPoints?: { [key in DevelopmentType | Character]?: number }
  production?: { [key in Resource]?: number }
}

export default EmpireAnatomy