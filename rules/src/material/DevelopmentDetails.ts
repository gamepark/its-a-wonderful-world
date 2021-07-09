import Production from '../Production'
import {VictoryPoints} from '../Scoring'
import Character, {isCharacter} from './Character'
import DeckType from './DeckType'
import DevelopmentType from './DevelopmentType'
import Resource from './Resource'

type DevelopmentDetails = {
  deck: DeckType
  type: DevelopmentType
  constructionCost: { [key in Resource | Character]?: number }
  constructionBonus?: ConstructionBonus[]
  production?: Production
  victoryPoints?: VictoryPoints
  recyclingBonus: Resource
  numberOfCopies?: number
}

export default DevelopmentDetails

export type ConstructionBonus = Character | Resource.Krystallium

export function isConstructionBonus(item: any): item is ConstructionBonus {
  return isCharacter(item) || item === Resource.Krystallium
}

export function totalCost(development: DevelopmentDetails) {
  return Object.values(development.constructionCost).reduce<number>((sum, cost) => cost ? sum + cost : sum, 0)
}
