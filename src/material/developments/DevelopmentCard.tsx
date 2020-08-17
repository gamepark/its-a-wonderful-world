import {css} from '@emotion/core'
import React, {forwardRef} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../Images'
import Development from './Development'
import DevelopmentCardsTitles from './DevelopmentCardsTitles'
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

type Props = { development?: Development } & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCard = forwardRef<HTMLDivElement, Props>(({development, ...props}, ref) => {
  const {t} = useTranslation()
  return (
    <div ref={ref} {...props} css={[style, !development && hidden]}>
      <div css={[frontFace, getBackgroundImage(development)]}>
        {development && <h3 css={cardTitle}>{DevelopmentCardsTitles.get(development)!(t)}</h3>}
      </div>
    </div>
  )
})

const style = css`
  height: 100%;
  border-radius: 6% / ${65 / 100 * 6}%;
  box-shadow: 0 0 5px black;
  transform-style: preserve-3d;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6% / ${65 / 100 * 6}%;
    background-image: url(${Images.developmentBack});
    background-size: cover;
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }
`

const hidden = css`
    transform: rotateY(180deg);
`

const frontFace = css`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  border-radius: 6% / ${65 / 100 * 6}%;
`

const getBackgroundImage = (development?: Development) => css`
  background-image: url(${development ? images.get(development) : Images.developmentBack});
`

export const cardTitleFontSize = 0.9

const cardTitle = css`
  position: absolute;
  top: 1.4%;
  left: 19%;
  width: 68%;
  text-align: center;
  color: #EEE;
  font-size: ${cardTitleFontSize}em;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform:uppercase;
`
const images = new Map<Development, any>()

images.set(FinancialCenter, Images.financialCenter)
images.set(IndustrialComplex, Images.industrialComplex)
images.set(MilitaryBase, Images.militaryBase)
images.set(NuclearPlant, Images.nuclearPlant)
images.set(OffshoreOilRig, Images.offshoreOilRig)
images.set(RecyclingPlant, Images.recyclingPlant)
images.set(ResearchCenter, Images.researchCenter)
images.set(TransportationNetwork, Images.transportationNetwork)
images.set(WindTurbines, Images.windTurbines)
images.set(AirborneLaboratory, Images.airborneLaboratory)
images.set(AircraftCarrier, Images.aircraftCarrier)
images.set(Icebreaker, Images.icebreaker)
images.set(Juggernaut, Images.juggernaut)
images.set(MegaDrill, Images.megaDrill)
images.set(SaucerSquadron, Images.saucerSquadron)
images.set(Submarine, Images.submarine)
images.set(TankDivision, Images.tankDivision)
images.set(Zeppelin, Images.zeppelin)
images.set(Aquaculture, Images.aquaculture)
images.set(BionicCrafts, Images.bionicCrafts)
images.set(ClimateControl, Images.climateControl)
images.set(Cryopreservation, Images.cryopreservation)
images.set(GeneticUpgrades, Images.geneticUpgrades)
images.set(GravityInverter, Images.gravityInverter)
images.set(HumanCloning, Images.humanCloning)
images.set(MegaBomb, Images.megaBomb)
images.set(Neuroscience, Images.neuroscience)
images.set(QuantumGenerator, Images.quantumGenerator)
images.set(RobotAssistants, Images.robotAssistants)
images.set(RoboticAnimals, Images.roboticAnimals)
images.set(Satellites, Images.satellites)
images.set(SecurityAutomatons, Images.securityAutomatons)
images.set(SuperSoldiers, Images.superSoldiers)
images.set(SuperSonar, Images.superSonar)
images.set(Supercomputer, Images.supercomputer)
images.set(Teleportation, Images.teleportation)
images.set(TimeTravel, Images.timeTravel)
images.set(Transmutation, Images.transmutation)
images.set(UniversalVaccine, Images.universalVaccine)
images.set(UnknownTechnology, Images.unknownTechnology)
images.set(VirtualReality, Images.virtualReality)
images.set(CasinoCity, Images.casinoCity)
images.set(EspionageAgency, Images.espionageAgency)
images.set(GiantDam, Images.giantDam)
images.set(GiantTower, Images.giantTower)
images.set(HarborZone, Images.harborZone)
images.set(LunarBase, Images.lunarBase)
images.set(MagneticTrain, Images.magneticTrain)
images.set(Museum, Images.museum)
images.set(NationalMonument, Images.nationalMonument)
images.set(PolarBase, Images.polarBase)
images.set(PropagandaCenter, Images.propagandaCenter)
images.set(SecretLaboratory, Images.secretLaboratory)
images.set(SecretSociety, Images.secretSociety)
images.set(SolarCannon, Images.solarCannon)
images.set(SpaceElevator, Images.spaceElevator)
images.set(UndergroundCity, Images.undergroundCity)
images.set(UnderwaterCity, Images.underwaterCity)
images.set(UniversalExposition, Images.universalExposition)
images.set(University, Images.university)
images.set(WorldCongress, Images.worldCongress)
images.set(AlexandersTomb, Images.alexandersTomb)
images.set(AncientAstronauts, Images.ancientAstronauts)
images.set(ArkOfTheCovenant, Images.arkOfTheCovenant)
images.set(Atlantis, Images.atlantis)
images.set(BermudaTriangle, Images.bermudaTriangle)
images.set(BlackBeardsTreasure, Images.blackBeardsTreasure)
images.set(CenterOfTheEarth, Images.centerOfTheEarth)
images.set(CitiesOfGold, Images.citiesOfGold)
images.set(CityOfAgartha, Images.cityOfAgartha)
images.set(FountainOfYouth, Images.fountainOfYouth)
images.set(GardensOfTheHesperides, Images.gardensOfTheHesperides)
images.set(IslandOfAvalon, Images.islandOfAvalon)
images.set(KingSolomonsMines, Images.kingSolomonsMines)
images.set(LostContinentOfMu, Images.lostContinentOfMu)
images.set(ParallelDimension, Images.parallelDimension)
images.set(Roswell, Images.roswell)
images.set(TreasureOfTheTemplars, Images.treasureOfTheTemplars)

export default DevelopmentCard