import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {forwardRef} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../Images'
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

type Props = { development?: Development } & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCard = forwardRef<HTMLDivElement, Props>(({development, ...props}, ref) => {
  const {t} = useTranslation()
  return (
    <div ref={ref} {...props} css={[style, !development && hidden]}>
      <div css={[frontFace, getBackgroundImage(development)]}>
        {development && <h3 css={cardTitle}>{titles.get(development)!(t)}</h3>}
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