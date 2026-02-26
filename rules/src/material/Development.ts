import { range } from 'es-toolkit'
import {
  AlphaCentauri,
  ArmoredConvoy,
  ArtificialIntelligence,
  ArtificialSun,
  BorderPatrol,
  CelestialCathedral,
  Consortium,
  DarkMatter,
  FloatingPalace,
  GiantRobot,
  GoldMine,
  HighSecurityPrison,
  Hyperborea,
  Immortality,
  Inquisitors,
  IntercontinentalNetwork,
  KrystalliumPowerPlant,
  LawlessZone,
  LuxuryClinic,
  MiningAsteroid,
  MobileBase,
  MysteriousVessel,
  OccultDistrict,
  OffshoreLaboratory,
  OrbitalStation,
  Pandemonium,
  PandoraBox,
  PlanetaryArchives,
  Raiders,
  RobotFactory,
  SecretBase,
  Shambhala,
  TaxHaven,
  Telekinesis,
  TheWall,
  Utopia,
  Valhalla,
  WorldBank
} from './AscensionDevelopments'
import { Character } from './Character'
import {
  AnalysisCenter,
  CargoFleet,
  GaussianWeapons,
  Headquarters,
  MemorialForTheBuilder,
  MemorialForTheDictator,
  MemorialForTheExplorer,
  MemorialForTheFinancier,
  MemorialForTheScientist,
  Pax10,
  SecretForces,
  SecurityShips,
  TowerOfBabel
} from './WarAndPeaceDevelopments'
import { DevelopmentDetails } from './DevelopmentDetails'
import {
  AirborneLaboratory,
  AircraftCarrier,
  AlexandersTomb,
  AncientAstronauts,
  Aquaculture,
  ArkOfTheCovenant,
  Atlantis,
  BermudaTriangle,
  BionicGrafts,
  BlackBeardsTreasure,
  CasinoCity,
  CenterOfTheEarth,
  CitiesOfGold,
  CityOfAgartha,
  ClimateControl,
  Cryopreservation,
  EspionageAgency,
  FinancialCenter,
  FountainOfYouth,
  GardensOfTheHesperides,
  GeneticUpgrades,
  GiantDam,
  GiantTower,
  GravityInverter,
  HarborZone,
  HumanCloning,
  Icebreaker,
  IndustrialComplex,
  IslandOfAvalon,
  Juggernaut,
  KingSolomonsMines,
  LostContinentOfMu,
  LunarBase,
  MagneticTrain,
  MegaBomb,
  MegaDrill,
  MilitaryBase,
  Museum,
  NationalMonument,
  Neuroscience,
  NuclearPlant,
  OffshoreOilRig,
  ParallelDimension,
  PolarBase,
  PropagandaCenter,
  QuantumGenerator,
  RecyclingPlant,
  ResearchCenter,
  RobotAssistants,
  RoboticAnimals,
  Roswell,
  Satellites,
  SaucerSquadron,
  SecretLaboratory,
  SecretSociety,
  SecurityAutomatons,
  SolarCannon,
  SpaceElevator,
  Submarine,
  Supercomputer,
  SuperSoldiers,
  SuperSonar,
  TankDivision,
  Teleportation,
  TimeTravel,
  Transmutation,
  TransportationNetwork,
  TreasureOfTheTemplars,
  UndergroundCity,
  UnderwaterCity,
  UniversalExposition,
  UniversalVaccine,
  University,
  UnknownTechnology,
  VirtualReality,
  WindTurbines,
  WorldCongress,
  Zeppelin
} from './Developments'
import { Resource } from './Resource'

export enum Development {
  FinancialCenter = 1,
  IndustrialComplex,
  MilitaryBase,
  NuclearPlant,
  OffshoreOilRig,
  RecyclingPlant,
  ResearchCenter,
  TransportationNetwork,
  WindTurbines,
  AirborneLaboratory,
  AircraftCarrier,
  Icebreaker,
  Juggernaut,
  MegaDrill,
  SaucerSquadron,
  Submarine,
  TankDivision,
  Zeppelin,
  Aquaculture,
  BionicGrafts,
  ClimateControl,
  Cryopreservation,
  GeneticUpgrades,
  GravityInverter,
  HumanCloning,
  MegaBomb,
  Neuroscience,
  QuantumGenerator,
  RobotAssistants,
  RoboticAnimals,
  Satellites,
  SecurityAutomatons,
  SuperSoldiers,
  SuperSonar,
  Supercomputer,
  Teleportation,
  TimeTravel,
  Transmutation,
  UniversalVaccine,
  UnknownTechnology,
  VirtualReality,
  CasinoCity,
  EspionageAgency,
  GiantDam,
  GiantTower,
  HarborZone,
  LunarBase,
  MagneticTrain,
  Museum,
  NationalMonument,
  PolarBase,
  PropagandaCenter,
  SecretLaboratory,
  SecretSociety,
  SolarCannon,
  SpaceElevator,
  UndergroundCity,
  UnderwaterCity,
  UniversalExposition,
  University,
  WorldCongress,
  AlexandersTomb,
  AncientAstronauts,
  ArkOfTheCovenant,
  Atlantis,
  BermudaTriangle,
  BlackBeardsTreasure,
  CenterOfTheEarth,
  CitiesOfGold,
  CityOfAgartha,
  FountainOfYouth,
  GardensOfTheHesperides,
  IslandOfAvalon,
  KingSolomonsMines,
  LostContinentOfMu,
  ParallelDimension,
  Roswell,
  TreasureOfTheTemplars,
  // Corruption & Ascension expansion - new cards
  BorderPatrol,
  KrystalliumPowerPlant,
  RobotFactory,
  GoldMine,
  SecretBase,
  LawlessZone,
  OccultDistrict,
  OffshoreLaboratory,
  FloatingPalace,
  GiantRobot,
  ArmoredConvoy,
  MobileBase,
  Inquisitors,
  Raiders,
  PlanetaryArchives,
  Telekinesis,
  ArtificialIntelligence,
  DarkMatter,
  ArtificialSun,
  Immortality,
  Utopia,
  TaxHaven,
  CelestialCathedral,
  IntercontinentalNetwork,
  HighSecurityPrison,
  OrbitalStation,
  WorldBank,
  LuxuryClinic,
  TheWall,
  Consortium,
  MiningAsteroid,
  Hyperborea,
  Valhalla,
  MysteriousVessel,
  Pandemonium,
  PandoraBox,
  AlphaCentauri,
  Shambhala,
  // War or Peace expansion - new cards
  MemorialForTheBuilder,
  MemorialForTheDictator,
  MemorialForTheScientist,
  MemorialForTheFinancier,
  MemorialForTheExplorer,
  AnalysisCenter,
  SecurityShips,
  TowerOfBabel,
  GaussianWeapons,
  CargoFleet,
  Pax10,
  Headquarters,
  SecretForces
}

export const developments = Object.values(Development).filter(isDevelopment)

function isDevelopment(value: string | Development): value is Development {
  return typeof value !== 'string'
}

export function getDevelopmentDetails(development: Development): DevelopmentDetails {
  switch (development) {
    case Development.FinancialCenter:
      return FinancialCenter
    case Development.IndustrialComplex:
      return IndustrialComplex
    case Development.MilitaryBase:
      return MilitaryBase
    case Development.NuclearPlant:
      return NuclearPlant
    case Development.OffshoreOilRig:
      return OffshoreOilRig
    case Development.RecyclingPlant:
      return RecyclingPlant
    case Development.ResearchCenter:
      return ResearchCenter
    case Development.TransportationNetwork:
      return TransportationNetwork
    case Development.WindTurbines:
      return WindTurbines
    case Development.AirborneLaboratory:
      return AirborneLaboratory
    case Development.AircraftCarrier:
      return AircraftCarrier
    case Development.Icebreaker:
      return Icebreaker
    case Development.Juggernaut:
      return Juggernaut
    case Development.MegaDrill:
      return MegaDrill
    case Development.SaucerSquadron:
      return SaucerSquadron
    case Development.Submarine:
      return Submarine
    case Development.TankDivision:
      return TankDivision
    case Development.Zeppelin:
      return Zeppelin
    case Development.Aquaculture:
      return Aquaculture
    case Development.BionicGrafts:
      return BionicGrafts
    case Development.ClimateControl:
      return ClimateControl
    case Development.Cryopreservation:
      return Cryopreservation
    case Development.GeneticUpgrades:
      return GeneticUpgrades
    case Development.GravityInverter:
      return GravityInverter
    case Development.HumanCloning:
      return HumanCloning
    case Development.MegaBomb:
      return MegaBomb
    case Development.Neuroscience:
      return Neuroscience
    case Development.QuantumGenerator:
      return QuantumGenerator
    case Development.RobotAssistants:
      return RobotAssistants
    case Development.RoboticAnimals:
      return RoboticAnimals
    case Development.Satellites:
      return Satellites
    case Development.SecurityAutomatons:
      return SecurityAutomatons
    case Development.SuperSoldiers:
      return SuperSoldiers
    case Development.SuperSonar:
      return SuperSonar
    case Development.Supercomputer:
      return Supercomputer
    case Development.Teleportation:
      return Teleportation
    case Development.TimeTravel:
      return TimeTravel
    case Development.Transmutation:
      return Transmutation
    case Development.UniversalVaccine:
      return UniversalVaccine
    case Development.UnknownTechnology:
      return UnknownTechnology
    case Development.VirtualReality:
      return VirtualReality
    case Development.CasinoCity:
      return CasinoCity
    case Development.EspionageAgency:
      return EspionageAgency
    case Development.GiantDam:
      return GiantDam
    case Development.GiantTower:
      return GiantTower
    case Development.HarborZone:
      return HarborZone
    case Development.LunarBase:
      return LunarBase
    case Development.MagneticTrain:
      return MagneticTrain
    case Development.Museum:
      return Museum
    case Development.NationalMonument:
      return NationalMonument
    case Development.PolarBase:
      return PolarBase
    case Development.PropagandaCenter:
      return PropagandaCenter
    case Development.SecretLaboratory:
      return SecretLaboratory
    case Development.SecretSociety:
      return SecretSociety
    case Development.SolarCannon:
      return SolarCannon
    case Development.SpaceElevator:
      return SpaceElevator
    case Development.UndergroundCity:
      return UndergroundCity
    case Development.UnderwaterCity:
      return UnderwaterCity
    case Development.UniversalExposition:
      return UniversalExposition
    case Development.University:
      return University
    case Development.WorldCongress:
      return WorldCongress
    case Development.AlexandersTomb:
      return AlexandersTomb
    case Development.AncientAstronauts:
      return AncientAstronauts
    case Development.ArkOfTheCovenant:
      return ArkOfTheCovenant
    case Development.Atlantis:
      return Atlantis
    case Development.BermudaTriangle:
      return BermudaTriangle
    case Development.BlackBeardsTreasure:
      return BlackBeardsTreasure
    case Development.CenterOfTheEarth:
      return CenterOfTheEarth
    case Development.CitiesOfGold:
      return CitiesOfGold
    case Development.CityOfAgartha:
      return CityOfAgartha
    case Development.FountainOfYouth:
      return FountainOfYouth
    case Development.GardensOfTheHesperides:
      return GardensOfTheHesperides
    case Development.IslandOfAvalon:
      return IslandOfAvalon
    case Development.KingSolomonsMines:
      return KingSolomonsMines
    case Development.LostContinentOfMu:
      return LostContinentOfMu
    case Development.ParallelDimension:
      return ParallelDimension
    case Development.Roswell:
      return Roswell
    case Development.TreasureOfTheTemplars:
      return TreasureOfTheTemplars
    case Development.BorderPatrol:
      return BorderPatrol
    case Development.KrystalliumPowerPlant:
      return KrystalliumPowerPlant
    case Development.RobotFactory:
      return RobotFactory
    case Development.GoldMine:
      return GoldMine
    case Development.SecretBase:
      return SecretBase
    case Development.LawlessZone:
      return LawlessZone
    case Development.OccultDistrict:
      return OccultDistrict
    case Development.OffshoreLaboratory:
      return OffshoreLaboratory
    case Development.FloatingPalace:
      return FloatingPalace
    case Development.GiantRobot:
      return GiantRobot
    case Development.ArmoredConvoy:
      return ArmoredConvoy
    case Development.MobileBase:
      return MobileBase
    case Development.Inquisitors:
      return Inquisitors
    case Development.Raiders:
      return Raiders
    case Development.PlanetaryArchives:
      return PlanetaryArchives
    case Development.Telekinesis:
      return Telekinesis
    case Development.ArtificialIntelligence:
      return ArtificialIntelligence
    case Development.DarkMatter:
      return DarkMatter
    case Development.ArtificialSun:
      return ArtificialSun
    case Development.Immortality:
      return Immortality
    case Development.Utopia:
      return Utopia
    case Development.TaxHaven:
      return TaxHaven
    case Development.CelestialCathedral:
      return CelestialCathedral
    case Development.IntercontinentalNetwork:
      return IntercontinentalNetwork
    case Development.HighSecurityPrison:
      return HighSecurityPrison
    case Development.OrbitalStation:
      return OrbitalStation
    case Development.WorldBank:
      return WorldBank
    case Development.LuxuryClinic:
      return LuxuryClinic
    case Development.TheWall:
      return TheWall
    case Development.Consortium:
      return Consortium
    case Development.MiningAsteroid:
      return MiningAsteroid
    case Development.Hyperborea:
      return Hyperborea
    case Development.Valhalla:
      return Valhalla
    case Development.MysteriousVessel:
      return MysteriousVessel
    case Development.Pandemonium:
      return Pandemonium
    case Development.PandoraBox:
      return PandoraBox
    case Development.AlphaCentauri:
      return AlphaCentauri
    case Development.Shambhala:
      return Shambhala
    case Development.MemorialForTheBuilder:
      return MemorialForTheBuilder
    case Development.MemorialForTheDictator:
      return MemorialForTheDictator
    case Development.MemorialForTheScientist:
      return MemorialForTheScientist
    case Development.MemorialForTheFinancier:
      return MemorialForTheFinancier
    case Development.MemorialForTheExplorer:
      return MemorialForTheExplorer
    case Development.AnalysisCenter:
      return AnalysisCenter
    case Development.SecurityShips:
      return SecurityShips
    case Development.TowerOfBabel:
      return TowerOfBabel
    case Development.GaussianWeapons:
      return GaussianWeapons
    case Development.CargoFleet:
      return CargoFleet
    case Development.Pax10:
      return Pax10
    case Development.Headquarters:
      return Headquarters
    case Development.SecretForces:
      return SecretForces
  }
}

export const baseDevelopmentCardIds = range(Development.FinancialCenter, Development.BorderPatrol)
export const ascensionDevelopmentCardIds = range(Development.BorderPatrol, Development.Shambhala + 1)
export const warAndPeaceDevelopmentCardIds = range(Development.MemorialForTheBuilder, Development.SecretForces + 1)

/**
 * Get the construction cost of a development card as an array of resources/characters.
 * The order is: Materials, Energy, Science, Gold, Exploration, Krystallium, Financier, General
 */
export function getCost(development: Development): (Resource | Character)[] {
  const details = getDevelopmentDetails(development)
  const costOrder: (Resource | Character)[] = [
    Resource.Materials,
    Resource.Energy,
    Resource.Science,
    Resource.Gold,
    Resource.Exploration,
    Resource.Krystallium,
    Character.Financier,
    Character.General
  ]
  return costOrder.flatMap((item) => Array(details.constructionCost[item] || 0).fill(item))
}

/**
 * Get the remaining cost spaces that have not been filled yet.
 * Returns an array of {item, space} where item is the required resource/character and space is the index.
 */
export function getRemainingCost(
  development: Development,
  filledSpaces: (Resource | Character | undefined)[]
): { item: Resource | Character; space: number }[] {
  return getCost(development)
    .map((item, index) => ({ item, space: index }))
    .filter(({ space }) => !filledSpaces[space])
}

/**
 * Get column 2 pattern for specific developments that have two-column cost layouts.
 * Returns an array of space indices that should be in column 2.
 */
export function getDevelopmentColumn2Pattern(development: Development): number[] {
  switch (development) {
    case Development.AlphaCentauri:
      return [4, 5, 11, 12, 13]
    case Development.Hyperborea:
      return [7, 8]
    case Development.CelestialCathedral:
      return [3, 8]
    case Development.TheWall:
      return [6, 7, 8, 11, 12, 14]
    case Development.WorldBank:
      return [5, 6, 10, 11]
    case Development.ArtificialSun:
      return [3, 8, 9, 10, 12]
    case Development.DarkMatter:
      return [4, 8, 9]
    case Development.Immortality:
      return [7, 8, 9, 10]
    case Development.Utopia:
      return [3, 5, 7]
    case Development.GiantRobot:
      return [6, 7]
    case Development.OrbitalStation:
      return [4, 5]
    default:
      return []
  }
}

/**
 * Get the column and index for a specific cost space on a development card.
 */
export function getConstructionSpaceLocation(development: Development, space: number): { column: number; index: number } {
  const column2Pattern = getDevelopmentColumn2Pattern(development)
  if (column2Pattern.length) {
    const column = column2Pattern.includes(space) ? 2 : 1
    return {
      column,
      index: column === 1 ? space - column2Pattern.filter((s) => s < space).length : column2Pattern.indexOf(space)
    }
  } else {
    return { column: 1, index: space }
  }
}
