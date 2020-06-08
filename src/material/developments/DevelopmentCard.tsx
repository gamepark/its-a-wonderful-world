import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {forwardRef} from 'react'
import {useTranslation} from 'react-i18next'
import CardBack from './back.jpg'
import Development from './Development'
import {
  AirborneLaboratory, AircraftCarrier, AlexandersTomb, AncientAstronauts, Aquaculture, ArkOfTheCovenant, Atlantis, BermudaTriangle, BionicCrafts,
  BlackBeardsTreasure, CasinoCity, CenterOfTheEarth, CitiesOfGold, CityOfAgartha, ClimateControl, Cryopreservation, EspionageAgency, FinancialCenter,
  FountainOfYouth, GardensOfTheHesperides, GeneticUpgrades, GiantDam, GiantTower, GravityInverter, HarborZone, HumanCloning, Icebreaker, IndustrialComplex,
  IslandOfAvalon, Juggernaut, KingSolomonsMines, LostContinentOfMu, LunarBase, MagneticTrain, MegaBomb, MegaDrill, MilitaryBase, Museum, NationalMonument,
  Neuroscience, NuclearPlant, OffshoreOilRig, ParallelDimension, PolarBase, PropagandaCenter, QuantumGenerator, RecyclingPlant, ResearchCenter, RobotAssistants,
  RoboticAnimals, Roswell, Satellites, SaucerSquadron, SecretLaboratory, SecretSociety, SecurityAutomatons, SolarCannon, SpaceElevator, Submarine,
  Supercomputer, SuperSoldiers, SuperSonar, TankDivision, Teleportation, TimeTravel, Transmutation, TransportationNetwork, TreasureOfTheTemplars,
  UndergroundCity, UnderwaterCity, UniversalExposition, UniversalVaccine, University, UnknownTechnology, VirtualReality, WindTurbines, WorldCongress, Zeppelin
} from './Developments'
import AlexandersTombImage from './discovery/alexanders-tomb.jpg'
import AncientAstronautsImage from './discovery/ancient-astronauts.jpg'
import ArkOfTheCovenantImage from './discovery/ark-of-the-covenant.jpg'
import AtlantisImage from './discovery/atlantis.jpg'
import BermudaTriangleImage from './discovery/bermuda-triangle.jpg'
import BlackBeardsTreasureImage from './discovery/blackbeards-treasure.jpg'
import CenterOfTheEarthImage from './discovery/center-of-the-earth.jpg'
import CitiesOfGoldImage from './discovery/cities-of-gold.jpg'
import CityOfAgarthaImage from './discovery/city-of-agartha.jpg'
import FountainOfYouthImage from './discovery/fountain-of-youth.jpg'
import GardensOfTheHesperidesImage from './discovery/gardens-of-the-hesperides.jpg'
import IslandOfAvalonImage from './discovery/island-of-avalon.jpg'
import KingSolomonsMinesImage from './discovery/king-solomons-mines.jpg'
import LostContinentOfMuImage from './discovery/lost-continent-of-mu.jpg'
import ParallelDimensionImage from './discovery/parallel-dimension.jpg'
import RoswellImage from './discovery/roswell.jpg'
import TreasureOfTheTemplarsImage from './discovery/treasure-of-the-templars.jpg'
import CasinoCityImage from './project/casino-city.jpg'
import EspionageAgencyImage from './project/espionage-agency.jpg'
import GiantDamImage from './project/giant-dam.jpg'
import GiantTowerImage from './project/giant-tower.jpg'
import HarborZoneImage from './project/harbor-zone.jpg'
import LunarBaseImage from './project/lunar-base.jpg'
import MagneticTrainImage from './project/magnetic-train.jpg'
import MuseumImage from './project/museum.jpg'
import NationalMonumentImage from './project/national-monument.jpg'
import PolarBaseImage from './project/polar-base.jpg'
import PropagandaCenterImage from './project/propaganda-center.jpg'
import SecretLaboratoryImage from './project/secret-laboratory.jpg'
import SecretSocietyImage from './project/secret-society.jpg'
import SolarCannonImage from './project/solar-cannon.jpg'
import SpaceElevatorImage from './project/space-elevator.jpg'
import UndergroundCityImage from './project/underground-city.jpg'
import UnderwaterCityImage from './project/underwater-city.jpg'
import UniversalExpositionImage from './project/universal-exposition.jpg'
import UniversityImage from './project/university.jpg'
import WorldCongressImage from './project/world-congress.jpg'
import AquacultureImage from './research/aquaculture.jpg'
import BionicCraftsImage from './research/bionic-crafts.jpg'
import ClimateControlImage from './research/climate-control.jpg'
import CryopreservationImage from './research/cryopreservation.jpg'
import GeneticUpgradesImage from './research/genetic-upgrades.jpg'
import GravityInverterImage from './research/gravity-inverter.jpg'
import HumanCloningImage from './research/human-cloning.jpg'
import MegaBombImage from './research/mega-bomb.jpg'
import NeuroscienceImage from './research/neuroscience.jpg'
import QuantumGeneratorImage from './research/quantum-generator.jpg'
import RobotAssistantsImage from './research/robot-assistants.jpg'
import RoboticAnimalsImage from './research/robotic-animals.jpg'
import SatellitesImage from './research/satellites.jpg'
import SecurityAutomatonsImage from './research/security-automatons.jpg'
import SuperSoldiersImage from './research/super-soldiers.jpg'
import SuperSonarImage from './research/super-sonar.jpg'
import SupercomputerImage from './research/supercomputer.jpg'
import TeleportationImage from './research/teleportation.jpg'
import TimeTravelImage from './research/time-travel.jpg'
import TransmutationImage from './research/transmutation.jpg'
import UniversalVaccineImage from './research/universal-vaccine.jpg'
import UnknownTechnologyImage from './research/unknown-technology.jpg'
import VirtualRealityImage from './research/virtual-reality.jpg'
import FinancialCenterImage from './structure/financial-center.jpg'
import IndustrialComplexImage from './structure/industrial-complex.jpg'
import MilitaryBaseImage from './structure/military-base.jpg'
import NuclearPlantImage from './structure/nuclear-plant.jpg'
import OffshoreOilRigImage from './structure/offshore-oil-rig.jpg'
import RecyclingPlantImage from './structure/recycling-plant.jpg'
import ResearchCenterImage from './structure/research-center.jpg'
import TransportationNetworkImage from './structure/transportation-network.jpg'
import WindTurbinesImage from './structure/wind-turbines.jpg'
import AirborneLaboratoryImage from './vehicle/airborne-laboratory.jpg'
import AircraftCarrierImage from './vehicle/aircraft-carrier.jpg'
import IcebreakerImage from './vehicle/icebreaker.jpg'
import JuggernautImage from './vehicle/juggernaut.jpg'
import MegaDrillImage from './vehicle/mega-drill.jpg'
import SaucerSquadronImage from './vehicle/saucer-squadron.jpg'
import SubmarineImage from './vehicle/submarine.jpg'
import TankDivisionImage from './vehicle/tank-division.jpg'
import ZeppelinImage from './vehicle/zeppelin.jpg'

type Props = { development?: Development } & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCard = forwardRef<HTMLDivElement, Props>(({development, ...props}, ref) => {
  const {t} = useTranslation()
  return (
    <div ref={ref} {...props} css={[style, getBackgroundImage(development)]}>
      {development && <h3 css={cardTitle}>{titles.get(development)!(t)}</h3>}
    </div>
  )
})

const style = css`
  height: 100%;
  border-radius: 6% / ${65 / 100 * 6}%;
  box-shadow: 0 0 5px black;
  background-size: cover;
  transform-style: preserve-3d;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  &:before { // Used to have a thickness so the cards does not disappear at half rotation
    content: '';
    background-color: grey;
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    z-index: -10;
    transform-origin: left;
    transform: rotateY(90deg);
  }
  &:after {
    content: '';
    position: absolute;
    right: 1px;
    left: 1px;
    top: 1px;
    bottom: 1px;
    border-radius: 6% / ${65 / 100 * 6}%;
    background-image: url(${CardBack});
    background-size: cover;
    transform: translateZ(-2px) rotateY(180deg);
    transform-style: preserve-3d;
  }
`

const getBackgroundImage = (development?: Development) => css`
  background-image: url(${development ? images.get(development) : CardBack});
`

export const cardTitleFontSize = 0.85

const cardTitle = css`
  position: absolute;
  top: 1.4%;
  left: 19%;
  width: 68%;
  text-align: center;
  color: #EEE;
  font-size: ${cardTitleFontSize}vh;
  font-weight: lighter;
  text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
  text-transform:uppercase;
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
images.set(Teleportation, TeleportationImage)
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

const titles = new Map<Development, (t: TFunction) => string>()

titles.set(FinancialCenter, (t: TFunction) => t('Place financière'))
titles.set(IndustrialComplex, (t: TFunction) => t('Complexe industriel'))
titles.set(MilitaryBase, (t: TFunction) => t('Base militaire'))
titles.set(NuclearPlant, (t: TFunction) => t('Centrale nucléaire'))
titles.set(OffshoreOilRig, (t: TFunction) => t('Plateforme pétrolière'))
titles.set(RecyclingPlant, (t: TFunction) => t('Usine de recyclage'))
titles.set(ResearchCenter, (t: TFunction) => t('Centre de recherche'))
titles.set(TransportationNetwork, (t: TFunction) => t('Réseau de transport'))
titles.set(WindTurbines, (t: TFunction) => t('Éoliennes'))
titles.set(AirborneLaboratory, (t: TFunction) => t('Laboratoire aéroporté'))
titles.set(AircraftCarrier, (t: TFunction) => t('Porte-avions'))
titles.set(Icebreaker, (t: TFunction) => t('Brise-glace'))
titles.set(Juggernaut, (t: TFunction) => t('Juggernaut'))
titles.set(MegaDrill, (t: TFunction) => t('Méga-foreuse'))
titles.set(SaucerSquadron, (t: TFunction) => t('Escadrille de soucoupes'))
titles.set(Submarine, (t: TFunction) => t('Sous-marin'))
titles.set(TankDivision, (t: TFunction) => t('Division de chars'))
titles.set(Zeppelin, (t: TFunction) => t('Zeppelin'))
titles.set(Aquaculture, (t: TFunction) => t('Aquaculture'))
titles.set(BionicCrafts, (t: TFunction) => t('Greffes bioniques'))
titles.set(ClimateControl, (t: TFunction) => t('Contrôle du climat'))
titles.set(Cryopreservation, (t: TFunction) => t('Cryogénisation'))
titles.set(GeneticUpgrades, (t: TFunction) => t('Amélioration génétique'))
titles.set(GravityInverter, (t: TFunction) => t('Inverseur de gravité'))
titles.set(HumanCloning, (t: TFunction) => t('Clonage humain'))
titles.set(MegaBomb, (t: TFunction) => t('Méga-bombe'))
titles.set(Neuroscience, (t: TFunction) => t('Neuroscience'))
titles.set(QuantumGenerator, (t: TFunction) => t('Générateur quantique'))
titles.set(RobotAssistants, (t: TFunction) => t('Robots de compagnie'))
titles.set(RoboticAnimals, (t: TFunction) => t('Animorphes'))
titles.set(Satellites, (t: TFunction) => t('Satellites'))
titles.set(SecurityAutomatons, (t: TFunction) => t('Automates de contrôle'))
titles.set(SuperSoldiers, (t: TFunction) => t('Super-soldats'))
titles.set(SuperSonar, (t: TFunction) => t('Super-sonar'))
titles.set(Supercomputer, (t: TFunction) => t('Super calculateur'))
titles.set(Teleportation, (t: TFunction) => t('Téléportation'))
titles.set(TimeTravel, (t: TFunction) => t('Voyage temporel'))
titles.set(Transmutation, (t: TFunction) => t('Transmutation'))
titles.set(UniversalVaccine, (t: TFunction) => t('Vaccin universel'))
titles.set(UnknownTechnology, (t: TFunction) => t('Technologie inconnue'))
titles.set(VirtualReality, (t: TFunction) => t('Réalité virtuelle'))
titles.set(CasinoCity, (t: TFunction) => t('Ville-casino'))
titles.set(EspionageAgency, (t: TFunction) => t('Agence d’espionnage'))
titles.set(GiantDam, (t: TFunction) => t('Barrage géant'))
titles.set(GiantTower, (t: TFunction) => t('Tour géante'))
titles.set(HarborZone, (t: TFunction) => t('Zone portuaire'))
titles.set(LunarBase, (t: TFunction) => t('Base lunaire'))
titles.set(MagneticTrain, (t: TFunction) => t('Train magnétique'))
titles.set(Museum, (t: TFunction) => t('Musée'))
titles.set(NationalMonument, (t: TFunction) => t('Monument national'))
titles.set(PolarBase, (t: TFunction) => t('Base polaire'))
titles.set(PropagandaCenter, (t: TFunction) => t('Centre de propagande'))
titles.set(SecretLaboratory, (t: TFunction) => t('Laboratoire secret'))
titles.set(SecretSociety, (t: TFunction) => t('Société secrète'))
titles.set(SolarCannon, (t: TFunction) => t('Canon solaire'))
titles.set(SpaceElevator, (t: TFunction) => t('Ascenseur spatial'))
titles.set(UndergroundCity, (t: TFunction) => t('Ville souterraine'))
titles.set(UnderwaterCity, (t: TFunction) => t('Ville sous-marine'))
titles.set(UniversalExposition, (t: TFunction) => t('Exposition universelle'))
titles.set(University, (t: TFunction) => t('Université'))
titles.set(WorldCongress, (t: TFunction) => t('Congrès mondial'))
titles.set(AlexandersTomb, (t: TFunction) => t('Tombeau d’Alexandre'))
titles.set(AncientAstronauts, (t: TFunction) => t('Anciens astronautes'))
titles.set(ArkOfTheCovenant, (t: TFunction) => t('Arche d’alliance'))
titles.set(Atlantis, (t: TFunction) => t('Atlantide'))
titles.set(BermudaTriangle, (t: TFunction) => t('Triangle des Bermudes'))
titles.set(BlackBeardsTreasure, (t: TFunction) => t('Trésor de Barbe Noire'))
titles.set(CenterOfTheEarth, (t: TFunction) => t('Centre de la Terre'))
titles.set(CitiesOfGold, (t: TFunction) => t('Cités d’or'))
titles.set(CityOfAgartha, (t: TFunction) => t('Cité d’Agartha'))
titles.set(FountainOfYouth, (t: TFunction) => t('Fontaine de jouvence'))
titles.set(GardensOfTheHesperides, (t: TFunction) => t('Jardin des Hespérides'))
titles.set(IslandOfAvalon, (t: TFunction) => t('Île d’Avalon'))
titles.set(KingSolomonsMines, (t: TFunction) => t('Mines du roi Salomon'))
titles.set(LostContinentOfMu, (t: TFunction) => t('Continent perdu de Mu'))
titles.set(ParallelDimension, (t: TFunction) => t('Dimension parallèle'))
titles.set(Roswell, (t: TFunction) => t('Roswell'))
titles.set(TreasureOfTheTemplars, (t: TFunction) => t('Trésor des Templiers'))


export default DevelopmentCard