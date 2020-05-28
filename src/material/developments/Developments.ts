import Character from '../characters/Character'
import Resource from '../resources/Resource'
import Development from './Development'
import DevelopmentType from './DevelopmentType'

const {Energy, Materials, Science, Gold, Exploration, Krystallium} = Resource
const {Structure, Vehicle, Research, Project, Discovery} = DevelopmentType
const {Financier, General} = Character

export const FinancialCenter: Development = {
  type: Structure,
  constructionCost: {[Materials]: 4, [Energy]: 1},
  constructionBonus: Financier,
  production: {[Gold]: 2},
  recyclingBonus: Gold,
  numberOfCopies: 5
}

export const IndustrialComplex: Development = {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: Financier,
  production: {[Materials]: 1, [Gold]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 6
}

export const MilitaryBase: Development = {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: General,
  production: {[Materials]: 1, [Science]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 6
}

export const NuclearPlant: Development = {
  type: Structure,
  constructionCost: {[Materials]: 4, [Science]: 1},
  production: {[Energy]: 3},
  recyclingBonus: Energy,
  numberOfCopies: 5
}

export const OffshoreOilRig: Development = {
  type: Structure,
  constructionCost: {[Materials]: 3, [Exploration]: 1},
  constructionBonus: Financier,
  production: {[Energy]: 1, [Gold]: 1},
  recyclingBonus: Energy,
  numberOfCopies: 5
}

export const RecyclingPlant: Development = {
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: {[Materials]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 7
}

export const ResearchCenter: Development = {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  production: {[Science]: 2},
  recyclingBonus: Science,
  numberOfCopies: 7
}

export const TransportationNetwork: Development = {
  type: Structure,
  constructionCost: {[Materials]: 3},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 2
}

export const WindTurbines: Development = {
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: Energy,
  recyclingBonus: Energy,
  numberOfCopies: 7
}

export const AirborneLaboratory: Development = {
  type: Vehicle,
  constructionCost: {[Energy]: 3},
  production: {[Science]: 1, [Exploration]: 1},
  recyclingBonus: Science,
  numberOfCopies: 3
}

export const AircraftCarrier: Development = {
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 4},
  constructionBonus: {[General]: 2},
  production: {[Exploration]: Vehicle},
  recyclingBonus: Materials
}

export const Icebreaker: Development = {
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 1},
  production: {[Exploration]: 2},
  recyclingBonus: Exploration,
  numberOfCopies: 4
}

export const Juggernaut: Development = {
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 3, [Krystallium]: 1},
  constructionBonus: {[General]: 2},
  production: {[Exploration]: 2},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Materials
}

export const MegaDrill: Development = {
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  production: {[Materials]: 1, [Exploration]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 4
}

export const SaucerSquadron: Development = {
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 2},
  production: {[Exploration]: 3},
  recyclingBonus: Science,
  numberOfCopies: 2
}

export const Submarine: Development = {
  type: Vehicle,
  constructionCost: {[Materials]: 2, [Energy]: 3},
  constructionBonus: General,
  production: {[Exploration]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 3
}

export const TankDivision: Development = {
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  constructionBonus: General,
  production: Exploration,
  recyclingBonus: Materials,
  numberOfCopies: 7
}

export const Zeppelin: Development = {
  type: Vehicle,
  constructionCost: {[Energy]: 2},
  production: Exploration,
  recyclingBonus: Exploration,
  numberOfCopies: 6
}

export const Aquaculture: Development = {
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 2},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Science
}

export const BionicCrafts: Development = {
  type: Research,
  constructionCost: {[Science]: 5},
  constructionBonus: General,
  production: {[Materials]: 2},
  victoryPoints: 4,
  recyclingBonus: Materials
}

export const ClimateControl: Development = {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 2, [Gold]: 1},
  victoryPoints: 2,
  recyclingBonus: Energy
}

export const Cryopreservation: Development = {
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold
}

export const GeneticUpgrades: Development = {
  type: Research,
  constructionCost: {[Science]: 4},
  constructionBonus: {[Financier]: 2},
  victoryPoints: 3,
  recyclingBonus: Science
}

export const GravityInverter: Development = {
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 4, [Krystallium]: 1},
  constructionBonus: Financier,
  victoryPoints: {[Project]: 2},
  recyclingBonus: Science
}

export const HumanCloning: Development = {
  type: Research,
  constructionCost: {[Science]: 2, [Gold]: 1},
  constructionBonus: Financier,
  production: Gold,
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const MegaBomb: Development = {
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 2},
  constructionBonus: {[General]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy
}

export const Neuroscience: Development = {
  type: Research,
  constructionCost: {[Science]: 3},
  production: {[Science]: Research},
  victoryPoints: 1,
  recyclingBonus: Science
}

export const QuantumGenerator: Development = {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 3},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Energy
}

export const RobotAssistants: Development = {
  type: Research,
  constructionCost: {[Science]: 3},
  production: {[Materials]: Structure},
  victoryPoints: 1,
  recyclingBonus: Materials
}

export const RoboticAnimals: Development = {
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 2},
  constructionBonus: General,
  production: Materials,
  victoryPoints: 2,
  recyclingBonus: Energy
}

export const Satellites: Development = {
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 4},
  constructionBonus: General,
  production: {[Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration
}

export const SecurityAutomatons: Development = {
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 1},
  victoryPoints: {[General]: 1},
  recyclingBonus: Gold
}

export const SuperSoldiers: Development = {
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: General,
  victoryPoints: {[General]: 1},
  recyclingBonus: Exploration
}

export const SuperSonar: Development = {
  type: Research,
  constructionCost: {[Science]: 4},
  production: {[Exploration]: Vehicle},
  victoryPoints: 1,
  recyclingBonus: Exploration
}

export const Supercomputer: Development = {
  type: Research,
  constructionCost: {[Science]: 4},
  production: Science,
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Science
}

export const Teleportation: Development = {
  type: Research,
  constructionCost: {[Science]: 8},
  constructionBonus: {[Krystallium]: 2},
  victoryPoints: 8,
  recyclingBonus: Exploration
}

export const TimeTravel: Development = {
  type: Research,
  constructionCost: {[Science]: 5, [Krystallium]: 3},
  victoryPoints: 15,
  recyclingBonus: Exploration
}

export const Transmutation: Development = {
  type: Research,
  constructionCost: {[Science]: 3, [Gold]: 2},
  constructionBonus: Krystallium,
  production: {[Gold]: 3},
  victoryPoints: 1,
  recyclingBonus: Gold
}

export const UniversalVaccine: Development = {
  type: Research,
  constructionCost: {[Science]: 3},
  victoryPoints: {[Project]: 1},
  recyclingBonus: Gold
}

export const UnknownTechnology: Development = {
  type: Research,
  constructionCost: {[Science]: 7, [Krystallium]: 1},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Science
}

export const VirtualReality: Development = {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Gold]: Research},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const CasinoCity: Development = {
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: Financier,
  production: {[Gold]: 2},
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const EspionageAgency: Development = {
  type: Project,
  constructionCost: {[Energy]: 2, [Gold]: 2},
  production: {[Exploration]: 2},
  victoryPoints: 1,
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const GiantDam: Development = {
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 2},
  production: {[Energy]: 4},
  victoryPoints: 1,
  recyclingBonus: Energy
}

export const GiantTower: Development = {
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3, [Financier]: 1},
  victoryPoints: 10,
  recyclingBonus: Gold
}

export const HarborZone: Development = {
  type: Project,
  constructionCost: {[Gold]: 5},
  constructionBonus: {[Financier]: 2},
  production: {[Materials]: 2, [Gold]: 2},
  victoryPoints: 2,
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const LunarBase: Development = {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 2, [Gold]: 2, [Krystallium]: 1},
  constructionBonus: {[General]: 2},
  victoryPoints: 10,
  recyclingBonus: Exploration
}

export const MagneticTrain: Development = {
  type: Project,
  constructionCost: {[Energy]: 1, [Science]: 1, [Gold]: 3},
  constructionBonus: {[Financier]: 2},
  production: {[Gold]: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const Museum: Development = {
  type: Project,
  constructionCost: {[Gold]: 3},
  victoryPoints: {[Discovery]: 2},
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const NationalMonument: Development = {
  type: Project,
  constructionCost: {[Materials]: 5, [Gold]: 3},
  victoryPoints: {[Project]: 2},
  recyclingBonus: Gold
}

export const PolarBase: Development = {
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: General,
  production: {[Exploration]: 3},
  victoryPoints: {[Discovery]: 2},
  recyclingBonus: Exploration
}

export const PropagandaCenter: Development = {
  type: Project,
  constructionCost: {[Gold]: 3},
  constructionBonus: General,
  production: {[Gold]: Project},
  victoryPoints: 1,
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const SecretLaboratory: Development = {
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3},
  constructionBonus: Krystallium,
  production: {[Science]: 2},
  victoryPoints: {[Research]: 1},
  recyclingBonus: Science,
  numberOfCopies: 2
}

export const SecretSociety: Development = {
  type: Project,
  constructionCost: {[Gold]: 3, [Krystallium]: 1},
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 2
}

export const SolarCannon: Development = {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 3},
  constructionBonus: General,
  victoryPoints: {[General]: 1},
  recyclingBonus: Energy
}

export const SpaceElevator: Development = {
  type: Project,
  constructionCost: {[Energy]: 3, [Science]: 1, [Gold]: 2},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Energy
}

export const UndergroundCity: Development = {
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 3},
  constructionBonus: Krystallium,
  production: {[Materials]: 2, [Energy]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy,
  numberOfCopies: 2
}

export const UnderwaterCity: Development = {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 2},
  production: {[Science]: 1, [Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration,
  numberOfCopies: 2
}

export const UniversalExposition: Development = {
  type: Project,
  constructionCost: {[Gold]: 3, [Financier]: 2},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Gold
}

export const University: Development = {
  type: Project,
  constructionCost: {[Science]: 1, [Gold]: 2},
  production: {[Science]: Project},
  victoryPoints: 2,
  recyclingBonus: Science
}

export const WorldCongress: Development = {
  type: Project,
  constructionCost: {[Gold]: 6, [Financier]: 2},
  victoryPoints: {[Project]: 3},
  recyclingBonus: Gold
}

export const AlexandersTomb: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: {[General]: 2},
  victoryPoints: 10,
  recyclingBonus: Gold
}

export const AncientAstronauts: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 6, [General]: 1},
  constructionBonus: {[Krystallium]: 2},
  production: {[Science]: Discovery},
  victoryPoints: 10,
  recyclingBonus: Science
}

export const ArkOfTheCovenant: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: Krystallium,
  victoryPoints: 5,
  recyclingBonus: Exploration
}

export const Atlantis: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 7, [Krystallium]: 1},
  victoryPoints: {[General]: 2},
  recyclingBonus: Gold
}

export const BermudaTriangle: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: Krystallium,
  production: Science,
  victoryPoints: 4,
  recyclingBonus: Science
}

export const BlackBeardsTreasure: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 3},
  production: {[Gold]: 1, [Exploration]: 1},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const CenterOfTheEarth: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 5, [General]: 2},
  victoryPoints: 15,
  recyclingBonus: Exploration
}

export const CitiesOfGold: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {[Gold]: 3},
  victoryPoints: 3,
  recyclingBonus: Gold
}

export const CityOfAgartha: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 4, [Krystallium]: 1},
  production: {[Exploration]: 2},
  victoryPoints: {[General]: 1},
  recyclingBonus: Exploration
}

export const FountainOfYouth: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: {[Krystallium]: 3},
  victoryPoints: {[General]: 1},
  recyclingBonus: Energy
}

export const GardensOfTheHesperides: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  victoryPoints: {[Project]: 2},
  recyclingBonus: Exploration
}

export const IslandOfAvalon: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  production: Science,
  victoryPoints: 7,
  recyclingBonus: Science
}

export const KingSolomonsMines: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {[Gold]: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
}

export const LostContinentOfMu: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: {[Krystallium]: 2},
  production: Gold,
  victoryPoints: {[Discovery]: 2},
  recyclingBonus: Gold
}

export const ParallelDimension: Development = {
  type: Discovery,
  constructionCost: {[Science]: 3, [Exploration]: 4, [General]: 1},
  constructionBonus: {[Krystallium]: 3},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Exploration
}

export const Roswell: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: General,
  production: Science,
  victoryPoints: {[General]: 1},
  recyclingBonus: Science
}

export const TreasureOfTheTemplars: Development = {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  constructionBonus: {[Krystallium]: 2},
  production: {[Gold]: 2},
  victoryPoints: 3,
  recyclingBonus: Gold
}

export const developments: Development[] = [
  FinancialCenter, IndustrialComplex, MilitaryBase, NuclearPlant, OffshoreOilRig, RecyclingPlant, ResearchCenter, TransportationNetwork, WindTurbines,
  AirborneLaboratory, AircraftCarrier, Icebreaker, Juggernaut, MegaDrill, SaucerSquadron, Submarine, TankDivision, Zeppelin,
  Aquaculture, BionicCrafts, ClimateControl, Cryopreservation, GeneticUpgrades, GravityInverter, HumanCloning, MegaBomb, Neuroscience, QuantumGenerator, RobotAssistants, RoboticAnimals, Satellites, SecurityAutomatons, SuperSoldiers, SuperSonar, Supercomputer, Teleportation, TimeTravel, Transmutation, UniversalVaccine, UnknownTechnology, VirtualReality,
  CasinoCity, EspionageAgency, GiantDam, GiantTower, HarborZone, LunarBase, MagneticTrain, Museum, NationalMonument, PolarBase, PropagandaCenter, SecretLaboratory, SecretSociety, SolarCannon, SpaceElevator, UndergroundCity, UnderwaterCity, UniversalExposition, University, WorldCongress,
  AlexandersTomb, AncientAstronauts, ArkOfTheCovenant, Atlantis, BermudaTriangle, BlackBeardsTreasure, CenterOfTheEarth, CitiesOfGold, CityOfAgartha, FountainOfYouth, GardensOfTheHesperides, IslandOfAvalon, KingSolomonsMines, LostContinentOfMu, ParallelDimension, Roswell, TreasureOfTheTemplars]

export const developmentCards: Development[] = developments.flatMap(development => Array(development.numberOfCopies || 1).fill(development))