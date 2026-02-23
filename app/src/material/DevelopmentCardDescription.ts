import { CardDescription, ItemContext } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { DeckType } from '@gamepark/its-a-wonderful-world/material/DeckType'
import { Development } from '@gamepark/its-a-wonderful-world/material/Development'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'

// Import card back images
import DevelopmentBack from '../images/developments/development-back.jpg'
import AscensionBack from '../images/developments/ascension-back.jpg'

// Base game - Structure
import FinancialCenter_EN from '../images/cards/developments/en/Structure_1_EN_FinancialCenter.jpg'
import IndustrialComplex_EN from '../images/cards/developments/en/Structure_2_EN_IndustrialComplex.jpg'
import MilitaryBase_EN from '../images/cards/developments/en/Structure_3_EN_MilitaryBase.jpg'
import NuclearPlant_EN from '../images/cards/developments/en/Structure_4_EN_NuclearPlant.jpg'
import OffshoreOilRig_EN from '../images/cards/developments/en/Structure_5_EN_OffshoreOilRig.jpg'
import RecyclingPlant_EN from '../images/cards/developments/en/Structure_6_EN_RecyclingPlant.jpg'
import ResearchCenter_EN from '../images/cards/developments/en/Structure_7_EN_ResearchCenter.jpg'
import TransportationNetwork_EN from '../images/cards/developments/en/Structure_8_EN_TransportationNetwork.jpg'
import WindTurbines_EN from '../images/cards/developments/en/Structure_9_EN_WindTurbines.jpg'

// Base game - Vehicle
import AirborneLaboratory_EN from '../images/cards/developments/en/Vehicle_10_EN_AirborneLaboratory.jpg'
import AircraftCarrier_EN from '../images/cards/developments/en/Vehicle_11_EN_AircraftCarrier.jpg'
import Icebreaker_EN from '../images/cards/developments/en/Vehicle_12_EN_Icebreaker.jpg'
import Juggernaut_EN from '../images/cards/developments/en/Vehicle_13_EN_Juggernaut.jpg'
import MegaDrill_EN from '../images/cards/developments/en/Vehicle_14_EN_MegaDrill.jpg'
import SaucerSquadron_EN from '../images/cards/developments/en/Vehicle_15_EN_SaucerSquadron.jpg'
import Submarine_EN from '../images/cards/developments/en/Vehicle_16_EN_Submarine.jpg'
import TankDivision_EN from '../images/cards/developments/en/Vehicle_17_EN_TankDivision.jpg'
import Zeppelin_EN from '../images/cards/developments/en/Vehicle_18_EN_Zeppelin.jpg'

// Base game - Research
import Aquaculture_EN from '../images/cards/developments/en/Research_19_EN_Aquaculture.jpg'
import BionicGrafts_EN from '../images/cards/developments/en/Research_20_EN_BionicGrafts.jpg'
import ClimateControl_EN from '../images/cards/developments/en/Research_21_EN_ClimateControl.jpg'
import Cryopreservation_EN from '../images/cards/developments/en/Research_22_EN_Cryopreservation.jpg'
import GeneticUpgrades_EN from '../images/cards/developments/en/Research_23_EN_GeneticUpgrades.jpg'
import GravityInverter_EN from '../images/cards/developments/en/Research_24_EN_GravityInverter.jpg'
import HumanCloning_EN from '../images/cards/developments/en/Research_25_EN_HumanCloning.jpg'
import MegaBomb_EN from '../images/cards/developments/en/Research_26_EN_MegaBomb.jpg'
import Neuroscience_EN from '../images/cards/developments/en/Research_27_EN_Neuroscience.jpg'
import QuantumGenerator_EN from '../images/cards/developments/en/Research_28_EN_QuantumGenerator.jpg'
import RobotAssistants_EN from '../images/cards/developments/en/Research_29_EN_RobotAssistants.jpg'
import RoboticAnimals_EN from '../images/cards/developments/en/Research_30_EN_RoboticAnimals.jpg'
import Satellites_EN from '../images/cards/developments/en/Research_31_EN_Satellites.jpg'
import SecurityAutomatons_EN from '../images/cards/developments/en/Research_32_EN_SecurityAutomatons.jpg'
import SuperSoldiers_EN from '../images/cards/developments/en/Research_33_EN_SuperSoldiers.jpg'
import SuperSonar_EN from '../images/cards/developments/en/Research_34_EN_SuperSonar.jpg'
import Supercomputer_EN from '../images/cards/developments/en/Research_35_EN_Supercomputer.jpg'
import Teleportation_EN from '../images/cards/developments/en/Research_36_EN_Teleportation.jpg'
import TimeTravel_EN from '../images/cards/developments/en/Research_37_EN_TimeTravel.jpg'
import Transmutation_EN from '../images/cards/developments/en/Research_38_EN_Transmutation.jpg'
import UniversalVaccine_EN from '../images/cards/developments/en/Research_39_EN_UniversalVaccine.jpg'
import UnknownTechnology_EN from '../images/cards/developments/en/Research_40_EN_UnknownTechnology.jpg'
import VirtualReality_EN from '../images/cards/developments/en/Research_41_EN_VirtualReality.jpg'

// Base game - Project
import CasinoCity_EN from '../images/cards/developments/en/Project_42_EN_CasinoCity.jpg'
import EspionageAgency_EN from '../images/cards/developments/en/Project_43_EN_EspionageAgency.jpg'
import GiantDam_EN from '../images/cards/developments/en/Project_44_EN_GiantDam.jpg'
import GiantTower_EN from '../images/cards/developments/en/Project_45_EN_GiantTower.jpg'
import HarborZone_EN from '../images/cards/developments/en/Project_46_EN_HarborZone.jpg'
import LunarBase_EN from '../images/cards/developments/en/Project_47_EN_LunarBase.jpg'
import MagneticTrain_EN from '../images/cards/developments/en/Project_48_EN_MagneticTrain.jpg'
import Museum_EN from '../images/cards/developments/en/Project_49_EN_Museum.jpg'
import NationalMonument_EN from '../images/cards/developments/en/Project_50_EN_NationalMonument.jpg'
import PolarBase_EN from '../images/cards/developments/en/Project_51_EN_PolarBase.jpg'
import PropagandaCenter_EN from '../images/cards/developments/en/Project_52_EN_PropagandaCenter.jpg'
import SecretLaboratory_EN from '../images/cards/developments/en/Project_53_EN_SecretLaboratory.jpg'
import SecretSociety_EN from '../images/cards/developments/en/Project_54_EN_SecretSociety.jpg'
import SolarCannon_EN from '../images/cards/developments/en/Project_55_EN_SolarCannon.jpg'
import SpaceElevator_EN from '../images/cards/developments/en/Project_56_EN_SpaceElevator.jpg'
import UndergroundCity_EN from '../images/cards/developments/en/Project_57_EN_UndergroundCity.jpg'
import UnderwaterCity_EN from '../images/cards/developments/en/Project_58_EN_UnderwaterCity.jpg'
import UniversalExposition_EN from '../images/cards/developments/en/Project_59_EN_UniversalExposition.jpg'
import University_EN from '../images/cards/developments/en/Project_60_EN_University.jpg'
import WorldCongress_EN from '../images/cards/developments/en/Project_61_EN_WorldCongress.jpg'

// Base game - Discovery
import AlexandersTomb_EN from '../images/cards/developments/en/Discovery_62_EN_AlexandersTomb.jpg'
import AncientAstronauts_EN from '../images/cards/developments/en/Discovery_63_EN_AncientAstronauts.jpg'
import ArkOfTheCovenant_EN from '../images/cards/developments/en/Discovery_64_EN_ArkOfTheCovenant.jpg'
import Atlantis_EN from '../images/cards/developments/en/Discovery_65_EN_Atlantis.jpg'
import BermudaTriangle_EN from '../images/cards/developments/en/Discovery_66_EN_BermudaTriangle.jpg'
import BlackBeardsTreasure_EN from '../images/cards/developments/en/Discovery_67_EN_BlackBeardsTreasure.jpg'
import CenterOfTheEarth_EN from '../images/cards/developments/en/Discovery_68_EN_CenterOfTheEarth.jpg'
import CitiesOfGold_EN from '../images/cards/developments/en/Discovery_69_EN_CitiesOfGold.jpg'
import CityOfAgartha_EN from '../images/cards/developments/en/Discovery_70_EN_CityOfAgartha.jpg'
import FountainOfYouth_EN from '../images/cards/developments/en/Discovery_71_EN_FountainOfYouth.jpg'
import GardensOfTheHesperides_EN from '../images/cards/developments/en/Discovery_72_EN_GardensOfTheHesperides.jpg'
import IslandOfAvalon_EN from '../images/cards/developments/en/Discovery_73_EN_IslandOfAvalon.jpg'
import KingSolomonsMines_EN from '../images/cards/developments/en/Discovery_74_EN_KingSolomonsMines.jpg'
import LostContinentOfMu_EN from '../images/cards/developments/en/Discovery_75_EN_LostContinentOfMu.jpg'
import ParallelDimension_EN from '../images/cards/developments/en/Discovery_76_EN_ParallelDimension.jpg'
import Roswell_EN from '../images/cards/developments/en/Discovery_77_EN_Roswell.jpg'
import TreasureOfTheTemplars_EN from '../images/cards/developments/en/Discovery_78_EN_TreasureOfTheTemplars.jpg'

// Ascension - Structure
import BorderPatrol_EN from '../images/cards/developments/en/Structure_79_EN_BorderPatrol.jpg'
import KrystalliumPowerPlant_EN from '../images/cards/developments/en/Structure_80_EN_KrystalliumPowerPlant.jpg'
import RobotFactory_EN from '../images/cards/developments/en/Structure_81_EN_RobotFactory.jpg'
import GoldMine_EN from '../images/cards/developments/en/Structure_82_EN_GoldMine.jpg'
import SecretBase_EN from '../images/cards/developments/en/Structure_83_EN_SecretBase.jpg'
import LawlessZone_EN from '../images/cards/developments/en/Structure_84_EN_LawlessZone.jpg'
import OccultDistrict_EN from '../images/cards/developments/en/Structure_85_EN_OccultDistrict.jpg'
import OffshoreLaboratory_EN from '../images/cards/developments/en/Structure_86_EN_OffshoreLaboratory.jpg'

// Ascension - Vehicle
import FloatingPalace_EN from '../images/cards/developments/en/Vehicle_87_EN_FloatingPalace.jpg'
import GiantRobot_EN from '../images/cards/developments/en/Vehicle_88_EN_GiantRobot.jpg'
import ArmoredConvoy_EN from '../images/cards/developments/en/Vehicle_89_EN_ArmoredConvoy.jpg'
import MobileBase_EN from '../images/cards/developments/en/Vehicle_90_EN_MobileBase.jpg'
import Inquisitors_EN from '../images/cards/developments/en/Vehicle_91_EN_Inquisitors.jpg'
import Raiders_EN from '../images/cards/developments/en/Vehicle_92_EN_Raiders.jpg'

// Ascension - Research
import PlanetaryArchives_EN from '../images/cards/developments/en/Research_93_EN_PlanetaryArchives.jpg'
import Telekinesis_EN from '../images/cards/developments/en/Research_94_EN_Telekinesis.jpg'
import ArtificialIntelligence_EN from '../images/cards/developments/en/Research_95_EN_ArtificialIntelligence.jpg'
import DarkMatter_EN from '../images/cards/developments/en/Research_96_EN_DarkMatter.jpg'
import ArtificialSun_EN from '../images/cards/developments/en/Research_97_EN_ArtificialSun.jpg'
import Immortality_EN from '../images/cards/developments/en/Research_98_EN_Immortality.jpg'
import Utopia_EN from '../images/cards/developments/en/Research_99_EN_Utopia.jpg'
import TaxHaven_EN from '../images/cards/developments/en/Research_100_EN_TaxHaven.jpg'

// Ascension - Project
import CelestialCathedral_EN from '../images/cards/developments/en/Project_101_EN_CelestialCathedral.jpg'
import IntercontinentalNetwork_EN from '../images/cards/developments/en/Project_102_EN_IntercontinentalNetwork.jpg'
import HighSecurityPrison_EN from '../images/cards/developments/en/Project_103_EN_HighSecurityPrison.jpg'
import OrbitalStation_EN from '../images/cards/developments/en/Project_104_EN_OrbitalStation.jpg'
import WorldBank_EN from '../images/cards/developments/en/Project_105_EN_WorldBank.jpg'
import LuxuryClinic_EN from '../images/cards/developments/en/Project_106_EN_LuxuryClinic.jpg'
import TheWall_EN from '../images/cards/developments/en/Project_107_EN_TheWall.jpg'
import Consortium_EN from '../images/cards/developments/en/Project_108_EN_Consortium.jpg'
import MiningAsteroid_EN from '../images/cards/developments/en/Project_109_EN_MiningAsteroid.jpg'

// Ascension - Discovery
import Hyperborea_EN from '../images/cards/developments/en/Discovery_110_EN_Hyperborea.jpg'
import Valhalla_EN from '../images/cards/developments/en/Discovery_111_EN_Valhalla.jpg'
import MysteriousVessel_EN from '../images/cards/developments/en/Discovery_112_EN_MysteriousVessel.jpg'
import Pandemonium_EN from '../images/cards/developments/en/Discovery_113_EN_Pandemonium.jpg'
import PandoraBox_EN from '../images/cards/developments/en/Discovery_114_EN_PandoraBox.jpg'
import AlphaCentauri_EN from '../images/cards/developments/en/Discovery_115_EN_AlphaCentauri.jpg'
import Shambhala_EN from '../images/cards/developments/en/Discovery_116_EN_Shambhala.jpg'

// Corruption & Ascension - Memorial
import MemorialForTheExplorer_EN from '../images/cards/developments/en/Memorial_117_EN_MemorialForTheExplorer.jpg'
import MemorialForTheBuilder_EN from '../images/cards/developments/en/Memorial_118_EN_MemorialForTheBuilder.jpg'
import MemorialForTheDictator_EN from '../images/cards/developments/en/Memorial_119_EN_MemorialForTheDictator.jpg'
import MemorialForTheFinancier_EN from '../images/cards/developments/en/Memorial_120_EN_MemorialForTheFinancier.jpg'
import MemorialForTheScientist_EN from '../images/cards/developments/en/Memorial_121_EN_MemorialForTheScientist.jpg'

// Corruption & Ascension - Other
import AnalysisCenter_EN from '../images/cards/developments/en/Structure_122_EN_AnalysisCenter.jpg'
import SecurityShips_EN from '../images/cards/developments/en/Vehicle_123_EN_SecurityShips.jpg'
import TowerOfBabel_EN from '../images/cards/developments/en/Discovery_124_EN_TowerOfBabel.jpg'
import GaussianWeapons_EN from '../images/cards/developments/en/Research_125_EN_GaussianWeapons.jpg'
import CargoFleet_EN from '../images/cards/developments/en/Vehicle_126_EN_CargoFleet.jpg'
import Pax10_EN from '../images/cards/developments/en/Project_127_EN_Pax10.jpg'
import Headquarters_EN from '../images/cards/developments/en/Project_128_EN_Headquarters.jpg'
import SecretForces_EN from '../images/cards/developments/en/Structure_129_EN_SecretForces.jpg'

export class DevelopmentCardDescription extends CardDescription<Empire, MaterialType, LocationType> {
  width = 6.5
  height = 10
  borderRadius = 0.3

  canLongClick() {
    return false
  }

  getLongClickMoves(context: ItemContext<Empire, MaterialType, LocationType>, legalMoves: MaterialMove<Empire, MaterialType, LocationType>[]): MaterialMove<Empire, MaterialType, LocationType>[] {
    const { index, rules } = context
    const moves = legalMoves.filter(move =>
      isMoveItemType(MaterialType.ResourceCube)(move) &&
      move.location.type === LocationType.ConstructionCardCost &&
      move.location.parent === index &&
      rules.material(MaterialType.ResourceCube).getItem(move.itemIndex).id !== Resource.Krystallium
    )
    // A cube item can have quantity > 1 (e.g. production creates 3 Materials at once).
    // Greedily assign: each cube used up to its quantity, each space (x) filled once.
    const itemUsage = new Map<number, number>()
    const usedSpaces = new Set<number>()
    const result: MaterialMove<Empire, MaterialType, LocationType>[] = []
    const sorted = [...moves].sort((a, b) => {
      if (!isMoveItemType(MaterialType.ResourceCube)(a) || !isMoveItemType(MaterialType.ResourceCube)(b)) return 0
      return (a.location.x ?? 0) - (b.location.x ?? 0)
    })
    for (const move of sorted) {
      if (!isMoveItemType(MaterialType.ResourceCube)(move)) continue
      const space = move.location.x ?? 0
      if (usedSpaces.has(space)) continue
      const used = itemUsage.get(move.itemIndex) ?? 0
      const available = rules.material(MaterialType.ResourceCube).getItem(move.itemIndex).quantity ?? 1
      if (used >= available) continue
      itemUsage.set(move.itemIndex, used + 1)
      usedSpaces.add(space)
      result.push(move)
    }
    return result
  }

  backImages = {
    [DeckType.Default]: DevelopmentBack,
    [DeckType.Ascension]: AscensionBack
  }

  images = {
    [Development.FinancialCenter]: FinancialCenter_EN,
    [Development.IndustrialComplex]: IndustrialComplex_EN,
    [Development.MilitaryBase]: MilitaryBase_EN,
    [Development.NuclearPlant]: NuclearPlant_EN,
    [Development.OffshoreOilRig]: OffshoreOilRig_EN,
    [Development.RecyclingPlant]: RecyclingPlant_EN,
    [Development.ResearchCenter]: ResearchCenter_EN,
    [Development.TransportationNetwork]: TransportationNetwork_EN,
    [Development.WindTurbines]: WindTurbines_EN,
    [Development.AirborneLaboratory]: AirborneLaboratory_EN,
    [Development.AircraftCarrier]: AircraftCarrier_EN,
    [Development.Icebreaker]: Icebreaker_EN,
    [Development.Juggernaut]: Juggernaut_EN,
    [Development.MegaDrill]: MegaDrill_EN,
    [Development.SaucerSquadron]: SaucerSquadron_EN,
    [Development.Submarine]: Submarine_EN,
    [Development.TankDivision]: TankDivision_EN,
    [Development.Zeppelin]: Zeppelin_EN,
    [Development.Aquaculture]: Aquaculture_EN,
    [Development.BionicGrafts]: BionicGrafts_EN,
    [Development.ClimateControl]: ClimateControl_EN,
    [Development.Cryopreservation]: Cryopreservation_EN,
    [Development.GeneticUpgrades]: GeneticUpgrades_EN,
    [Development.GravityInverter]: GravityInverter_EN,
    [Development.HumanCloning]: HumanCloning_EN,
    [Development.MegaBomb]: MegaBomb_EN,
    [Development.Neuroscience]: Neuroscience_EN,
    [Development.QuantumGenerator]: QuantumGenerator_EN,
    [Development.RobotAssistants]: RobotAssistants_EN,
    [Development.RoboticAnimals]: RoboticAnimals_EN,
    [Development.Satellites]: Satellites_EN,
    [Development.SecurityAutomatons]: SecurityAutomatons_EN,
    [Development.SuperSoldiers]: SuperSoldiers_EN,
    [Development.SuperSonar]: SuperSonar_EN,
    [Development.Supercomputer]: Supercomputer_EN,
    [Development.Teleportation]: Teleportation_EN,
    [Development.TimeTravel]: TimeTravel_EN,
    [Development.Transmutation]: Transmutation_EN,
    [Development.UniversalVaccine]: UniversalVaccine_EN,
    [Development.UnknownTechnology]: UnknownTechnology_EN,
    [Development.VirtualReality]: VirtualReality_EN,
    [Development.CasinoCity]: CasinoCity_EN,
    [Development.EspionageAgency]: EspionageAgency_EN,
    [Development.GiantDam]: GiantDam_EN,
    [Development.GiantTower]: GiantTower_EN,
    [Development.HarborZone]: HarborZone_EN,
    [Development.LunarBase]: LunarBase_EN,
    [Development.MagneticTrain]: MagneticTrain_EN,
    [Development.Museum]: Museum_EN,
    [Development.NationalMonument]: NationalMonument_EN,
    [Development.PolarBase]: PolarBase_EN,
    [Development.PropagandaCenter]: PropagandaCenter_EN,
    [Development.SecretLaboratory]: SecretLaboratory_EN,
    [Development.SecretSociety]: SecretSociety_EN,
    [Development.SolarCannon]: SolarCannon_EN,
    [Development.SpaceElevator]: SpaceElevator_EN,
    [Development.UndergroundCity]: UndergroundCity_EN,
    [Development.UnderwaterCity]: UnderwaterCity_EN,
    [Development.UniversalExposition]: UniversalExposition_EN,
    [Development.University]: University_EN,
    [Development.WorldCongress]: WorldCongress_EN,
    [Development.AlexandersTomb]: AlexandersTomb_EN,
    [Development.AncientAstronauts]: AncientAstronauts_EN,
    [Development.ArkOfTheCovenant]: ArkOfTheCovenant_EN,
    [Development.Atlantis]: Atlantis_EN,
    [Development.BermudaTriangle]: BermudaTriangle_EN,
    [Development.BlackBeardsTreasure]: BlackBeardsTreasure_EN,
    [Development.CenterOfTheEarth]: CenterOfTheEarth_EN,
    [Development.CitiesOfGold]: CitiesOfGold_EN,
    [Development.CityOfAgartha]: CityOfAgartha_EN,
    [Development.FountainOfYouth]: FountainOfYouth_EN,
    [Development.GardensOfTheHesperides]: GardensOfTheHesperides_EN,
    [Development.IslandOfAvalon]: IslandOfAvalon_EN,
    [Development.KingSolomonsMines]: KingSolomonsMines_EN,
    [Development.LostContinentOfMu]: LostContinentOfMu_EN,
    [Development.ParallelDimension]: ParallelDimension_EN,
    [Development.Roswell]: Roswell_EN,
    [Development.TreasureOfTheTemplars]: TreasureOfTheTemplars_EN,
    [Development.BorderPatrol]: BorderPatrol_EN,
    [Development.KrystalliumPowerPlant]: KrystalliumPowerPlant_EN,
    [Development.RobotFactory]: RobotFactory_EN,
    [Development.GoldMine]: GoldMine_EN,
    [Development.SecretBase]: SecretBase_EN,
    [Development.LawlessZone]: LawlessZone_EN,
    [Development.OccultDistrict]: OccultDistrict_EN,
    [Development.OffshoreLaboratory]: OffshoreLaboratory_EN,
    [Development.FloatingPalace]: FloatingPalace_EN,
    [Development.GiantRobot]: GiantRobot_EN,
    [Development.ArmoredConvoy]: ArmoredConvoy_EN,
    [Development.MobileBase]: MobileBase_EN,
    [Development.Inquisitors]: Inquisitors_EN,
    [Development.Raiders]: Raiders_EN,
    [Development.PlanetaryArchives]: PlanetaryArchives_EN,
    [Development.Telekinesis]: Telekinesis_EN,
    [Development.ArtificialIntelligence]: ArtificialIntelligence_EN,
    [Development.DarkMatter]: DarkMatter_EN,
    [Development.ArtificialSun]: ArtificialSun_EN,
    [Development.Immortality]: Immortality_EN,
    [Development.Utopia]: Utopia_EN,
    [Development.TaxHaven]: TaxHaven_EN,
    [Development.CelestialCathedral]: CelestialCathedral_EN,
    [Development.IntercontinentalNetwork]: IntercontinentalNetwork_EN,
    [Development.HighSecurityPrison]: HighSecurityPrison_EN,
    [Development.OrbitalStation]: OrbitalStation_EN,
    [Development.WorldBank]: WorldBank_EN,
    [Development.LuxuryClinic]: LuxuryClinic_EN,
    [Development.TheWall]: TheWall_EN,
    [Development.Consortium]: Consortium_EN,
    [Development.MiningAsteroid]: MiningAsteroid_EN,
    [Development.Hyperborea]: Hyperborea_EN,
    [Development.Valhalla]: Valhalla_EN,
    [Development.MysteriousVessel]: MysteriousVessel_EN,
    [Development.Pandemonium]: Pandemonium_EN,
    [Development.PandoraBox]: PandoraBox_EN,
    [Development.AlphaCentauri]: AlphaCentauri_EN,
    [Development.Shambhala]: Shambhala_EN,
    [Development.MemorialForTheExplorer]: MemorialForTheExplorer_EN,
    [Development.MemorialForTheBuilder]: MemorialForTheBuilder_EN,
    [Development.MemorialForTheDictator]: MemorialForTheDictator_EN,
    [Development.MemorialForTheFinancier]: MemorialForTheFinancier_EN,
    [Development.MemorialForTheScientist]: MemorialForTheScientist_EN,
    [Development.AnalysisCenter]: AnalysisCenter_EN,
    [Development.SecurityShips]: SecurityShips_EN,
    [Development.TowerOfBabel]: TowerOfBabel_EN,
    [Development.GaussianWeapons]: GaussianWeapons_EN,
    [Development.CargoFleet]: CargoFleet_EN,
    [Development.Pax10]: Pax10_EN,
    [Development.Headquarters]: Headquarters_EN,
    [Development.SecretForces]: SecretForces_EN
  }
}

export const developmentCardDescription = new DevelopmentCardDescription()
