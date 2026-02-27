import { Character } from './Character'
import { DeckType } from './DeckType'
import { DevelopmentDetails } from './DevelopmentDetails'
import { DevelopmentType } from './DevelopmentType'
import { Resource } from './Resource'

const { Energy, Materials, Science, Gold, Exploration, Krystallium } = Resource
const { Structure, Vehicle, Research, Project, Discovery, Memorial } = DevelopmentType
const { Financier, General } = Character

export const MemorialForTheBuilder: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Memorial,
  constructionCost: { [Materials]: 3, [Gold]: 1 },
  recyclingBonus: Materials,
  production: Krystallium,
  victoryPoints: 2
}

export const MemorialForTheDictator: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Memorial,
  constructionCost: { [Materials]: 1, [Energy]: 2, [Science]: 1 },
  recyclingBonus: Energy,
  production: Krystallium,
  victoryPoints: 2
}

export const MemorialForTheScientist: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Memorial,
  constructionCost: { [Energy]: 1, [Science]: 3 },
  recyclingBonus: Science,
  production: Krystallium,
  victoryPoints: 2
}

export const MemorialForTheFinancier: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Memorial,
  constructionCost: { [Energy]: 1, [Gold]: 2 },
  recyclingBonus: Gold,
  production: Krystallium,
  victoryPoints: 2
}

export const MemorialForTheExplorer: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Memorial,
  constructionCost: { [Science]: 1, [Exploration]: 2 },
  recyclingBonus: Exploration,
  production: Krystallium,
  victoryPoints: 2
}

export const AnalysisCenter: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: { [Materials]: 2, [Science]: 1 },
  recyclingBonus: Science,
  production: Krystallium,
  numberOfCopies: 3
}

export const SecurityShips: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: { [Materials]: 1, [Energy]: 2, [Gold]: 1 },
  recyclingBonus: Exploration,
  production: { [Exploration]: 1, [General]: 1 },
  numberOfCopies: 2
}

export const TowerOfBabel: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: { [Exploration]: 5 },
  recyclingBonus: Exploration,
  production: { [Krystallium]: 2 },
  victoryPoints: 2
}

export const GaussianWeapons: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: { [Energy]: 1, [Science]: 3 },
  recyclingBonus: Energy,
  constructionBonus: [General],
  production: Krystallium,
  victoryPoints: 1
}

export const CargoFleet: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: { [Materials]: 2, [Energy]: 2 },
  recyclingBonus: Gold,
  production: { [Gold]: 1, [Financier]: 1 },
  numberOfCopies: 2
}

export const Pax10: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: { [Gold]: 4 },
  recyclingBonus: Energy,
  production: { [Financier]: 2 },
  victoryPoints: 1
}

export const Headquarters: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: { [Gold]: 3, [Exploration]: 1 },
  recyclingBonus: Exploration,
  production: { [General]: 2 },
  victoryPoints: 1
}

export const SecretForces: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: { [Materials]: 2, [General]: 1 },
  recyclingBonus: Exploration,
  production: { [Science]: 1, [Exploration]: 1 },
  numberOfCopies: 4
}
