import {
  AlphaCentauri, ArmoredConvoy, ArtificialIntelligence, ArtificialSun, BorderPatrol, CelestialCathedral, Consortium, DarkMatter, FloatingPalace, GiantRobot,
  GoldMine, HighSecurityPrison, Hyperborea, Immortality, Inquisitors, IntercontinentalNetwork, KrystalliumPowerPlant, LawlessZone, LuxuryClinic, MiningAsteroid,
  MobileBase, MysteriousVessel, OccultDistrict, OffshoreLaboratory, OrbitalStation, Pandemonium, PandoraBox, PlanetaryArchives, Raiders, RobotFactory,
  SecretBase, Shambhala, TaxHaven, Telekinesis, TheWall, Utopia, Valhalla, WorldBank
} from './AscensionDevelopments'
import DevelopmentDetails from './DevelopmentDetails'
import {
  AirborneLaboratory, AircraftCarrier, AlexandersTomb, AncientAstronauts, Aquaculture, ArkOfTheCovenant, Atlantis, BermudaTriangle, BionicGrafts,
  BlackBeardsTreasure, CasinoCity, CenterOfTheEarth, CitiesOfGold, CityOfAgartha, ClimateControl, Cryopreservation, EspionageAgency, FinancialCenter,
  FountainOfYouth, GardensOfTheHesperides, GeneticUpgrades, GiantDam, GiantTower, GravityInverter, HarborZone, HumanCloning, Icebreaker, IndustrialComplex,
  IslandOfAvalon, Juggernaut, KingSolomonsMines, LostContinentOfMu, LunarBase, MagneticTrain, MegaBomb, MegaDrill, MilitaryBase, Museum, NationalMonument,
  Neuroscience, NuclearPlant, OffshoreOilRig, ParallelDimension, PolarBase, PropagandaCenter, QuantumGenerator, RecyclingPlant, ResearchCenter, RobotAssistants,
  RoboticAnimals, Roswell, Satellites, SaucerSquadron, SecretLaboratory, SecretSociety, SecurityAutomatons, SolarCannon, SpaceElevator, Submarine,
  Supercomputer, SuperSoldiers, SuperSonar, TankDivision, Teleportation, TimeTravel, Transmutation, TransportationNetwork, TreasureOfTheTemplars,
  UndergroundCity, UnderwaterCity, UniversalExposition, UniversalVaccine, University, UnknownTechnology, VirtualReality, WindTurbines, WorldCongress, Zeppelin
} from './Developments'

enum Development {
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
  Shambhala
}

export default Development

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
  }
}