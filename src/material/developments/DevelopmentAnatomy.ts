import Character from '../characters/Character'
import DevelopmentType from './DevelopmentType'
import Resource from '../resources/Resource'

type DevelopmentAnatomy = {
  type: DevelopmentType
  constructionCost: { [key in Resource | Character]?: number }
  constructionBonus?: Character | Resource.Krystallium | { [key in Character | Resource.Krystallium]?: number }
  production?: Resource | { [key in Resource]?: number | DevelopmentType }
  victoryPoints?: number | { [key in DevelopmentType | Character]?: number }
  recyclingBonus: Resource
  numberOfCopies?: number
}

export default DevelopmentAnatomy