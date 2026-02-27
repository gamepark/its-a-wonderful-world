import {
  CompetitiveScore,
  hideFront,
  hideFrontToOthers,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules
} from '@gamepark/rules-api'
import { Empire } from './Empire'
import { Memory } from './ItsAWonderfulWorldMemory'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ChooseDevelopmentCardRule } from './rules/ChooseDevelopmentCardRule'
import { DealDevelopmentCardsRule } from './rules/DealDevelopmentCardsRule'
import { DiscardLeftoverCardsRule } from './rules/DiscardLeftoverCardsRule'
import { EnergyProductionRule } from './rules/EnergyProductionRule'
import { ExplorationProductionRule } from './rules/ExplorationProductionRule'
import { GoldProductionRule } from './rules/GoldProductionRule'
import { KrystalliumProductionRule } from './rules/KrystalliumProductionRule'
import { MaterialsProductionRule } from './rules/MaterialsProductionRule'
import { PassCardsRule } from './rules/PassCardsRule'
import { PlanningRule } from './rules/PlanningRule'
import { RevealChosenCardsRule } from './rules/RevealChosenCardsRule'
import { RuleId } from './rules/RuleId'
import { ScienceProductionRule } from './rules/ScienceProductionRule'
import { getScoreFromScoringDetails, getScoringDetails } from './Scoring'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class ItsAWonderfulWorldRules
  extends SecretMaterialRules<Empire, MaterialType, LocationType>
  implements CompetitiveScore<MaterialGame, MaterialMove, Empire>
{
  rules = {
    [RuleId.DealDevelopmentCards]: DealDevelopmentCardsRule,
    [RuleId.ChooseDevelopmentCard]: ChooseDevelopmentCardRule,
    [RuleId.RevealChosenCards]: RevealChosenCardsRule,
    [RuleId.PassCards]: PassCardsRule,
    [RuleId.DiscardLeftoverCards]: DiscardLeftoverCardsRule,
    [RuleId.Planning]: PlanningRule,
    // Production phases - one rule per resource
    [RuleId.MaterialsProduction]: MaterialsProductionRule,
    [RuleId.EnergyProduction]: EnergyProductionRule,
    [RuleId.ScienceProduction]: ScienceProductionRule,
    [RuleId.GoldProduction]: GoldProductionRule,
    [RuleId.ExplorationProduction]: ExplorationProductionRule,
    [RuleId.KrystalliumProduction]: KrystalliumProductionRule
  }

  /**
   * Location strategies define how items are positioned within each location.
   * The framework automatically maintains coordinate sequences (x, y, z) when items are added/moved/removed.
   */
  locationsStrategies = {
    [MaterialType.DevelopmentCard]: {
      [LocationType.Deck]: new PositiveSequenceStrategy(),
      [LocationType.AscensionDeck]: new PositiveSequenceStrategy(),
      [LocationType.Discard]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.DraftArea]: new PositiveSequenceStrategy(),
      [LocationType.ConstructionArea]: new PositiveSequenceStrategy(),
      [LocationType.ConstructedDevelopments]: new PositiveSequenceStrategy()
    },
    [MaterialType.ResourceCube]: {
      [LocationType.EmpireCardResources]: new PositiveSequenceStrategy()
    }
  }

  /**
   * Hiding strategies define which material information should be hidden from players.
   * The framework automatically generates player views based on these strategies.
   *
   * Cards have a composite ID: {front: Development, back: DeckType}
   * - front: The actual development card (1-135 or ascension cards)
   * - back: The deck type (Default or Ascension) - determines the back image
   */
  hidingStrategies = {
    [MaterialType.DevelopmentCard]: {
      // Cards in deck are face-down - hide front, show only back
      [LocationType.Deck]: hideFront,
      [LocationType.AscensionDeck]: hideFront,
      // Cards in player's hand - hide front from other players
      [LocationType.PlayerHand]: hideFrontToOthers,
      // Cards in draft area - visible to owner, hidden to others until rotated (revealed)
      [LocationType.DraftArea]: hideFrontInDraftArea
      // Cards in construction area and constructed developments are face-up - visible to all
    }
  }

  giveTime(player: Empire): number {
    const ruleId = this.game.rule?.id
    switch (ruleId) {
      case RuleId.ChooseDevelopmentCard: {
        const numberOfCardsToDraft = 7
        const draftAreaLength = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(player).length
        return (numberOfCardsToDraft - draftAreaLength - 1) * 10
      }
      case RuleId.Planning:
        return 20 + this.remind(Memory.Round) * 40
      default:
        return 10
    }
  }

  /**
   * Get the score of a player at the end of the game
   */
  getScore(playerId: Empire): number {
    const scoringDetails = getScoringDetails(this.game, playerId)
    return getScoreFromScoringDetails(scoringDetails)
  }

  /**
   * Tie-breaker 1: player with the most constructed cards wins
   * Tie-breaker 2: player with the most character tokens wins
   */
  getTieBreaker(tieBreaker: number, playerId: Empire): number | undefined {
    if (tieBreaker === 1) {
      return this.material(MaterialType.DevelopmentCard).location(LocationType.ConstructedDevelopments).player(playerId).length
    }
    if (tieBreaker === 2) {
      return this.material(MaterialType.CharacterToken).player(playerId).getQuantity()
    }
    return undefined
  }
}

/**
 * Hiding strategy for cards in the draft area.
 * Before reveal (not rotated): visible to the card's owner, hidden to everyone else.
 * After reveal (rotated): visible to all players.
 */
export const hideFrontInDraftArea = (item: MaterialItem, player?: number): string[] => {
  if (item.location.rotation) return [] // Revealed: visible to all
  return item.location.player === player ? [] : ['id.front'] // Not revealed: visible only to owner
}
