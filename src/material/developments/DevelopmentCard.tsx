import {css} from '@emotion/core'
import React, {FunctionComponent, MouseEventHandler} from 'react'
import CardBack from './back.png'
import Development from './Development'
import AlexandersTomb from './discovery/alexanders-tomb.png'
import AncientAstronauts from './discovery/ancient-astronauts.png'
import ArkOfTheCovenant from './discovery/ark-of-the-covenant.png'
import Atlantis from './discovery/atlantis.png'
import BermudaTriangle from './discovery/bermuda-triangle.png'
import BlackBeardsTreasure from './discovery/blackbeards-treasure.png'
import CenterOfTheEarth from './discovery/center-of-the-earth.png'
import CitiesOfGold from './discovery/cities-of-gold.png'
import CityOfAgartha from './discovery/city-of-agartha.png'
import FountainOfYouth from './discovery/fountain-of-youth.png'
import GardensOfTheHesperides from './discovery/gardens-of-the-hesperides.png'
import IslandOfAvalon from './discovery/island-of-avalon.png'
import KingSolomonsMines from './discovery/king-solomons-mines.png'
import LostContinentOfMu from './discovery/lost-continent-of-mu.png'
import ParallelDimension from './discovery/parallel-dimension.png'
import Roswell from './discovery/roswell.png'
import TreasureOfTheTemplars from './discovery/treasure-of-the-templars.png'
import CasinoCity from './project/casino-city.png'
import EspionageAgency from './project/espionage-agency.png'
import GiantDam from './project/giant-dam.png'
import GiantTower from './project/giant-tower.png'
import HarborZone from './project/harbor-zone.png'
import LunarBase from './project/lunar-base.png'
import MagneticTrain from './project/magnetic-train.png'
import Museum from './project/museum.png'
import NationalMonument from './project/national-monument.png'
import PolarBase from './project/polar-base.png'
import PropagandaCenter from './project/propaganda-center.png'
import SecretLaboratory from './project/secret-laboratory.png'
import SecretSociety from './project/secret-society.png'
import SolarCannon from './project/solar-cannon.png'
import SpaceElevator from './project/space-elevator.png'
import UndergroundCity from './project/underground-city.png'
import UnderwaterCity from './project/underwater-city.png'
import UniversalExposition from './project/universal-exposition.png'
import University from './project/university.png'
import WorldCongress from './project/world-congress.png'
import Aquaculture from './research/aquaculture.png'
import BionicCrafts from './research/bionic-crafts.png'
import ClimateControl from './research/climate-control.png'
import Cryopreservation from './research/cryopreservation.png'
import GeneticUpgrades from './research/genetic-upgrades.png'
import GravityInverter from './research/gravity-inverter.png'
import HumanCloning from './research/human-cloning.png'
import MegaBomb from './research/mega-bomb.png'
import Neuroscience from './research/neuroscience.png'
import QuantumGenerator from './research/quantum-generator.png'
import RobotAssistants from './research/robot-assistants.png'
import RoboticAnimals from './research/robotic-animals.png'
import Satellites from './research/satellites.png'
import SecurityAutomatons from './research/security-automatons.png'
import SuperSoldiers from './research/super-soldiers.png'
import SuperSonar from './research/super-sonar.png'
import Supercomputer from './research/supercomputer.png'
import TimeTravel from './research/time-travel.png'
import Transmutation from './research/transmutation.png'
import UniversalVaccine from './research/universal-vaccine.png'
import UnknownTechnology from './research/unknown-technology.png'
import VirtualReality from './research/virtual-reality.png'
import FinancialCenter from './structure/financial-center.png'
import IndustrialComplex from './structure/industrial-complex.png'
import MilitaryBase from './structure/military-base.png'
import NuclearPlant from './structure/nuclear-plant.png'
import OffshoreOilRig from './structure/offshore-oil-rig.png'
import RecyclingPlant from './structure/recycling-plant.png'
import ResearchCenter from './structure/research-center.png'
import TransportationNetwork from './structure/transportation-network.png'
import WindTurbines from './structure/wind-turbines.png'
import AirborneLaboratory from './vehicle/airborne-laboratory.png'
import AircraftCarrier from './vehicle/aircraft-carrier.png'
import Icebreaker from './vehicle/icebreaker.png'
import Juggernaut from './vehicle/juggernaut.png'
import MegaDrill from './vehicle/mega-drill.png'
import SaucerSquadron from './vehicle/saucer-squadron.png'
import Submarine from './vehicle/submarine.png'
import TankDivision from './vehicle/tank-division.png'
import Zeppelin from './vehicle/zeppelin.png'

type Props = {
  development?: Development
  onClick?: MouseEventHandler
} & React.HTMLAttributes<HTMLDivElement>

export const height = 23
export const width = 14.95

const DevelopmentCard: FunctionComponent<Props> = ({development, ...props}) => (
  <div css={css`${style}; ${backgroundImage(development)};`} {...props}>
    <h3 style={{display: 'none'}}>Zeppelin</h3>
  </div>
)

const style = css`
  height: ${height}vh;
  width: ${width}vh;
  background-size: cover;
  border-radius: 1vh;
  box-shadow: 0 0 0.2vh black;
`

function backgroundImage(development?: Development) {
  return css`background-image: url('${images[development] || CardBack}')`
}

const images = {
  [Development.FinancialCenter]: FinancialCenter,
  [Development.IndustrialComplex]: IndustrialComplex,
  [Development.MilitaryBase]: MilitaryBase,
  [Development.NuclearPlant]: NuclearPlant,
  [Development.OffshoreOilRig]: OffshoreOilRig,
  [Development.RecyclingPlant]: RecyclingPlant,
  [Development.ResearchCenter]: ResearchCenter,
  [Development.TransportationNetwork]: TransportationNetwork,
  [Development.WindTurbines]: WindTurbines,
  [Development.AirborneLaboratory]: AirborneLaboratory,
  [Development.AircraftCarrier]: AircraftCarrier,
  [Development.Icebreaker]: Icebreaker,
  [Development.Juggernaut]: Juggernaut,
  [Development.MegaDrill]: MegaDrill,
  [Development.SaucerSquadron]: SaucerSquadron,
  [Development.Submarine]: Submarine,
  [Development.TankDivision]: TankDivision,
  [Development.Zeppelin]: Zeppelin,
  [Development.Aquaculture]: Aquaculture,
  [Development.BionicCrafts]: BionicCrafts,
  [Development.ClimateControl]: ClimateControl,
  [Development.Cryopreservation]: Cryopreservation,
  [Development.GeneticUpgrades]: GeneticUpgrades,
  [Development.GravityInverter]: GravityInverter,
  [Development.HumanCloning]: HumanCloning,
  [Development.MegaBomb]: MegaBomb,
  [Development.Neuroscience]: Neuroscience,
  [Development.QuantumGenerator]: QuantumGenerator,
  [Development.RobotAssistants]: RobotAssistants,
  [Development.RoboticAnimals]: RoboticAnimals,
  [Development.Satellites]: Satellites,
  [Development.SecurityAutomatons]: SecurityAutomatons,
  [Development.SuperSoldiers]: SuperSoldiers,
  [Development.SuperSonar]: SuperSonar,
  [Development.Supercomputer]: Supercomputer,
  [Development.TimeTravel]: TimeTravel,
  [Development.Transmutation]: Transmutation,
  [Development.UniversalVaccine]: UniversalVaccine,
  [Development.UnknownTechnology]: UnknownTechnology,
  [Development.VirtualReality]: VirtualReality,
  [Development.CasinoCity]: CasinoCity,
  [Development.EspionageAgency]: EspionageAgency,
  [Development.GiantDam]: GiantDam,
  [Development.GiantTower]: GiantTower,
  [Development.HarborZone]: HarborZone,
  [Development.LunarBase]: LunarBase,
  [Development.MagneticTrain]: MagneticTrain,
  [Development.Museum]: Museum,
  [Development.NationalMonument]: NationalMonument,
  [Development.PolarBase]: PolarBase,
  [Development.PropagandaCenter]: PropagandaCenter,
  [Development.SecretLaboratory]: SecretLaboratory,
  [Development.SecretSociety]: SecretSociety,
  [Development.SolarCannon]: SolarCannon,
  [Development.SpaceElevator]: SpaceElevator,
  [Development.UndergroundCity]: UndergroundCity,
  [Development.UnderwaterCity]: UnderwaterCity,
  [Development.UniversalExposition]: UniversalExposition,
  [Development.University]: University,
  [Development.WorldCongress]: WorldCongress,
  [Development.AlexandersTomb]: AlexandersTomb,
  [Development.AncientAstronauts]: AncientAstronauts,
  [Development.ArkOfTheCovenant]: ArkOfTheCovenant,
  [Development.Atlantis]: Atlantis,
  [Development.BermudaTriangle]: BermudaTriangle,
  [Development.BlackBeardsTreasure]: BlackBeardsTreasure,
  [Development.CenterOfTheEarth]: CenterOfTheEarth,
  [Development.CitiesOfGold]: CitiesOfGold,
  [Development.CityOfAgartha]: CityOfAgartha,
  [Development.FountainOfYouth]: FountainOfYouth,
  [Development.GardensOfTheHesperides]: GardensOfTheHesperides,
  [Development.IslandOfAvalon]: IslandOfAvalon,
  [Development.KingSolomonsMines]: KingSolomonsMines,
  [Development.LostContinentOfMu]: LostContinentOfMu,
  [Development.ParallelDimension]: ParallelDimension,
  [Development.Roswell]: Roswell,
  [Development.TreasureOfTheTemplars]: TreasureOfTheTemplars
}

export default DevelopmentCard