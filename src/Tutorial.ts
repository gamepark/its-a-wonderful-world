import Character from './material/characters/Character'
import {
  AirborneLaboratory, ArkOfTheCovenant, CenterOfTheEarth, CityOfAgartha, developmentCards, FinancialCenter, GeneticUpgrades, HumanCloning, IndustrialComplex,
  Juggernaut, LunarBase, MilitaryBase, NationalMonument, OffshoreOilRig, PropagandaCenter, RecyclingPlant, SecretSociety, TransportationNetwork,
  TreasureOfTheTemplars, WindTurbines, WorldCongress, Zeppelin
} from './material/developments/Developments'
import EmpireName from './material/empires/EmpireName'
import EmpireSide from './material/empires/EmpireSide'
import Resource from './material/resources/Resource'
import {chooseDevelopmentCard} from './moves/ChooseDevelopmentCard'
import {placeResource} from './moves/PlaceResource'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {recycle} from './moves/Recycle'
import {slateForConstruction} from './moves/SlateForConstruction'
import {tellYourAreReady} from './moves/TellYouAreReady'
import Phase from './types/Phase'
import Player from './types/Player'
import shuffle from './util/shuffle'

const nationalMonument = developmentCards.findIndex(development => development === NationalMonument)
const centerOfEarth = developmentCards.findIndex(development => development === CenterOfTheEarth)
const militaryBase = developmentCards.findIndex(development => development === MilitaryBase)
const humanCloning = developmentCards.findIndex(development => development === HumanCloning)
const propagandaCenter = developmentCards.findIndex(development => development === PropagandaCenter)
const cityOfAgartha = developmentCards.findIndex(development => development === CityOfAgartha)
const arkOfTheCovenant = developmentCards.findIndex(development => development === ArkOfTheCovenant)
const industrialComplex = developmentCards.findIndex(development => development === IndustrialComplex)
const recyclingPlant = developmentCards.findIndex(development => development === RecyclingPlant)
const lunarBase = developmentCards.findIndex(development => development === LunarBase)
const secretSociety = developmentCards.findIndex(development => development === SecretSociety)
const transportationNetwork = developmentCards.findIndex(development => development === TransportationNetwork)
const windTurbine = developmentCards.findIndex(development => development === WindTurbines)
const geneticUpgrades = developmentCards.findIndex(development => development === GeneticUpgrades)
const offshoreOilRig = developmentCards.findIndex(development => development === OffshoreOilRig)
const treasureOfTheTemplars = developmentCards.findIndex(development => development === TreasureOfTheTemplars)
const zeppelin = developmentCards.findIndex(development => development === Zeppelin)
const airborneLaboratory = developmentCards.findIndex(development => development === AirborneLaboratory)
const juggernaut = developmentCards.findIndex(development => development === Juggernaut)
const worldCongress = developmentCards.findIndex(development => development === WorldCongress)
const financialCenter = developmentCards.findIndex(development => development === FinancialCenter)


const initialCards = [
  // Tutorial Active Player cards
  nationalMonument, zeppelin, financialCenter, industrialComplex, offshoreOilRig, militaryBase, arkOfTheCovenant,
  // Tutorial Second Player cards
  centerOfEarth, transportationNetwork, secretSociety, treasureOfTheTemplars, lunarBase, recyclingPlant, airborneLaboratory,
  // Tutorial Third Player cards
  windTurbine, humanCloning, propagandaCenter, worldCongress, geneticUpgrades, juggernaut, cityOfAgartha
]

export const setupTutorial = (setupPlayers: (players?: (number | { empire?: EmpireName }[]), empireSide?: EmpireSide) => (Player[])) => ({
  players: setupPlayers([{empire: EmpireName.NoramStates}, {empire: EmpireName.RepublicOfEurope}, {empire: EmpireName.FederationOfAsia}]),
  deck: [...initialCards, ...shuffle(Array.from(developmentCards.keys()).filter(card => !initialCards.includes(card)))],
  discard: [],
  round: 1,
  phase: Phase.Draft,
  tutorial: true
})

export function resetTutorial() {
  localStorage.removeItem('its-a-wonderful-world')
  window.location.reload()
}

export const tutorialMoves = [
  // Automatic Tutorial Draft Phase
  chooseDevelopmentCard(EmpireName.NoramStates, nationalMonument),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, centerOfEarth),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, worldCongress),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, militaryBase),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, lunarBase),
  chooseDevelopmentCard(EmpireName.NoramStates, propagandaCenter),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, cityOfAgartha),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, arkOfTheCovenant),
  chooseDevelopmentCard(EmpireName.NoramStates, secretSociety),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, transportationNetwork),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, juggernaut),
  chooseDevelopmentCard(EmpireName.NoramStates, industrialComplex),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, financialCenter),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, recyclingPlant),
  chooseDevelopmentCard(EmpireName.NoramStates, windTurbine),
  chooseDevelopmentCard(EmpireName.RepublicOfEurope, humanCloning),
  chooseDevelopmentCard(EmpireName.FederationOfAsia, offshoreOilRig),
  chooseDevelopmentCard(EmpireName.NoramStates, treasureOfTheTemplars),

  // Second Player Planning Phase
  slateForConstruction(EmpireName.RepublicOfEurope, militaryBase),
  slateForConstruction(EmpireName.RepublicOfEurope, airborneLaboratory),
  slateForConstruction(EmpireName.RepublicOfEurope, cityOfAgartha),
  slateForConstruction(EmpireName.RepublicOfEurope, centerOfEarth),
  slateForConstruction(EmpireName.RepublicOfEurope, humanCloning),
  recycle(EmpireName.RepublicOfEurope, transportationNetwork),
  recycle(EmpireName.RepublicOfEurope, financialCenter),
  placeResource(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 0),
  placeResource(EmpireName.RepublicOfEurope, Resource.Gold, humanCloning, 2),
  tellYourAreReady(EmpireName.RepublicOfEurope),

  // Third Player Planning Phase
  slateForConstruction(EmpireName.FederationOfAsia, worldCongress),
  slateForConstruction(EmpireName.FederationOfAsia, lunarBase),
  slateForConstruction(EmpireName.FederationOfAsia, offshoreOilRig),
  recycle(EmpireName.FederationOfAsia, arkOfTheCovenant),
  recycle(EmpireName.FederationOfAsia, juggernaut),
  recycle(EmpireName.FederationOfAsia, recyclingPlant),
  recycle(EmpireName.FederationOfAsia, geneticUpgrades),
  placeResource(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 0),
  placeResource(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 1),
  placeResource(EmpireName.FederationOfAsia, Resource.Exploration, offshoreOilRig, 3),
  placeResource(EmpireName.FederationOfAsia, Resource.Science, lunarBase, 2),
  tellYourAreReady(EmpireName.FederationOfAsia),

  // Active Player Planning Phase
  slateForConstruction(EmpireName.NoramStates, nationalMonument),
  slateForConstruction(EmpireName.NoramStates, propagandaCenter),
  slateForConstruction(EmpireName.NoramStates, secretSociety),
  slateForConstruction(EmpireName.NoramStates, industrialComplex),
  recycle(EmpireName.NoramStates, windTurbine),
  placeResource(EmpireName.NoramStates, Resource.Energy, industrialComplex, 3),
  recycle(EmpireName.NoramStates, treasureOfTheTemplars),
  placeResource(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 0),
  recycle(EmpireName.NoramStates, zeppelin),
  tellYourAreReady(EmpireName.NoramStates),

  // Material production
  placeResource(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 1),
  placeResource(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 2),
  tellYourAreReady(EmpireName.RepublicOfEurope),
  placeResource(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 2),
  tellYourAreReady(EmpireName.FederationOfAsia),
  ...Array(3).fill([
    placeResource(EmpireName.NoramStates, Resource.Materials, industrialComplex, 0),
    placeResource(EmpireName.NoramStates, Resource.Materials, industrialComplex, 1),
    placeResource(EmpireName.NoramStates, Resource.Materials, industrialComplex, 2)
  ]),
  tellYourAreReady(EmpireName.NoramStates),

  // Energy production
  placeResource(EmpireName.RepublicOfEurope, Resource.Energy, militaryBase, 3),
  tellYourAreReady(EmpireName.RepublicOfEurope),
  placeResource(EmpireName.FederationOfAsia, Resource.Energy, lunarBase, 0),
  tellYourAreReady(EmpireName.FederationOfAsia),
  tellYourAreReady(EmpireName.NoramStates),

  // Science production
  placeResource(EmpireName.RepublicOfEurope, Resource.Science, humanCloning, 0),
  placeResource(EmpireName.RepublicOfEurope, Resource.Science, humanCloning, 1),
  receiveCharacter(EmpireName.RepublicOfEurope, Character.General),
  tellYourAreReady(EmpireName.RepublicOfEurope),
  tellYourAreReady(EmpireName.FederationOfAsia),
  tellYourAreReady(EmpireName.NoramStates),

  // Gold production
  tellYourAreReady(EmpireName.RepublicOfEurope),
  placeResource(EmpireName.FederationOfAsia, Resource.Gold, lunarBase, 4),
  placeResource(EmpireName.FederationOfAsia, Resource.Gold, lunarBase, 5),
  placeResource(EmpireName.FederationOfAsia, Resource.Gold, worldCongress, 0),
  tellYourAreReady(EmpireName.FederationOfAsia),
  ...Array(2).fill([
    placeResource(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 1),
    placeResource(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 2)
  ]),
  tellYourAreReady(EmpireName.NoramStates),

  // Exploration production
  tellYourAreReady(EmpireName.RepublicOfEurope),
  tellYourAreReady(EmpireName.FederationOfAsia),
  tellYourAreReady(EmpireName.NoramStates)
]