import Character from './Character'
import DeckType from './DeckType'
import DevelopmentDetails from './DevelopmentDetails'
import DevelopmentType from './DevelopmentType'
import Resource from './Resource'

const {Energy, Materials, Science, Gold, Exploration, Krystallium} = Resource
const {Structure, Vehicle, Research, Project, Discovery} = DevelopmentType
const {Financier, General} = Character

export const BorderPatrol: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 2},
  constructionBonus: [General],
  production: {[Gold]: 1, [Exploration]: -1},
  recyclingBonus: Exploration,
  numberOfCopies: 3
}

export const KrystalliumPowerPlant: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 1, [Science]: 2, [Krystallium]: 1},
  production: {[Materials]: 3, [Energy]: 3},
  recyclingBonus: Science
}

export const RobotFactory: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 2, [Science]: 2},
  production: {[Materials]: -1, [Energy]: 2, [Science]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 2
}

export const GoldMine: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1, [Exploration]: 1},
  production: {[Gold]: 3},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const SecretBase: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 4, [Energy]: 1, [Science]: 1},
  constructionBonus: [General],
  production: {[Energy]: -1, [Exploration]: 3},
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const LawlessZone: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: {[Materials]: 1, [Energy]: 1, [Gold]: -1},
  recyclingBonus: Materials,
  numberOfCopies: 3
}

export const OccultDistrict: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 1},
  constructionBonus: [Krystallium],
  production: {[Materials]: 1, [Science]: -1},
  recyclingBonus: Materials,
  numberOfCopies: 3
}

export const OffshoreLaboratory: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Structure,
  constructionCost: {[Materials]: 2, [Gold]: 1},
  constructionBonus: [Financier],
  production: {[Energy]: -1, [Science]: 1, [Gold]: 1},
  recyclingBonus: Energy,
  numberOfCopies: 3
}

export const FloatingPalace: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 2, [General]: 1},
  production: {[Energy]: 2},
  victoryPoints: {quantity: 2, per: [Vehicle]},
  recyclingBonus: Energy
}

export const GiantRobot: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 5, [Science]: 2, [Krystallium]: 1},
  constructionBonus: [General, General],
  victoryPoints: {quantity: 6, per: [Structure, Vehicle]},
  recyclingBonus: Materials
}

export const ArmoredConvoy: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  production: {[Materials]: -1, [Gold]: 2},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const MobileBase: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Materials]: 2, [Energy]: 3, [Science]: 1},
  constructionBonus: [General],
  production: {[Materials]: -1, [Science]: 2, [Exploration]: 2},
  recyclingBonus: Science,
  numberOfCopies: 2
}

export const Inquisitors: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  production: {[Science]: -1, [Gold]: 1, [Exploration]: 1},
  recyclingBonus: Science,
  numberOfCopies: 3
}

export const Raiders: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Vehicle,
  constructionCost: {[Energy]: 1, [Gold]: 1},
  production: {[Gold]: -1, [Exploration]: 2},
  recyclingBonus: Gold,
  numberOfCopies: 3
}

export const PlanetaryArchives: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Science]: 4, [Exploration]: 2},
  production: {[Science]: 2},
  victoryPoints: {quantity: 3, per: Discovery},
  recyclingBonus: Exploration
}

export const Telekinesis: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Science]: 5, [Krystallium]: 1},
  victoryPoints: {quantity: 6, per: [Vehicle, Financier]},
  recyclingBonus: Science
}

export const ArtificialIntelligence: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Science]: 3},
  production: {resource: Science, factor: Vehicle},
  victoryPoints: 1,
  recyclingBonus: Science
}

export const DarkMatter: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Materials]: 5, [Science]: 5, [Krystallium]: 2},
  victoryPoints: {quantity: 6, per: [Structure, Research]},
  recyclingBonus: Materials
}

export const ArtificialSun: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Energy]: 4, [Science]: 7, [Gold]: 2, [Krystallium]: 1},
  victoryPoints: 25,
  recyclingBonus: Energy
}

export const Immortality: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Energy]: 3, [Science]: 8, [Financier]: 1, [General]: 1},
  victoryPoints: {quantity: 9, per: [Research, Project]},
  recyclingBonus: Science
}

export const Utopia: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Materials]: 2, [Energy]: 2, [Science]: 2, [Gold]: 2, [Exploration]: 2, [Financier]: 2},
  victoryPoints: {quantity: 12, per: [Project, Discovery]},
  recyclingBonus: Gold
}

export const TaxHaven: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Research,
  constructionCost: {[Science]: 2, [Gold]: 2},
  constructionBonus: [Financier, Financier],
  production: {[Energy]: -1, [Gold]: 2},
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const CelestialCathedral: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Materials]: 4, [Gold]: 5, [Exploration]: 2},
  victoryPoints: {quantity: 8, per: [Vehicle, Project]},
  recyclingBonus: Gold
}

export const IntercontinentalNetwork: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Materials]: 2, [Energy]: 2, [Gold]: 3},
  victoryPoints: {quantity: 6, per: [Discovery, Financier]},
  recyclingBonus: Materials
}

export const HighSecurityPrison: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 4, [Financier]: 1},
  victoryPoints: {quantity: 5, per: [Structure, General]},
  recyclingBonus: Materials
}

export const OrbitalStation: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Energy]: 3, [Science]: 3, [Gold]: 5},
  victoryPoints: {quantity: 6, per: [Financier, General]},
  recyclingBonus: Science
}

export const WorldBank: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Gold]: 7, [Exploration]: 5, [General]: 1},
  victoryPoints: {quantity: 7, per: [Structure, Project]},
  recyclingBonus: Gold
}

export const LuxuryClinic: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Science]: 1, [Gold]: 2},
  production: {[Energy]: -1, [Science]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy,
  numberOfCopies: 2
}

export const TheWall: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Materials]: 9, [Gold]: 4, [General]: 2},
  victoryPoints: 25,
  recyclingBonus: Materials
}

export const Consortium: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 3},
  constructionBonus: [Financier],
  production: {[Gold]: 3, [Exploration]: 2},
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const MiningAsteroid: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 2, [Gold]: 2},
  constructionBonus: [Krystallium, Krystallium],
  production: {[Materials]: 4},
  victoryPoints: 3,
  recyclingBonus: Materials
}

export const Hyperborea: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Science]: 4, [Exploration]: 5, [General]: 2},
  victoryPoints: {quantity: 10, per: [Research, Discovery]},
  recyclingBonus: Science
}

export const Valhalla: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Gold]: 2, [Exploration]: 5, [Krystallium]: 1},
  victoryPoints: {quantity: 6, per: [Project, General]},
  recyclingBonus: Gold
}

export const MysteriousVessel: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Science]: 2, [Exploration]: 6},
  victoryPoints: {quantity: 6, per: [Vehicle, Research]},
  recyclingBonus: Exploration
}

export const Pandemonium: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Exploration]: 4, [Financier]: 2},
  victoryPoints: {quantity: 2, per: [Structure]},
  recyclingBonus: Energy
}

export const PandoraBox: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: [Krystallium],
  production: {[Materials]: 1, [Energy]: 1, [Science]: 1, [Gold]: 1},
  victoryPoints: 1,
  recyclingBonus: Exploration
}

export const AlphaCentauri: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Energy]: 3, [Science]: 3, [Exploration]: 8},
  victoryPoints: 25,
  recyclingBonus: Exploration
}

export const Shambhala: DevelopmentDetails = {
  deck: DeckType.Ascension,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {resource: Exploration, factor: Project},
  victoryPoints: 4,
  recyclingBonus: Exploration
}

export const ascensionDevelopments: DevelopmentDetails[] = [
  BorderPatrol, KrystalliumPowerPlant, RobotFactory, GoldMine, SecretBase, LawlessZone, OccultDistrict, OffshoreLaboratory,
  FloatingPalace, GiantRobot, ArmoredConvoy, MobileBase, Inquisitors, Raiders,
  PlanetaryArchives, Telekinesis, ArtificialIntelligence, DarkMatter, ArtificialSun, Immortality, Utopia, TaxHaven,
  CelestialCathedral, IntercontinentalNetwork, HighSecurityPrison, OrbitalStation, WorldBank, LuxuryClinic, TheWall, Consortium, MiningAsteroid,
  Hyperborea, Valhalla, MysteriousVessel, Pandemonium, PandoraBox, AlphaCentauri, Shambhala
]