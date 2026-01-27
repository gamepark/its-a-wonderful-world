import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Automatic rule that discards all leftover cards from player hands at the end of the draft.
 * This happens when players have drafted 7 cards but were dealt more (with Corruption & Ascension expansion).
 * Then moves to the Planning phase (simultaneous).
 */
export class DiscardLeftoverCardsRule extends MaterialRulesPart<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Discard all leftover cards from player hands to discard pile
    for (const player of this.game.players) {
      const hand = this.material(MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(player)
      if (hand.length > 0) {
        moves.push(hand.moveItemsAtOnce({ type: LocationType.Discard }))
      }
    }

    // Move to Planning phase (simultaneous)
    moves.push(this.startSimultaneousRule(RuleId.Planning))

    return moves
  }
}
