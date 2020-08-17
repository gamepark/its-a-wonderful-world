import {TFunction} from 'i18next'
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

const DevelopmentCardsTitles = new Map<Development, (t: TFunction) => string>()

DevelopmentCardsTitles.set(FinancialCenter, (t: TFunction) => t('Place financière'))
DevelopmentCardsTitles.set(IndustrialComplex, (t: TFunction) => t('Complexe industriel'))
DevelopmentCardsTitles.set(MilitaryBase, (t: TFunction) => t('Base militaire'))
DevelopmentCardsTitles.set(NuclearPlant, (t: TFunction) => t('Centrale nucléaire'))
DevelopmentCardsTitles.set(OffshoreOilRig, (t: TFunction) => t('Plateforme pétrolière'))
DevelopmentCardsTitles.set(RecyclingPlant, (t: TFunction) => t('Usine de recyclage'))
DevelopmentCardsTitles.set(ResearchCenter, (t: TFunction) => t('Centre de recherche'))
DevelopmentCardsTitles.set(TransportationNetwork, (t: TFunction) => t('Réseau de transport'))
DevelopmentCardsTitles.set(WindTurbines, (t: TFunction) => t('Éoliennes'))
DevelopmentCardsTitles.set(AirborneLaboratory, (t: TFunction) => t('Laboratoire aéroporté'))
DevelopmentCardsTitles.set(AircraftCarrier, (t: TFunction) => t('Porte-avions'))
DevelopmentCardsTitles.set(Icebreaker, (t: TFunction) => t('Brise-glace'))
DevelopmentCardsTitles.set(Juggernaut, (t: TFunction) => t('Juggernaut'))
DevelopmentCardsTitles.set(MegaDrill, (t: TFunction) => t('Méga-foreuse'))
DevelopmentCardsTitles.set(SaucerSquadron, (t: TFunction) => t('Escadrille de soucoupes'))
DevelopmentCardsTitles.set(Submarine, (t: TFunction) => t('Sous-marin'))
DevelopmentCardsTitles.set(TankDivision, (t: TFunction) => t('Division de chars'))
DevelopmentCardsTitles.set(Zeppelin, (t: TFunction) => t('Zeppelin'))
DevelopmentCardsTitles.set(Aquaculture, (t: TFunction) => t('Aquaculture'))
DevelopmentCardsTitles.set(BionicCrafts, (t: TFunction) => t('Greffes bioniques'))
DevelopmentCardsTitles.set(ClimateControl, (t: TFunction) => t('Contrôle du climat'))
DevelopmentCardsTitles.set(Cryopreservation, (t: TFunction) => t('Cryogénisation'))
DevelopmentCardsTitles.set(GeneticUpgrades, (t: TFunction) => t('Amélioration génétique'))
DevelopmentCardsTitles.set(GravityInverter, (t: TFunction) => t('Inverseur de gravité'))
DevelopmentCardsTitles.set(HumanCloning, (t: TFunction) => t('Clonage humain'))
DevelopmentCardsTitles.set(MegaBomb, (t: TFunction) => t('Méga-bombe'))
DevelopmentCardsTitles.set(Neuroscience, (t: TFunction) => t('Neuroscience'))
DevelopmentCardsTitles.set(QuantumGenerator, (t: TFunction) => t('Générateur quantique'))
DevelopmentCardsTitles.set(RobotAssistants, (t: TFunction) => t('Robots de compagnie'))
DevelopmentCardsTitles.set(RoboticAnimals, (t: TFunction) => t('Animorphes'))
DevelopmentCardsTitles.set(Satellites, (t: TFunction) => t('Satellites'))
DevelopmentCardsTitles.set(SecurityAutomatons, (t: TFunction) => t('Automates de contrôle'))
DevelopmentCardsTitles.set(SuperSoldiers, (t: TFunction) => t('Super-soldats'))
DevelopmentCardsTitles.set(SuperSonar, (t: TFunction) => t('Super-sonar'))
DevelopmentCardsTitles.set(Supercomputer, (t: TFunction) => t('Super calculateur'))
DevelopmentCardsTitles.set(Teleportation, (t: TFunction) => t('Téléportation'))
DevelopmentCardsTitles.set(TimeTravel, (t: TFunction) => t('Voyage temporel'))
DevelopmentCardsTitles.set(Transmutation, (t: TFunction) => t('Transmutation'))
DevelopmentCardsTitles.set(UniversalVaccine, (t: TFunction) => t('Vaccin universel'))
DevelopmentCardsTitles.set(UnknownTechnology, (t: TFunction) => t('Technologie inconnue'))
DevelopmentCardsTitles.set(VirtualReality, (t: TFunction) => t('Réalité virtuelle'))
DevelopmentCardsTitles.set(CasinoCity, (t: TFunction) => t('Ville-casino'))
DevelopmentCardsTitles.set(EspionageAgency, (t: TFunction) => t('Agence d’espionnage'))
DevelopmentCardsTitles.set(GiantDam, (t: TFunction) => t('Barrage géant'))
DevelopmentCardsTitles.set(GiantTower, (t: TFunction) => t('Tour géante'))
DevelopmentCardsTitles.set(HarborZone, (t: TFunction) => t('Zone portuaire'))
DevelopmentCardsTitles.set(LunarBase, (t: TFunction) => t('Base lunaire'))
DevelopmentCardsTitles.set(MagneticTrain, (t: TFunction) => t('Train magnétique'))
DevelopmentCardsTitles.set(Museum, (t: TFunction) => t('Musée'))
DevelopmentCardsTitles.set(NationalMonument, (t: TFunction) => t('Monument national'))
DevelopmentCardsTitles.set(PolarBase, (t: TFunction) => t('Base polaire'))
DevelopmentCardsTitles.set(PropagandaCenter, (t: TFunction) => t('Centre de propagande'))
DevelopmentCardsTitles.set(SecretLaboratory, (t: TFunction) => t('Laboratoire secret'))
DevelopmentCardsTitles.set(SecretSociety, (t: TFunction) => t('Société secrète'))
DevelopmentCardsTitles.set(SolarCannon, (t: TFunction) => t('Canon solaire'))
DevelopmentCardsTitles.set(SpaceElevator, (t: TFunction) => t('Ascenseur spatial'))
DevelopmentCardsTitles.set(UndergroundCity, (t: TFunction) => t('Ville souterraine'))
DevelopmentCardsTitles.set(UnderwaterCity, (t: TFunction) => t('Ville sous-marine'))
DevelopmentCardsTitles.set(UniversalExposition, (t: TFunction) => t('Exposition universelle'))
DevelopmentCardsTitles.set(University, (t: TFunction) => t('Université'))
DevelopmentCardsTitles.set(WorldCongress, (t: TFunction) => t('Congrès mondial'))
DevelopmentCardsTitles.set(AlexandersTomb, (t: TFunction) => t('Tombeau d’Alexandre'))
DevelopmentCardsTitles.set(AncientAstronauts, (t: TFunction) => t('Anciens astronautes'))
DevelopmentCardsTitles.set(ArkOfTheCovenant, (t: TFunction) => t('Arche d’alliance'))
DevelopmentCardsTitles.set(Atlantis, (t: TFunction) => t('Atlantide'))
DevelopmentCardsTitles.set(BermudaTriangle, (t: TFunction) => t('Triangle des Bermudes'))
DevelopmentCardsTitles.set(BlackBeardsTreasure, (t: TFunction) => t('Trésor de Barbe Noire'))
DevelopmentCardsTitles.set(CenterOfTheEarth, (t: TFunction) => t('Centre de la Terre'))
DevelopmentCardsTitles.set(CitiesOfGold, (t: TFunction) => t('Cités d’or'))
DevelopmentCardsTitles.set(CityOfAgartha, (t: TFunction) => t('Cité d’Agartha'))
DevelopmentCardsTitles.set(FountainOfYouth, (t: TFunction) => t('Fontaine de jouvence'))
DevelopmentCardsTitles.set(GardensOfTheHesperides, (t: TFunction) => t('Jardin des Hespérides'))
DevelopmentCardsTitles.set(IslandOfAvalon, (t: TFunction) => t('Île d’Avalon'))
DevelopmentCardsTitles.set(KingSolomonsMines, (t: TFunction) => t('Mines du roi Salomon'))
DevelopmentCardsTitles.set(LostContinentOfMu, (t: TFunction) => t('Continent perdu de Mu'))
DevelopmentCardsTitles.set(ParallelDimension, (t: TFunction) => t('Dimension parallèle'))
DevelopmentCardsTitles.set(Roswell, (t: TFunction) => t('Roswell'))
DevelopmentCardsTitles.set(TreasureOfTheTemplars, (t: TFunction) => t('Trésor des Templiers'))

export default DevelopmentCardsTitles