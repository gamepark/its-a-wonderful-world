import { Production } from '../Production'
import { VictoryPoints } from '../Scoring'
import { Character } from './Character'
import { DeckType } from './DeckType'
import { DevelopmentType } from './DevelopmentType'
import { Resource } from './Resource'

export type DevelopmentDetails = {
  deck: DeckType
  type: DevelopmentType
  constructionCost: { [key in Resource | Character]?: number }
  constructionBonus?: ConstructionBonus[]
  production?: Production
  victoryPoints?: VictoryPoints
  recyclingBonus: Resource
  numberOfCopies?: number
}

export type ConstructionBonus = Character | Resource.Krystallium
