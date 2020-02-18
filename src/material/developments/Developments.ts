import Character from '../characters/Character'
import Development from './Development'
import DevelopmentAnatomy from './DevelopmentAnatomy'
import DevelopmentType from './DevelopmentType'
import Resource from '../resources/Resource'

const {Energy, Materials, Science, Gold, Exploration, Krystallium} = Resource
const {Structure, Vehicle, Research, Project, Discovery} = DevelopmentType
const {Financier, General} = Character

const DevelopmentsAnatomy = new Map<Development, DevelopmentAnatomy>()

DevelopmentsAnatomy.set(Development.FinancialCenter, {
  type: Structure,
  constructionCost: {[Materials]: 4, [Energy]: 1},
  constructionBonus: Financier,
  production: {[Gold]: 2},
  recyclingBonus: Gold,
  numberOfCopies: 5
})

DevelopmentsAnatomy.set(Development.IndustrialComplex, {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: Financier,
  production: {[Materials]: 1, [Gold]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 6
})

DevelopmentsAnatomy.set(Development.MilitaryBase, {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  constructionBonus: General,
  production: {[Materials]: 1, [Science]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 6
})

DevelopmentsAnatomy.set(Development.NuclearPlant, {
  type: Structure,
  constructionCost: {[Materials]: 4, [Science]: 1},
  production: {[Energy]: 3},
  recyclingBonus: Energy,
  numberOfCopies: 5
})

DevelopmentsAnatomy.set(Development.OffshoreOilRig, {
  type: Structure,
  constructionCost: {[Materials]: 3, [Exploration]: 1},
  constructionBonus: Financier,
  production: {[Energy]: 1, [Gold]: 1},
  recyclingBonus: Energy,
  numberOfCopies: 5
})

DevelopmentsAnatomy.set(Development.RecyclingPlant, {
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: {[Materials]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 7
})

DevelopmentsAnatomy.set(Development.ResearchCenter, {
  type: Structure,
  constructionCost: {[Materials]: 3, [Energy]: 1},
  production: {[Science]: 2},
  recyclingBonus: Science,
  numberOfCopies: 7
})

DevelopmentsAnatomy.set(Development.TransportationNetwork, {
  type: Structure,
  constructionCost: {[Materials]: 3},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.WindTurbines, {
  type: Structure,
  constructionCost: {[Materials]: 2},
  production: Energy,
  recyclingBonus: Energy,
  numberOfCopies: 7
})

DevelopmentsAnatomy.set(Development.AirborneLaboratory, {
  type: Vehicle,
  constructionCost: {[Energy]: 3},
  production: {[Science]: 1, [Exploration]: 1},
  recyclingBonus: Science,
  numberOfCopies: 3
})

DevelopmentsAnatomy.set(Development.AircraftCarrier, {
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 4},
  constructionBonus: {[General]: 2},
  production: {[Exploration]: Vehicle},
  recyclingBonus: Materials
})

DevelopmentsAnatomy.set(Development.Icebreaker, {
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 1},
  production: {[Exploration]: 2},
  recyclingBonus: Exploration,
  numberOfCopies: 4
})

DevelopmentsAnatomy.set(Development.Juggernaut, {
  type: Vehicle,
  constructionCost: {[Materials]: 3, [Energy]: 3, [Krystallium]: 1},
  constructionBonus: {[General]: 2},
  production: {[Exploration]: 2},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Materials
})

DevelopmentsAnatomy.set(Development.MegaDrill, {
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  production: {[Materials]: 1, [Exploration]: 1},
  recyclingBonus: Materials,
  numberOfCopies: 4
})

DevelopmentsAnatomy.set(Development.SaucerSquadron, {
  type: Vehicle,
  constructionCost: {[Energy]: 3, [Science]: 2},
  production: {[Exploration]: 3},
  recyclingBonus: Science,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.Submarine, {
  type: Vehicle,
  constructionCost: {[Materials]: 2, [Energy]: 3},
  constructionBonus: General,
  production: {[Exploration]: 2},
  recyclingBonus: Materials,
  numberOfCopies: 3
})

DevelopmentsAnatomy.set(Development.TankDivision, {
  type: Vehicle,
  constructionCost: {[Materials]: 1, [Energy]: 2},
  constructionBonus: General,
  production: Exploration,
  recyclingBonus: Materials,
  numberOfCopies: 7
})

DevelopmentsAnatomy.set(Development.Zeppelin, {
  type: Vehicle,
  constructionCost: {[Energy]: 2},
  production: Exploration,
  recyclingBonus: Exploration,
  numberOfCopies: 6
})

DevelopmentsAnatomy.set(Development.Aquaculture, {
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 2},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.BionicCrafts, {
  type: Research,
  constructionCost: {[Science]: 5},
  constructionBonus: General,
  production: {[Materials]: 2},
  victoryPoints: 4,
  recyclingBonus: Materials
})

DevelopmentsAnatomy.set(Development.ClimateControl, {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 2, [Gold]: 1},
  victoryPoints: 2,
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.Cryopreservation, {
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.GeneticUpgrades, {
  type: Research,
  constructionCost: {[Science]: 4},
  constructionBonus: {[Financier]: 2},
  victoryPoints: 3,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.GravityInverter, {
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 4, [Krystallium]: 1},
  constructionBonus: Financier,
  victoryPoints: {[Project]: 2},
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.HumanCloning, {
  type: Research,
  constructionCost: {[Science]: 2, [Gold]: 1},
  constructionBonus: Financier,
  production: Gold,
  victoryPoints: 1,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.MegaBomb, {
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 2},
  constructionBonus: {[General]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.Neuroscience, {
  type: Research,
  constructionCost: {[Science]: 3},
  production: {[Science]: Research},
  victoryPoints: 1,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.QuantumGenerator, {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Energy]: 3},
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.RobotAssistants, {
  type: Research,
  constructionCost: {[Science]: 3},
  production: {[Materials]: Structure},
  victoryPoints: 1,
  recyclingBonus: Materials
})

DevelopmentsAnatomy.set(Development.RoboticAnimals, {
  type: Research,
  constructionCost: {[Energy]: 1, [Science]: 2},
  constructionBonus: General,
  production: Materials,
  victoryPoints: 2,
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.Satellites, {
  type: Research,
  constructionCost: {[Energy]: 2, [Science]: 4},
  constructionBonus: General,
  production: {[Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.SecurityAutomatons, {
  type: Research,
  constructionCost: {[Science]: 4, [Gold]: 1},
  victoryPoints: {[General]: 1},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.SuperSoldiers, {
  type: Research,
  constructionCost: {[Science]: 7},
  constructionBonus: General,
  victoryPoints: {[General]: 1},
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.SuperSonar, {
  type: Research,
  constructionCost: {[Science]: 4},
  production: {[Exploration]: Vehicle},
  victoryPoints: 1,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.Supercomputer, {
  type: Research,
  constructionCost: {[Science]: 4},
  production: Science,
  victoryPoints: {[Vehicle]: 1},
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.TimeTravel, {
  type: Research,
  constructionCost: {[Science]: 5, [Krystallium]: 3},
  victoryPoints: 15,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.Transmutation, {
  type: Research,
  constructionCost: {[Science]: 3, [Gold]: 2},
  constructionBonus: Krystallium,
  production: {[Gold]: 3},
  victoryPoints: 1,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.UniversalVaccine, {
  type: Research,
  constructionCost: {[Science]: 3},
  victoryPoints: {[Project]: 1},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.UnknownTechnology, {
  type: Research,
  constructionCost: {[Science]: 7, [Krystallium]: 1},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.VirtualReality, {
  type: Research,
  constructionCost: {[Science]: 5},
  production: {[Gold]: Research},
  victoryPoints: 2,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.CasinoCity, {
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: Financier,
  production: {[Gold]: 2},
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.EspionageAgency, {
  type: Project,
  constructionCost: {[Energy]: 2, [Gold]: 2},
  production: {[Exploration]: 2},
  victoryPoints: 1,
  recyclingBonus: Exploration,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.GiantDam, {
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 2},
  production: {[Energy]: 4},
  victoryPoints: 1,
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.GiantTower, {
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3, [Financier]: 1},
  victoryPoints: 10,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.HarborZone, {
  type: Project,
  constructionCost: {[Gold]: 5},
  constructionBonus: {[Financier]: 2},
  production: {[Materials]: 2, [Gold]: 2},
  victoryPoints: 2,
  recyclingBonus: Gold,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.LunarBase, {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 2, [Gold]: 2, [Krystallium]: 1},
  constructionBonus: {[General]: 2},
  victoryPoints: 10,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.MagneticTrain, {
  type: Project,
  constructionCost: {[Energy]: 1, [Science]: 1, [Gold]: 3},
  constructionBonus: {[Financier]: 2},
  production: {[Gold]: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.Museum, {
  type: Project,
  constructionCost: {[Gold]: 3},
  victoryPoints: {[Discovery]: 2},
  recyclingBonus: Exploration,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.NationalMonument, {
  type: Project,
  constructionCost: {[Materials]: 5, [Gold]: 3},
  victoryPoints: {[Project]: 2},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.PolarBase, {
  type: Project,
  constructionCost: {[Energy]: 3, [Gold]: 4},
  constructionBonus: General,
  production: {[Exploration]: 3},
  victoryPoints: {[Project]: 2},
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.PropagandaCenter, {
  type: Project,
  constructionCost: {[Gold]: 3},
  constructionBonus: General,
  production: {[Gold]: Project},
  victoryPoints: 1,
  recyclingBonus: Gold,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.SecretLaboratory, {
  type: Project,
  constructionCost: {[Materials]: 2, [Gold]: 3},
  constructionBonus: Krystallium,
  production: {[Science]: 2},
  victoryPoints: {[Research]: 1},
  recyclingBonus: Science,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.SecretSociety, {
  type: Project,
  constructionCost: {[Gold]: 3, [Krystallium]: 1},
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Gold,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.SolarCannon, {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 1, [Gold]: 3},
  constructionBonus: General,
  victoryPoints: {[General]: 1},
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.SpaceElevator, {
  type: Project,
  constructionCost: {[Energy]: 3, [Science]: 1, [Gold]: 2},
  constructionBonus: Financier,
  victoryPoints: {[Financier]: 1},
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.UndergroundCity, {
  type: Project,
  constructionCost: {[Materials]: 3, [Gold]: 3},
  constructionBonus: Krystallium,
  production: {[Materials]: 2, [Energy]: 2},
  victoryPoints: 3,
  recyclingBonus: Energy,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.UnderwaterCity, {
  type: Project,
  constructionCost: {[Energy]: 2, [Science]: 2, [Gold]: 2},
  production: {[Science]: 1, [Exploration]: 2},
  victoryPoints: 3,
  recyclingBonus: Exploration,
  numberOfCopies: 2
})

DevelopmentsAnatomy.set(Development.UniversalExposition, {
  type: Project,
  constructionCost: {[Gold]: 3, [Financier]: 2},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.University, {
  type: Project,
  constructionCost: {[Science]: 1, [Gold]: 2},
  production: {[Science]: Project},
  victoryPoints: 2,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.WorldCongress, {
  type: Project,
  constructionCost: {[Gold]: 6, [Financier]: 2},
  victoryPoints: {[Project]: 3},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.AlexandersTomb, {
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: {[General]: 2},
  victoryPoints: 10,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.AncientAstronauts, {
  type: Discovery,
  constructionCost: {[Exploration]: 6, [General]: 1},
  constructionBonus: {[Krystallium]: 2},
  production: {[Science]: Discovery},
  victoryPoints: 10,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.ArkOfTheCovenant, {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: Krystallium,
  victoryPoints: 5,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.Atlantis, {
  type: Discovery,
  constructionCost: {[Exploration]: 7, [Krystallium]: 1},
  victoryPoints: {[General]: 2},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.BermudaTriangle, {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  constructionBonus: Krystallium,
  production: Science,
  victoryPoints: 4,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.BlackBeardsTreasure, {
  type: Discovery,
  constructionCost: {[Exploration]: 3},
  production: {[Gold]: 1, [Exploration]: 1},
  victoryPoints: 2,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.CenterOfTheEarth, {
  type: Discovery,
  constructionCost: {[Exploration]: 5, [General]: 2},
  victoryPoints: 15,
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.CitiesOfGold, {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {[Gold]: 3},
  victoryPoints: 3,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.CityOfAgartha, {
  type: Discovery,
  constructionCost: {[Exploration]: 4, [Krystallium]: 1},
  production: {[Exploration]: 2},
  victoryPoints: {[General]: 1},
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.FountainOfYouth, {
  type: Discovery,
  constructionCost: {[Exploration]: 7},
  constructionBonus: {[Krystallium]: 3},
  victoryPoints: {[General]: 1},
  recyclingBonus: Energy
})

DevelopmentsAnatomy.set(Development.GardensOfTheHesperides, {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  victoryPoints: {[Project]: 2},
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.IslandOfAvalon, {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  production: Science,
  victoryPoints: 7,
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.KingSolomonsMines, {
  type: Discovery,
  constructionCost: {[Exploration]: 4},
  production: {[Gold]: Structure},
  victoryPoints: 2,
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.LostContinentOfMu, {
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: {[Krystallium]: 2},
  production: Gold,
  victoryPoints: {[Discovery]: 2},
  recyclingBonus: Gold
})

DevelopmentsAnatomy.set(Development.ParallelDimension, {
  type: Discovery,
  constructionCost: {[Science]: 3, [Exploration]: 4, [General]: 1},
  constructionBonus: {[Krystallium]: 3},
  victoryPoints: {[Research]: 3},
  recyclingBonus: Exploration
})

DevelopmentsAnatomy.set(Development.Roswell, {
  type: Discovery,
  constructionCost: {[Exploration]: 6},
  constructionBonus: General,
  production: Science,
  victoryPoints: {[General]: 1},
  recyclingBonus: Science
})

DevelopmentsAnatomy.set(Development.TreasureOfTheTemplars, {
  type: Discovery,
  constructionCost: {[Exploration]: 5},
  constructionBonus: {[Krystallium]: 2},
  production: {[Gold]: 2},
  victoryPoints: 3,
  recyclingBonus: Gold
})

export default DevelopmentsAnatomy