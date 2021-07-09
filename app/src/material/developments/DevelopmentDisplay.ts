import Development from '@gamepark/its-a-wonderful-world/material/Development'
import {TFunction} from 'i18next'
import Images from '../Images'

type DevelopmentDisplay = {
  title: (t: TFunction) => string
  image: string
}

export function getDevelopmentDisplay(development: Development): DevelopmentDisplay {
  switch (development) {
    case Development.FinancialCenter:
      return {
        title: t => t('Financial Center'),
        image: Images.financialCenter
      }
    case Development.IndustrialComplex:
      return {
        title: t => t('Industrial Complex'),
        image: Images.industrialComplex
      }
    case Development.MilitaryBase:
      return {
        title: t => t('Military Base'),
        image: Images.militaryBase
      }
    case Development.NuclearPlant:
      return {
        title: t => t('Nuclear Plant'),
        image: Images.nuclearPlant
      }
    case Development.OffshoreOilRig:
      return {
        title: t => t('Offshore Oil Rig'),
        image: Images.offshoreOilRig
      }
    case Development.RecyclingPlant:
      return {
        title: t => t('Recycling Plant'),
        image: Images.recyclingPlant
      }
    case Development.ResearchCenter:
      return {
        title: t => t('Research Center'),
        image: Images.researchCenter
      }
    case Development.TransportationNetwork:
      return {
        title: t => t('Transportation Network'),
        image: Images.transportationNetwork
      }
    case Development.WindTurbines:
      return {
        title: t => t('Wind Turbines'),
        image: Images.windTurbines
      }
    case Development.AirborneLaboratory:
      return {
        title: t => t('Airborne Laboratory'),
        image: Images.airborneLaboratory
      }
    case Development.AircraftCarrier:
      return {
        title: t => t('Aircraft Carrier'),
        image: Images.aircraftCarrier
      }
    case Development.Icebreaker:
      return {
        title: t => t('Icebreaker'),
        image: Images.icebreaker
      }
    case Development.Juggernaut:
      return {
        title: t => t('Juggernaut'),
        image: Images.juggernaut
      }
    case Development.MegaDrill:
      return {
        title: t => t('Mega-Drill'),
        image: Images.megaDrill
      }
    case Development.SaucerSquadron:
      return {
        title: t => t('Saucer Squadron'),
        image: Images.saucerSquadron
      }
    case Development.Submarine:
      return {
        title: t => t('Submarine'),
        image: Images.submarine
      }
    case Development.TankDivision:
      return {
        title: t => t('Tank Division'),
        image: Images.tankDivision
      }
    case Development.Zeppelin:
      return {
        title: t => t('Zeppelin'),
        image: Images.zeppelin
      }
    case Development.Aquaculture:
      return {
        title: t => t('Aquaculture'),
        image: Images.aquaculture
      }
    case Development.BionicGrafts:
      return {
        title: t => t('Bionic Grafts'),
        image: Images.bionicCrafts
      }
    case Development.ClimateControl:
      return {
        title: t => t('Climate Control'),
        image: Images.climateControl
      }
    case Development.Cryopreservation:
      return {
        title: t => t('Cryopreservation'),
        image: Images.cryopreservation
      }
    case Development.GeneticUpgrades:
      return {
        title: t => t('Genetic Upgrades'),
        image: Images.geneticUpgrades
      }
    case Development.GravityInverter:
      return {
        title: t => t('Gravity Inverter'),
        image: Images.gravityInverter
      }
    case Development.HumanCloning:
      return {
        title: t => t('Gravity Inverter'),
        image: Images.humanCloning
      }
    case Development.MegaBomb:
      return {
        title: t => t('Mega-Bomb'),
        image: Images.megaBomb
      }
    case Development.Neuroscience:
      return {
        title: t => t('Neuroscience'),
        image: Images.neuroscience
      }
    case Development.QuantumGenerator:
      return {
        title: t => t('Quantum Generator'),
        image: Images.quantumGenerator
      }
    case Development.RobotAssistants:
      return {
        title: t => t('Robot Assistants'),
        image: Images.robotAssistants
      }
    case Development.RoboticAnimals:
      return {
        title: t => t('Robotic Animals'),
        image: Images.roboticAnimals
      }
    case Development.Satellites:
      return {
        title: t => t('Satellites'),
        image: Images.satellites
      }
    case Development.SecurityAutomatons:
      return {
        title: t => t('Security Automatons'),
        image: Images.securityAutomatons
      }
    case Development.SuperSoldiers:
      return {
        title: t => t('Super-Soldiers'),
        image: Images.superSoldiers
      }
    case Development.SuperSonar:
      return {
        title: t => t('Super-Sonar'),
        image: Images.superSonar
      }
    case Development.Supercomputer:
      return {
        title: t => t('Supercomputer'),
        image: Images.supercomputer
      }
    case Development.Teleportation:
      return {
        title: t => t('Teleportation'),
        image: Images.teleportation
      }
    case Development.TimeTravel:
      return {
        title: t => t('Time Travel'),
        image: Images.timeTravel
      }
    case Development.Transmutation:
      return {
        title: t => t('Transmutation'),
        image: Images.transmutation
      }
    case Development.UniversalVaccine:
      return {
        title: t => t('Universal Vaccine'),
        image: Images.universalVaccine
      }
    case Development.UnknownTechnology:
      return {
        title: t => t('Unknown Technology'),
        image: Images.unknownTechnology
      }
    case Development.VirtualReality:
      return {
        title: t => t('Virtual Reality'),
        image: Images.virtualReality
      }
    case Development.CasinoCity:
      return {
        title: t => t('Casino City'),
        image: Images.casinoCity
      }
    case Development.EspionageAgency:
      return {
        title: t => t('Espionage Agency'),
        image: Images.espionageAgency
      }
    case Development.GiantDam:
      return {
        title: t => t('Giant Dam'),
        image: Images.giantDam
      }
    case Development.GiantTower:
      return {
        title: t => t('Giant Tower'),
        image: Images.giantTower
      }
    case Development.HarborZone:
      return {
        title: t => t('Harbor Zone'),
        image: Images.harborZone
      }
    case Development.LunarBase:
      return {
        title: t => t('Lunar Base'),
        image: Images.lunarBase
      }
    case Development.MagneticTrain:
      return {
        title: t => t('Magnetic Train'),
        image: Images.magneticTrain
      }
    case Development.Museum:
      return {
        title: t => t('Museum'),
        image: Images.museum
      }
    case Development.NationalMonument:
      return {
        title: t => t('National Monument'),
        image: Images.nationalMonument
      }
    case Development.PolarBase:
      return {
        title: t => t('Polar Base'),
        image: Images.polarBase
      }
    case Development.PropagandaCenter:
      return {
        title: t => t('Propaganda Center'),
        image: Images.propagandaCenter
      }
    case Development.SecretLaboratory:
      return {
        title: t => t('Secret Laboratory'),
        image: Images.secretLaboratory
      }
    case Development.SecretSociety:
      return {
        title: t => t('Secret Society'),
        image: Images.secretSociety
      }
    case Development.SolarCannon:
      return {
        title: t => t('Solar Cannon'),
        image: Images.solarCannon
      }
    case Development.SpaceElevator:
      return {
        title: t => t('Space Elevator'),
        image: Images.spaceElevator
      }
    case Development.UndergroundCity:
      return {
        title: t => t('Underground City'),
        image: Images.undergroundCity
      }
    case Development.UnderwaterCity:
      return {
        title: t => t('Underwater City'),
        image: Images.underwaterCity
      }
    case Development.UniversalExposition:
      return {
        title: t => t('Universal Exposition'),
        image: Images.universalExposition
      }
    case Development.University:
      return {
        title: t => t('University'),
        image: Images.university
      }
    case Development.WorldCongress:
      return {
        title: t => t('World Congress'),
        image: Images.worldCongress
      }
    case Development.AlexandersTomb:
      return {
        title: t => t('Alexander’s Tomb'),
        image: Images.alexandersTomb
      }
    case Development.AncientAstronauts:
      return {
        title: t => t('Ancient Astronauts'),
        image: Images.ancientAstronauts
      }
    case Development.ArkOfTheCovenant:
      return {
        title: t => t('Ark Of The Covenant'),
        image: Images.arkOfTheCovenant
      }
    case Development.Atlantis:
      return {
        title: t => t('Atlantis'),
        image: Images.atlantis
      }
    case Development.BermudaTriangle:
      return {
        title: t => t('Bermuda Triangle'),
        image: Images.bermudaTriangle
      }
    case Development.BlackBeardsTreasure:
      return {
        title: t => t('Blackbeard’s Treasure'),
        image: Images.blackBeardsTreasure
      }
    case Development.CenterOfTheEarth:
      return {
        title: t => t('Center Of The Earth'),
        image: Images.centerOfTheEarth
      }
    case Development.CitiesOfGold:
      return {
        title: t => t('Cities Of Gold'),
        image: Images.citiesOfGold
      }
    case Development.CityOfAgartha:
      return {
        title: t => t('City Of Agartha'),
        image: Images.cityOfAgartha
      }
    case Development.FountainOfYouth:
      return {
        title: t => t('Fountain Of Youth'),
        image: Images.fountainOfYouth
      }
    case Development.GardensOfTheHesperides:
      return {
        title: t => t('Gardens Of The Hesperides'),
        image: Images.gardensOfTheHesperides
      }
    case Development.IslandOfAvalon:
      return {
        title: t => t('Island Of Avalon'),
        image: Images.islandOfAvalon
      }
    case Development.KingSolomonsMines:
      return {
        title: t => t('King Solomon’s Mines'),
        image: Images.kingSolomonsMines
      }
    case Development.LostContinentOfMu:
      return {
        title: t => t('Lost Continent Of Mu'),
        image: Images.lostContinentOfMu
      }
    case Development.ParallelDimension:
      return {
        title: t => t('Parallel Dimension'),
        image: Images.parallelDimension
      }
    case Development.Roswell:
      return {
        title: t => t('Roswell'),
        image: Images.roswell
      }
    case Development.TreasureOfTheTemplars:
      return {
        title: t => t('Treasure Of The Templars'),
        image: Images.treasureOfTheTemplars
      }
    case Development.BorderPatrol:
      return {
        title: t => t('Border Patrol'),
        image: Images.borderPatrol
      }
    case Development.KrystalliumPowerPlant:
      return {
        title: t => t('Krystallium Power Plant'),
        image: Images.krystalliumPowerPlant
      }
    case Development.RobotFactory:
      return {
        title: t => t('Robot Factory'),
        image: Images.robotFactory
      }
    case Development.GoldMine:
      return {
        title: t => t('Gold Mine'),
        image: Images.goldMine
      }
    case Development.SecretBase:
      return {
        title: t => t('Secret Base'),
        image: Images.secretBase
      }
    case Development.LawlessZone:
      return {
        title: t => t('Lawless Zone'),
        image: Images.lawlessZone
      }
    case Development.OccultDistrict:
      return {
        title: t => t('Occult District'),
        image: Images.occultDistrict
      }
    case Development.OffshoreLaboratory:
      return {
        title: t => t('Offshore Laboratory'),
        image: Images.offshoreLaboratory
      }
    case Development.FloatingPalace:
      return {
        title: t => t('Floating Palace'),
        image: Images.floatingPalace
      }
    case Development.GiantRobot:
      return {
        title: t => t('Giant Robot'),
        image: Images.giantRobot
      }
    case Development.ArmoredConvoy:
      return {
        title: t => t('Armored Convoy'),
        image: Images.armoredConvoy
      }
    case Development.MobileBase:
      return {
        title: t => t('Mobile Base'),
        image: Images.mobileBase
      }
    case Development.Inquisitors:
      return {
        title: t => t('Inquisitors'),
        image: Images.inquisitors
      }
    case Development.Raiders:
      return {
        title: t => t('Raiders'),
        image: Images.raiders
      }
    case Development.PlanetaryArchives:
      return {
        title: t => t('Planetary Archives'),
        image: Images.planetaryArchives
      }
    case Development.Telekinesis:
      return {
        title: t => t('Telekinesis'),
        image: Images.telekinesis
      }
    case Development.ArtificialIntelligence:
      return {
        title: t => t('Artificial Intelligence'),
        image: Images.artificialIntelligence
      }
    case Development.DarkMatter:
      return {
        title: t => t('Dark Matter'),
        image: Images.darkMatter
      }
    case Development.ArtificialSun:
      return {
        title: t => t('Artificial Sun'),
        image: Images.artificialSun
      }
    case Development.Immortality:
      return {
        title: t => t('Immortality'),
        image: Images.immortality
      }
    case Development.Utopia:
      return {
        title: t => t('Utopia'),
        image: Images.utopia
      }
    case Development.TaxHaven:
      return {
        title: t => t('Tax Haven'),
        image: Images.taxHaven
      }
    case Development.CelestialCathedral:
      return {
        title: t => t('Celestial Cathedral'),
        image: Images.celestialCathedral
      }
    case Development.IntercontinentalNetwork:
      return {
        title: t => t('Intercontinental Network'),
        image: Images.intercontinentalNetwork
      }
    case Development.HighSecurityPrison:
      return {
        title: t => t('High-Security Prison'),
        image: Images.highSecurityPrison
      }
    case Development.OrbitalStation:
      return {
        title: t => t('Orbital Station'),
        image: Images.orbitalStation
      }
    case Development.WorldBank:
      return {
        title: t => t('World Bank'),
        image: Images.worldBank
      }
    case Development.LuxuryClinic:
      return {
        title: t => t('Luxury Clinic'),
        image: Images.luxuryClinic
      }
    case Development.TheWall:
      return {
        title: t => t('The Wall'),
        image: Images.theWall
      }
    case Development.Consortium:
      return {
        title: t => t('Consortium'),
        image: Images.consortium
      }
    case Development.MiningAsteroid:
      return {
        title: t => t('Mining Asteroid'),
        image: Images.miningAsteroid
      }
    case Development.Hyperborea:
      return {
        title: t => t('Hyperborea'),
        image: Images.hyperborea
      }
    case Development.Valhalla:
      return {
        title: t => t('Valhalla'),
        image: Images.valhalla
      }
    case Development.MysteriousVessel:
      return {
        title: t => t('Mysterious Vessel'),
        image: Images.mysteriousVessel
      }
    case Development.Pandemonium:
      return {
        title: t => t('Pandemonium'),
        image: Images.pandemonium
      }
    case Development.PandoraBox:
      return {
        title: t => t('Pandora’s Box'),
        image: Images.pandoraBox
      }
    case Development.AlphaCentauri:
      return {
        title: t => t('Alpha Centauri'),
        image: Images.alphaCentauri
      }
    case Development.Shambhala:
      return {
        title: t => t('Shambhala'),
        image: Images.shambhala
      }
  }
}