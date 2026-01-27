import { Development } from '@gamepark/its-a-wonderful-world/material/Development'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { ItsAWonderfulWorldSetup } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldSetup'
import { ItsAWonderfulWorldOptions } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'

// Cards dealt to NoramStates (player)
const noramCards = [
  Development.SecretSociety, Development.Zeppelin, Development.FinancialCenter,
  Development.HarborZone, Development.OffshoreOilRig, Development.MilitaryBase,
  Development.ArkOfTheCovenant
]
// Cards dealt to Republic of Europe
const europeCards = [
  Development.CenterOfTheEarth, Development.TransportationNetwork, Development.PropagandaCenter,
  Development.WorldCongress, Development.UniversalExposition, Development.RecyclingPlant,
  Development.AirborneLaboratory
]
// Cards dealt to Federation of Asia
const asiaCards = [
  Development.WindTurbines, Development.HumanCloning, Development.IndustrialComplex,
  Development.LunarBase, Development.ResearchCenter, Development.Juggernaut,
  Development.CityOfAgartha
]

type CardId = { front: Development }

export class TutorialSetup extends ItsAWonderfulWorldSetup {
  setupMaterial(options: ItsAWonderfulWorldOptions) {
    super.setupMaterial(options)
    this.setupTutorialDeck()
  }

  setupTutorialDeck() {
    // Rearrange the deck so the 21 tutorial cards are at the top (dealt first)
    // The deck deals 7 cards per player in game.players order: NoramStates, RepublicOfEurope, FederationOfAsia
    // Top of deck = highest x values. deal() takes from the top.
    const maxX = Math.max(
      ...this.material(MaterialType.DevelopmentCard).location(LocationType.Deck).getItems().map(item => item.location.x ?? 0)
    )

    const allTutorialCards = [...noramCards, ...europeCards, ...asiaCards]
    for (let i = 0; i < allTutorialCards.length; i++) {
      // Re-query deck each iteration to get fresh state after previous moves
      this.material(MaterialType.DevelopmentCard)
        .location(LocationType.Deck)
        .id<CardId>(id => id.front === allTutorialCards[i])
        .moveItem({ type: LocationType.Deck, x: maxX + allTutorialCards.length - i })
    }
  }
}
