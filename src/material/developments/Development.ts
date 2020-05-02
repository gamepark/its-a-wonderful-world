import Character, {isCharacter} from '../characters/Character'
import Resource from '../resources/Resource'
import DevelopmentType from './DevelopmentType'

type Development = {
  type: DevelopmentType
  constructionCost: { [key in Resource | Character]?: number }
  constructionBonus?: ConstructionBonus | Partial<Record<ConstructionBonus, number>>
  production?: Resource | { [key in Resource]?: number | DevelopmentType }
  victoryPoints?: number | { [key in DevelopmentType | Character]?: number }
  recyclingBonus: Resource
  numberOfCopies?: number
}

export default Development

export type ConstructionBonus = Character | Resource.Krystallium

export function isConstructionBonus(item: any): item is ConstructionBonus {
  return isCharacter(item) || item === Resource.Krystallium
}