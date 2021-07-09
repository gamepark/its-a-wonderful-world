import GameState from '@gamepark/its-a-wonderful-world/GameState'
import {setupPlayers} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Development from '@gamepark/its-a-wonderful-world/material/Development'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import EmpireSide from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import {chooseDevelopmentCardMove} from '@gamepark/its-a-wonderful-world/moves/ChooseDevelopmentCard'
import Move from '@gamepark/its-a-wonderful-world/moves/Move'
import {placeResourceOnConstructionMove} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import {receiveCharacterMove} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import {recycleMove} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import {slateForConstructionMove} from '@gamepark/its-a-wonderful-world/moves/SlateForConstruction'
import {tellYouAreReadyMove} from '@gamepark/its-a-wonderful-world/moves/TellYouAreReady'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {TutorialDescription} from '@gamepark/react-client'
import shuffle from 'lodash.shuffle'

const harborZone = developmentCards.findIndex(development => development === Development.HarborZone)
const centerOfEarth = developmentCards.findIndex(development => development === Development.CenterOfTheEarth)
const militaryBase = developmentCards.findIndex(development => development === Development.MilitaryBase)
const humanCloning = developmentCards.findIndex(development => development === Development.HumanCloning)
const propagandaCenter = developmentCards.findIndex(development => development === Development.PropagandaCenter)
const cityOfAgartha = developmentCards.findIndex(development => development === Development.CityOfAgartha)
const arkOfTheCovenant = developmentCards.findIndex(development => development === Development.ArkOfTheCovenant)
const industrialComplex = developmentCards.findIndex(development => development === Development.IndustrialComplex)
const recyclingPlant = developmentCards.findIndex(development => development === Development.RecyclingPlant)
const lunarBase = developmentCards.findIndex(development => development === Development.LunarBase)
const secretSociety = developmentCards.findIndex(development => development === Development.SecretSociety)
const transportationNetwork = developmentCards.findIndex(development => development === Development.TransportationNetwork)
const windTurbine = developmentCards.findIndex(development => development === Development.WindTurbines)
const researchCenter = developmentCards.findIndex(development => development === Development.ResearchCenter)
const offshoreOilRig = developmentCards.findIndex(development => development === Development.OffshoreOilRig)
const universalExposition = developmentCards.findIndex(development => development === Development.UniversalExposition)
const zeppelin = developmentCards.findIndex(development => development === Development.Zeppelin)
const airborneLaboratory = developmentCards.findIndex(development => development === Development.AirborneLaboratory)
const juggernaut = developmentCards.findIndex(development => development === Development.Juggernaut)
const worldCongress = developmentCards.findIndex(development => development === Development.WorldCongress)
const financialCenter = developmentCards.findIndex(development => development === Development.FinancialCenter)


const initialCards = [
  // Tutorial Active Player cards
  secretSociety, zeppelin, financialCenter, harborZone, offshoreOilRig, militaryBase, arkOfTheCovenant,
  // Tutorial Second Player cards
  centerOfEarth, transportationNetwork, propagandaCenter, worldCongress, universalExposition, recyclingPlant, airborneLaboratory,
  // Tutorial Third Player cards
  windTurbine, humanCloning, industrialComplex, lunarBase, researchCenter, juggernaut, cityOfAgartha
]

const ItsAWonderfulTutorial: TutorialDescription<GameState, Move, EmpireName> = {
  setupTutorial: () => [{
    players: setupPlayers({
      players: [{id: EmpireName.NoramStates}, {id: EmpireName.RepublicOfEurope}, {id: EmpireName.FederationOfAsia}], empiresSide: EmpireSide.A,
      corruptionAndAscension: false
    }),
    deck: [...initialCards, ...shuffle(Array.from(developmentCards.keys()).filter(card => !initialCards.includes(card)))],
    discard: [],
    round: 1,
    phase: Phase.Draft
  }, [EmpireName.NoramStates, EmpireName.RepublicOfEurope, EmpireName.FederationOfAsia]],
  expectedMoves: () => [
    // Automatic Tutorial Draft Phase
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, centerOfEarth),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, lunarBase),
    chooseDevelopmentCardMove(EmpireName.NoramStates, secretSociety),
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, militaryBase),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, worldCongress),
    chooseDevelopmentCardMove(EmpireName.NoramStates, industrialComplex),
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, cityOfAgartha),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, arkOfTheCovenant),
    chooseDevelopmentCardMove(EmpireName.NoramStates, propagandaCenter),
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, transportationNetwork),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, juggernaut),
    chooseDevelopmentCardMove(EmpireName.NoramStates, harborZone),
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, financialCenter),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, recyclingPlant),
    chooseDevelopmentCardMove(EmpireName.NoramStates, windTurbine),
    chooseDevelopmentCardMove(EmpireName.RepublicOfEurope, humanCloning),
    chooseDevelopmentCardMove(EmpireName.FederationOfAsia, offshoreOilRig),
    chooseDevelopmentCardMove(EmpireName.NoramStates, universalExposition),

    // Second Player Planning Phase
    slateForConstructionMove(EmpireName.RepublicOfEurope, militaryBase),
    slateForConstructionMove(EmpireName.RepublicOfEurope, airborneLaboratory),
    slateForConstructionMove(EmpireName.RepublicOfEurope, cityOfAgartha),
    slateForConstructionMove(EmpireName.RepublicOfEurope, centerOfEarth),
    slateForConstructionMove(EmpireName.RepublicOfEurope, humanCloning),
    recycleMove(EmpireName.RepublicOfEurope, transportationNetwork),
    recycleMove(EmpireName.RepublicOfEurope, financialCenter),
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 0),
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Gold, humanCloning, 2),
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),

    // Third Player Planning Phase
    slateForConstructionMove(EmpireName.FederationOfAsia, worldCongress),
    slateForConstructionMove(EmpireName.FederationOfAsia, lunarBase),
    slateForConstructionMove(EmpireName.FederationOfAsia, offshoreOilRig),
    recycleMove(EmpireName.FederationOfAsia, arkOfTheCovenant),
    recycleMove(EmpireName.FederationOfAsia, juggernaut),
    recycleMove(EmpireName.FederationOfAsia, recyclingPlant),
    recycleMove(EmpireName.FederationOfAsia, researchCenter),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 0),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 1),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Exploration, offshoreOilRig, 3),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Science, lunarBase, 2),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),

    // Active Player Planning Phase
    slateForConstructionMove(EmpireName.NoramStates, industrialComplex),
    slateForConstructionMove(EmpireName.NoramStates, propagandaCenter),
    slateForConstructionMove(EmpireName.NoramStates, harborZone),
    slateForConstructionMove(EmpireName.NoramStates, secretSociety),
    recycleMove(EmpireName.NoramStates, universalExposition),
    placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 0),
    recycleMove(EmpireName.NoramStates, windTurbine),
    placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Energy, industrialComplex, 3),
    recycleMove(EmpireName.NoramStates, zeppelin),
    tellYouAreReadyMove(EmpireName.NoramStates),

    // Material production
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 1),
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Materials, militaryBase, 2),
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Materials, offshoreOilRig, 2),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),
    ...Array(3).fill([
      placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Materials, industrialComplex, 0),
      placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Materials, industrialComplex, 1),
      placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Materials, industrialComplex, 2)
    ]),
    tellYouAreReadyMove(EmpireName.NoramStates),

    // Energy production
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Energy, militaryBase, 3),
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Energy, lunarBase, 0),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),
    tellYouAreReadyMove(EmpireName.NoramStates),

    // Science production
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Science, humanCloning, 0),
    placeResourceOnConstructionMove(EmpireName.RepublicOfEurope, Resource.Science, humanCloning, 1),
    receiveCharacterMove(EmpireName.RepublicOfEurope, Character.General),
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),
    tellYouAreReadyMove(EmpireName.NoramStates),

    // Gold production
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Gold, lunarBase, 4),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Gold, lunarBase, 5),
    placeResourceOnConstructionMove(EmpireName.FederationOfAsia, Resource.Gold, worldCongress, 0),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),
    ...Array(2).fill([
      placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 1),
      placeResourceOnConstructionMove(EmpireName.NoramStates, Resource.Gold, propagandaCenter, 2)
    ]),
    tellYouAreReadyMove(EmpireName.NoramStates),

    // Exploration production
    tellYouAreReadyMove(EmpireName.RepublicOfEurope),
    tellYouAreReadyMove(EmpireName.FederationOfAsia),
    tellYouAreReadyMove(EmpireName.NoramStates)
  ]
}

export default ItsAWonderfulTutorial