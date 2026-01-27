import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { ascensionDeckLocator } from './AscensionDeckLocator'
import { availableResourcesLocator } from './AvailableResourcesLocator'
import { characterStockLocator } from './CharacterStockLocator'
import { constructedDevelopmentsLocator } from './ConstructedDevelopmentsLocator'
import { constructionAreaLocator } from './ConstructionAreaLocator'
import { constructionCardCostLocator } from './ConstructionCardCostLocator'
import { deckLocator } from './DeckLocator'
import { discardLocator } from './DiscardLocator'
import { draftAreaLocator } from './DraftAreaLocator'
import { empireCardResourcesLocator } from './EmpireCardResourcesLocator'
import { playerCharactersLocator } from './PlayerCharactersLocator'
import { empireCardSpaceLocator } from './EmpireCardSpaceLocator'
import { krystalliumStockLocator } from './KrystalliumStockLocator'
import { developmentCardCostSpaceLocator } from './DevelopmentCardCostSpaceLocator'
import { developmentCardRecyclingBonusLocator } from './DevelopmentCardRecyclingBonusLocator'
import { developmentCardProductionLocator } from './DevelopmentCardProductionLocator'
import { developmentCardVictoryPointsLocator } from './DevelopmentCardVictoryPointsLocator'
import { playerHandLocator } from './PlayerHandLocator'

export const Locators: Partial<Record<LocationType, Locator<Empire, MaterialType, LocationType>>> = {
  [LocationType.Deck]: deckLocator,
  [LocationType.AscensionDeck]: ascensionDeckLocator,
  [LocationType.Discard]: discardLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.DraftArea]: draftAreaLocator,
  [LocationType.ConstructionArea]: constructionAreaLocator,
  [LocationType.ConstructionCardCost]: constructionCardCostLocator,
  [LocationType.ConstructedDevelopments]: constructedDevelopmentsLocator,
  [LocationType.AvailableResources]: availableResourcesLocator,
  [LocationType.EmpireCardResources]: empireCardResourcesLocator,
  [LocationType.EmpireCardSpace]: empireCardSpaceLocator,
  [LocationType.KrystalliumStock]: krystalliumStockLocator,
  [LocationType.CharacterStock]: characterStockLocator,
  [LocationType.PlayerCharacters]: playerCharactersLocator,
  [LocationType.DevelopmentCardProduction]: developmentCardProductionLocator,
  [LocationType.DevelopmentCardCostSpace]: developmentCardCostSpaceLocator,
  [LocationType.DevelopmentCardRecyclingBonus]: developmentCardRecyclingBonusLocator,
  [LocationType.DevelopmentCardVictoryPoints]: developmentCardVictoryPointsLocator
}
