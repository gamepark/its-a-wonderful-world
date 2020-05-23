import {css} from '@emotion/core'
import React, {forwardRef} from 'react'
import CardBack from './back.png'
import Development from './Development'
import {
  AirborneLaboratory, AircraftCarrier, AlexandersTomb, AncientAstronauts, Aquaculture, ArkOfTheCovenant, Atlantis, BermudaTriangle, BionicCrafts,
  BlackBeardsTreasure, CasinoCity, CenterOfTheEarth, CitiesOfGold, CityOfAgartha, ClimateControl, Cryopreservation, EspionageAgency, FinancialCenter,
  FountainOfYouth, GardensOfTheHesperides, GeneticUpgrades, GiantDam, GiantTower, GravityInverter, HarborZone, HumanCloning, Icebreaker, IndustrialComplex,
  IslandOfAvalon, Juggernaut, KingSolomonsMines, LostContinentOfMu, LunarBase, MagneticTrain, MegaBomb, MegaDrill, MilitaryBase, Museum, NationalMonument,
  Neuroscience, NuclearPlant, OffshoreOilRig, ParallelDimension, PolarBase, PropagandaCenter, QuantumGenerator, RecyclingPlant, ResearchCenter, RobotAssistants,
  RoboticAnimals, Roswell, Satellites, SaucerSquadron, SecretLaboratory, SecretSociety, SecurityAutomatons, SolarCannon, SpaceElevator, Submarine,
  Supercomputer, SuperSoldiers, SuperSonar, TankDivision, TimeTravel, Transmutation, TransportationNetwork, TreasureOfTheTemplars, UndergroundCity,
  UnderwaterCity, UniversalExposition, UniversalVaccine, University, UnknownTechnology, VirtualReality, WindTurbines, WorldCongress, Zeppelin
} from './Developments'
import AlexandersTombImage from './discovery/alexanders-tomb.png'
import AncientAstronautsImage from './discovery/ancient-astronauts.png'
import ArkOfTheCovenantImage from './discovery/ark-of-the-covenant.png'
import AtlantisImage from './discovery/atlantis.png'
import BermudaTriangleImage from './discovery/bermuda-triangle.png'
import BlackBeardsTreasureImage from './discovery/blackbeards-treasure.png'
import CenterOfTheEarthImage from './discovery/center-of-the-earth.png'
import CitiesOfGoldImage from './discovery/cities-of-gold.png'
import CityOfAgarthaImage from './discovery/city-of-agartha.png'
import FountainOfYouthImage from './discovery/fountain-of-youth.png'
import GardensOfTheHesperidesImage from './discovery/gardens-of-the-hesperides.png'
import IslandOfAvalonImage from './discovery/island-of-avalon.png'
import KingSolomonsMinesImage from './discovery/king-solomons-mines.png'
import LostContinentOfMuImage from './discovery/lost-continent-of-mu.png'
import ParallelDimensionImage from './discovery/parallel-dimension.png'
import RoswellImage from './discovery/roswell.png'
import TreasureOfTheTemplarsImage from './discovery/treasure-of-the-templars.png'
import CasinoCityImage from './project/casino-city.png'
import EspionageAgencyImage from './project/espionage-agency.png'
import GiantDamImage from './project/giant-dam.png'
import GiantTowerImage from './project/giant-tower.png'
import HarborZoneImage from './project/harbor-zone.png'
import LunarBaseImage from './project/lunar-base.png'
import MagneticTrainImage from './project/magnetic-train.png'
import MuseumImage from './project/museum.png'
import NationalMonumentImage from './project/national-monument.png'
import PolarBaseImage from './project/polar-base.png'
import PropagandaCenterImage from './project/propaganda-center.png'
import SecretLaboratoryImage from './project/secret-laboratory.png'
import SecretSocietyImage from './project/secret-society.png'
import SolarCannonImage from './project/solar-cannon.png'
import SpaceElevatorImage from './project/space-elevator.png'
import UndergroundCityImage from './project/underground-city.png'
import UnderwaterCityImage from './project/underwater-city.png'
import UniversalExpositionImage from './project/universal-exposition.png'
import UniversityImage from './project/university.png'
import WorldCongressImage from './project/world-congress.png'
import AquacultureImage from './research/aquaculture.png'
import BionicCraftsImage from './research/bionic-crafts.png'
import ClimateControlImage from './research/climate-control.png'
import CryopreservationImage from './research/cryopreservation.png'
import GeneticUpgradesImage from './research/genetic-upgrades.png'
import GravityInverterImage from './research/gravity-inverter.png'
import HumanCloningImage from './research/human-cloning.png'
import MegaBombImage from './research/mega-bomb.png'
import NeuroscienceImage from './research/neuroscience.png'
import QuantumGeneratorImage from './research/quantum-generator.png'
import RobotAssistantsImage from './research/robot-assistants.png'
import RoboticAnimalsImage from './research/robotic-animals.png'
import SatellitesImage from './research/satellites.png'
import SecurityAutomatonsImage from './research/security-automatons.png'
import SuperSoldiersImage from './research/super-soldiers.png'
import SuperSonarImage from './research/super-sonar.png'
import SupercomputerImage from './research/supercomputer.png'
import TimeTravelImage from './research/time-travel.png'
import TransmutationImage from './research/transmutation.png'
import UniversalVaccineImage from './research/universal-vaccine.png'
import UnknownTechnologyImage from './research/unknown-technology.png'
import VirtualRealityImage from './research/virtual-reality.png'
import FinancialCenterImage from './structure/financial-center.png'
import IndustrialComplexImage from './structure/industrial-complex.png'
import MilitaryBaseImage from './structure/military-base.png'
import NuclearPlantImage from './structure/nuclear-plant.png'
import OffshoreOilRigImage from './structure/offshore-oil-rig.png'
import RecyclingPlantImage from './structure/recycling-plant.png'
import ResearchCenterImage from './structure/research-center.png'
import TransportationNetworkImage from './structure/transportation-network.png'
import WindTurbinesImage from './structure/wind-turbines.png'
import AirborneLaboratoryImage from './vehicle/airborne-laboratory.png'
import AircraftCarrierImage from './vehicle/aircraft-carrier.png'
import IcebreakerImage from './vehicle/icebreaker.png'
import JuggernautImage from './vehicle/juggernaut.png'
import MegaDrillImage from './vehicle/mega-drill.png'
import SaucerSquadronImage from './vehicle/saucer-squadron.png'
import SubmarineImage from './vehicle/submarine.png'
import TankDivisionImage from './vehicle/tank-division.png'
import ZeppelinImage from './vehicle/zeppelin.png'

type Props = { development?: Development } & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCard = forwardRef<HTMLDivElement, Props>(({development, ...props}, ref) => (
  <div ref={ref} {...props} css={[style, getBackgroundImage(development)]}/>
))

const style = css`
  height: 100%;
  border-radius: 6% / ${65 / 100 * 6}%;
  box-shadow: 0 0 5px black;
  background-size: cover;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
`

const getBackgroundImage = (development?: Development) => css`
  background-image: url(${development ? images.get(development) : CardBack});
`

const images = new Map<Development, any>()

images.set(FinancialCenter, FinancialCenterImage)
images.set(IndustrialComplex, IndustrialComplexImage)
images.set(MilitaryBase, MilitaryBaseImage)
images.set(NuclearPlant, NuclearPlantImage)
images.set(OffshoreOilRig, OffshoreOilRigImage)
images.set(RecyclingPlant, RecyclingPlantImage)
images.set(ResearchCenter, ResearchCenterImage)
images.set(TransportationNetwork, TransportationNetworkImage)
images.set(WindTurbines, WindTurbinesImage)
images.set(AirborneLaboratory, AirborneLaboratoryImage)
images.set(AircraftCarrier, AircraftCarrierImage)
images.set(Icebreaker, IcebreakerImage)
images.set(Juggernaut, JuggernautImage)
images.set(MegaDrill, MegaDrillImage)
images.set(SaucerSquadron, SaucerSquadronImage)
images.set(Submarine, SubmarineImage)
images.set(TankDivision, TankDivisionImage)
images.set(Zeppelin, ZeppelinImage)
images.set(Aquaculture, AquacultureImage)
images.set(BionicCrafts, BionicCraftsImage)
images.set(ClimateControl, ClimateControlImage)
images.set(Cryopreservation, CryopreservationImage)
images.set(GeneticUpgrades, GeneticUpgradesImage)
images.set(GravityInverter, GravityInverterImage)
images.set(HumanCloning, HumanCloningImage)
images.set(MegaBomb, MegaBombImage)
images.set(Neuroscience, NeuroscienceImage)
images.set(QuantumGenerator, QuantumGeneratorImage)
images.set(RobotAssistants, RobotAssistantsImage)
images.set(RoboticAnimals, RoboticAnimalsImage)
images.set(Satellites, SatellitesImage)
images.set(SecurityAutomatons, SecurityAutomatonsImage)
images.set(SuperSoldiers, SuperSoldiersImage)
images.set(SuperSonar, SuperSonarImage)
images.set(Supercomputer, SupercomputerImage)
images.set(TimeTravel, TimeTravelImage)
images.set(Transmutation, TransmutationImage)
images.set(UniversalVaccine, UniversalVaccineImage)
images.set(UnknownTechnology, UnknownTechnologyImage)
images.set(VirtualReality, VirtualRealityImage)
images.set(CasinoCity, CasinoCityImage)
images.set(EspionageAgency, EspionageAgencyImage)
images.set(GiantDam, GiantDamImage)
images.set(GiantTower, GiantTowerImage)
images.set(HarborZone, HarborZoneImage)
images.set(LunarBase, LunarBaseImage)
images.set(MagneticTrain, MagneticTrainImage)
images.set(Museum, MuseumImage)
images.set(NationalMonument, NationalMonumentImage)
images.set(PolarBase, PolarBaseImage)
images.set(PropagandaCenter, PropagandaCenterImage)
images.set(SecretLaboratory, SecretLaboratoryImage)
images.set(SecretSociety, SecretSocietyImage)
images.set(SolarCannon, SolarCannonImage)
images.set(SpaceElevator, SpaceElevatorImage)
images.set(UndergroundCity, UndergroundCityImage)
images.set(UnderwaterCity, UnderwaterCityImage)
images.set(UniversalExposition, UniversalExpositionImage)
images.set(University, UniversityImage)
images.set(WorldCongress, WorldCongressImage)
images.set(AlexandersTomb, AlexandersTombImage)
images.set(AncientAstronauts, AncientAstronautsImage)
images.set(ArkOfTheCovenant, ArkOfTheCovenantImage)
images.set(Atlantis, AtlantisImage)
images.set(BermudaTriangle, BermudaTriangleImage)
images.set(BlackBeardsTreasure, BlackBeardsTreasureImage)
images.set(CenterOfTheEarth, CenterOfTheEarthImage)
images.set(CitiesOfGold, CitiesOfGoldImage)
images.set(CityOfAgartha, CityOfAgarthaImage)
images.set(FountainOfYouth, FountainOfYouthImage)
images.set(GardensOfTheHesperides, GardensOfTheHesperidesImage)
images.set(IslandOfAvalon, IslandOfAvalonImage)
images.set(KingSolomonsMines, KingSolomonsMinesImage)
images.set(LostContinentOfMu, LostContinentOfMuImage)
images.set(ParallelDimension, ParallelDimensionImage)
images.set(Roswell, RoswellImage)
images.set(TreasureOfTheTemplars, TreasureOfTheTemplarsImage)

export default DevelopmentCard