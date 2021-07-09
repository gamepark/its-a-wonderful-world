import Character from './Character'
import DeckType from './DeckType'
import Development, {developments, getDevelopmentDetails} from './Development'
import DevelopmentDetails from './DevelopmentDetails'
import DevelopmentType from './DevelopmentType'
import Resource from './Resource'

const {Energy, Materials, Science, Gold, Exploration, Krystallium} = Resource
const {Structure, Vehicle, Research, Project, Discovery} = DevelopmentType
const {Financier, General} = Character

export const FinancialCenter: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 4, [Energy]: 1},
  constructionBonus: [Financier],
  production: {[Gold]: 2},
  recyclingBonus: Gold,
  numberOfCopies: 5
}

export const IndustrialComplex: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: [Financier],
  production: {[Materials]: 1, [Gold]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 6
}

export const MilitaryBase: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: [General],
  production: {[Materials]: 1, [Science]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 6
}

export const NuclearPlant: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 4, [Science]: 1},
  production: {[Energy]: 3},
  recyclingBonus: Energy,
  numberOfCopies: 5
}

export const OffshoreOilRig: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 3, [Exploration]: 1},
  constructionBonus: [Financier],
  production: {[Energy]: 1, [Gold]: 1},
  recyclingBonus: Energy,
  numberOfCopies: 5
}

export const RecyclingPlant: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: {[Materials]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 7
}

export const ResearchCenter: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  production: {[Science]: 2},
  recyclingBonus: Science,
  numberOfCopies: 7
}

export const TransportationNetwork: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 3},
  victoryPoints: {quantity: 1, per: Vehicle},
  recyclingBonus: Materials,
  numberOfCopies: 2
}

export const WindTurbines: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: Energy,
  recyclingBonus: Energy,
  numberOfCopies: 7
}

export const AirborneLaboratory: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Energy]: 3},
  production: {[Science]: 1, [Exploration]: 1},
  recyclingBonus: Science,
  numberOfCopies: 3
}

export const AircraftCarrier: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 4},
  constructionBonus: [General, General],
  production: {resource: Exploration, factor: Vehicle},
  recyclingBonus: Materials
}

export const Icebreaker: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 1},
  production: {[Exploration]: 2},
  recyclingBonus: Exploration,
  numberOfCopies: 4
}

export const Juggernaut: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 3, [Krystallium]: 1},
  constructionBonus: [General, General],
  production: {[Exploration]: 2},
  victoryPoints: {quantity: 1, per: Vehicle},
  recyclingBonus: Materials
}

export const MegaDrill: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  production: {[Materials]: 1, [Exploration]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 4
}

export const SaucerSquadron: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 2},
  production: {[Exploration]: 3},
  recyclingBonus: Science,
  numberOfCopies: 2
}

export const Submarine: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Materials]: 2, [Energy]: 3},
  constructionBonus: [General],
  production: {[Exploration]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 3
}

export const TankDivision: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  constructionBonus: [General],
  production: Exploration,
  recyclingBonus: Materials,
  numberOfCopies: 7
}

export const Zeppelin: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Vehicle,
  constructionCost: {[Energy]: 2},
  production: Exploration,
  recyclingBonus: Exploration,
  numberOfCopies: 6
}

export const Aquaculture: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 2},
  constructionBonus: [Financier],
  victoryPoints: {quantity: 1, per: Financier},
  recyclingBonus: Science
}

export const BionicGrafts: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 5},
  constructionBonus: [General],
  production: {[Materials]: 2},
  victoryPoints: 4,
  recyclingBonus: Materials
}

export const ClimateControl: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 2, [Gold]: 1},
  victoryPoints: 2,
  recyclingBonus: Energy
}

export const Cryopreservation: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: [Financier],
  victoryPoints: {quantity: 1, per: Financier},
  recyclingBonus: Gold
}

export const GeneticUpgrades: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 4},
  constructionBonus: [Financier, Financier],
  victoryPoints: 3,
  recyclingBonus: Science
}

export const GravityInverter: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 4, [Krystallium]: 1},
  constructionBonus: [Financier],
  victoryPoints: {quantity: 2, per: Project},
  recyclingBonus: Science
}

export const HumanCloning: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 2, [Gold]: 1},
  constructionBonus: [Financier],
  production: Gold,
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const MegaBomb: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 2},
  constructionBonus: [General, General],
  victoryPoints: 3,
  recyclingBonus: Energy
}

export const Neuroscience: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 3},
  production: {resource: Science, factor: Research},
  victoryPoints: 1,
  recyclingBonus: Science
}

export const QuantumGenerator: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 3},
  victoryPoints: {quantity: 1, per: Vehicle},
  recyclingBonus: Energy
}

export const RobotAssistants: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 3},
  production: {resource: Materials, factor: Structure},
  victoryPoints: 1,
  recyclingBonus: Materials
}

export const RoboticAnimals: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 2},
  constructionBonus: [General],
  production: Materials,
  victoryPoints: 2,
  recyclingBonus: Energy
}

export const Satellites: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 4},
  constructionBonus: [General],
  production: {[Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration
}

export const SecurityAutomatons: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 1},
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Gold
}

export const SuperSoldiers: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: [General],
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Exploration
}

export const SuperSonar: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 4},
  production: {resource: Exploration, factor: Vehicle},
  victoryPoints: 1,
  recyclingBonus: Exploration
}

export const Supercomputer: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 4},
  production: Science,
  victoryPoints: {quantity: 1, per: Vehicle},
  recyclingBonus: Science
}

export const Teleportation: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 8},
  constructionBonus: [Krystallium, Krystallium],
  victoryPoints: 8,
  recyclingBonus: Exploration
}

export const TimeTravel: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 5, [Krystallium]: 3},
  victoryPoints: 15,
  recyclingBonus: Exploration
}

export const Transmutation: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 3, [Gold]: 2},
  constructionBonus: [Krystallium],
  production: {[Gold]: 3},
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const UniversalVaccine: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 3},
  victoryPoints: {quantity: 1, per: Project},
  recyclingBonus: Gold
}

export const UnknownTechnology: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 7, [Krystallium]: 1},
  victoryPoints: {quantity: 3, per: Research},
  recyclingBonus: Science
}

export const VirtualReality: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Research,
  constructionCost: {[Science]: 5},
  production: {resource: Gold, factor: Research},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const CasinoCity: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: [Financier],
  production: {[Gold]: 2},
  victoryPoints: {quantity: 1, per: Financier},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const EspionageAgency: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 2, [Gold]: 2},
  production: {[Exploration]: 2},
  victoryPoints: 1,
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const GiantDam: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 2},
  production: {[Energy]: 4},
  victoryPoints: 1,
  recyclingBonus: Energy
}

export const GiantTower: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3, [Financier]: 1},
  victoryPoints: 10,
  recyclingBonus: Gold
}

export const HarborZone: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 5},
  constructionBonus: [Financier, Financier],
  production: {[Materials]: 2, [Gold]: 2},
  victoryPoints: 2,
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const LunarBase: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 2, [Gold]: 2, [Krystallium]: 1},
  constructionBonus: [General, General],
  victoryPoints: 10,
  recyclingBonus: Exploration
}

export const MagneticTrain: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 1, [Science]: 1, [Gold]: 3},
  constructionBonus: [Financier, Financier],
  production: {resource: Gold, factor: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const Museum: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 3},
  victoryPoints: {quantity: 2, per: Discovery},
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const NationalMonument: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Materials]: 5, [Gold]: 3},
  victoryPoints: {quantity: 2, per: Project},
  recyclingBonus: Gold
}

export const PolarBase: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: [General],
  production: {[Exploration]: 3},
  victoryPoints: {quantity: 2, per: Discovery},
  recyclingBonus: Exploration
}

export const PropagandaCenter: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 3},
  constructionBonus: [General],
  production: {resource: Gold, factor: Project},
  victoryPoints: 1,
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const SecretLaboratory: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3},
  constructionBonus: [Krystallium],
  production: {[Science]: 2},
  victoryPoints: {quantity: 1, per: Research},
  recyclingBonus: Science,
  numberOfCopies: 2
}

export const SecretSociety: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 3, [Krystallium]: 1},
  victoryPoints: {quantity: 1, per: Financier},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const SolarCannon: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 3},
  constructionBonus: [General],
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Energy
}

export const SpaceElevator: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 3, [Science]: 1, [Gold]: 2},
  constructionBonus: [Financier],
  victoryPoints: {quantity: 1, per: Financier},
  recyclingBonus: Energy
}

export const UndergroundCity: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 3},
  constructionBonus: [Krystallium],
  production: {[Materials]: 2, [Energy]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy,
  numberOfCopies: 2
}

export const UnderwaterCity: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 2},
  production: {[Science]: 1, [Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const UniversalExposition: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 3, [Financier]: 2},
  victoryPoints: {quantity: 3, per: Research},
  recyclingBonus: Gold
}

export const University: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Science]: 1, [Gold]: 2},
  production: {resource: Science, factor: Project},
  victoryPoints: 2,
  recyclingBonus: Science
}

export const WorldCongress: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Project,
  constructionCost: {[Gold]: 6, [Financier]: 2},
  victoryPoints: {quantity: 3, per: Project},
  recyclingBonus: Gold
}

export const AlexandersTomb: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: [General, General],
  victoryPoints: 10,
  recyclingBonus: Gold
}

export const AncientAstronauts: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 6, [General]: 1},
  constructionBonus: [Krystallium, Krystallium],
  production: {resource: Science, factor: Discovery},
  victoryPoints: 10,
  recyclingBonus: Science
}

export const ArkOfTheCovenant: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: [Krystallium],
  victoryPoints: 5,
  recyclingBonus: Exploration
}

export const Atlantis: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 7, [Krystallium]: 1},
  victoryPoints: {quantity: 2, per: General},
  recyclingBonus: Gold
}

export const BermudaTriangle: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: [Krystallium],
  production: Science,
  victoryPoints: 4,
  recyclingBonus: Science
}

export const BlackBeardsTreasure: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 3},
  production: {[Gold]: 1, [Exploration]: 1},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const CenterOfTheEarth: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 5, [General]: 2},
  victoryPoints: 15,
  recyclingBonus: Exploration
}

export const CitiesOfGold: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {[Gold]: 3},
  victoryPoints: 3,
  recyclingBonus: Gold
}

export const CityOfAgartha: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 4, [Krystallium]: 1},
  production: {[Exploration]: 2},
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Exploration
}

export const FountainOfYouth: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: [Krystallium, Krystallium, Krystallium],
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Energy
}

export const GardensOfTheHesperides: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  victoryPoints: {quantity: 2, per: Project},
  recyclingBonus: Exploration
}

export const IslandOfAvalon: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  production: Science,
  victoryPoints: 7,
  recyclingBonus: Science
}

export const KingSolomonsMines: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {resource: Gold, factor: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const LostContinentOfMu: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: [Krystallium, Krystallium],
  production: Gold,
  victoryPoints: {quantity: 2, per: Discovery},
  recyclingBonus: Gold
}

export const ParallelDimension: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Science]: 3, [Exploration]: 4, [General]: 1},
  constructionBonus: [Krystallium, Krystallium, Krystallium],
  victoryPoints: {quantity: 3, per: Research},
  recyclingBonus: Exploration
}

export const Roswell: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: [General],
  production: Science,
  victoryPoints: {quantity: 1, per: General},
  recyclingBonus: Science
}

export const TreasureOfTheTemplars: DevelopmentDetails = {
  deck: DeckType.Default,
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  constructionBonus: [Krystallium, Krystallium],
  production: {[Gold]: 2},
  victoryPoints: 3,
  recyclingBonus: Gold
}

function createCopies(development: Development): Development[] {
  return Array(getDevelopmentDetails(development).numberOfCopies || 1).fill(development)
}

export const developmentCards: Development[] = developments.flatMap(createCopies)

export const baseDevelopmentCardIds = Array.from(developmentCards.map(getDevelopmentDetails).filter(development => development.deck === DeckType.Default).keys())
export const ascensionDevelopmentCardIds = Array.from(developmentCards.keys()).slice(baseDevelopmentCardIds.length)

export function getCardType(card: number): DeckType {
  return getDevelopmentDetails(developmentCards[card]).deck
}

export function getCardDetails(card: number): DevelopmentDetails {
  return getDevelopmentDetails(developmentCards[card])
}