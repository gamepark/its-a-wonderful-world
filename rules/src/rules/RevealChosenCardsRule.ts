import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { numberOfCardsToDraft } from '../ItsAWonderfulWorldConstants'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Automatic rule that reveals all chosen cards by rotating them.
 * Cards in DraftArea are face-down (rotation = undefined/false).
 * This rule rotates them to reveal the cards to all players.
 * Then transitions to PassCards, DiscardLeftoverCards, or Planning based on draft progress.
 */
export class RevealChosenCardsRule extends MaterialRulesPart<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Reveal all chosen cards by rotating them
    // This changes the hidingStrategy behavior (hideFrontIfNotRotated)
    moves.push(...this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).rotateItems(true))

    // Check if players have drafted the required number of cards (7)
    const firstPlayer = this.game.players[0]
    const cardsInDraftArea = this.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(firstPlayer).length

    if (cardsInDraftArea === numberOfCardsToDraft) {
      // Players have drafted 7 cards - this is the last draft pick
      // Discard leftover cards (if any), then move to Planning
      moves.push(this.startRule(RuleId.DiscardLeftoverCards))
    } else {
      // Still drafting - pass remaining cards to next player
      moves.push(this.startRule(RuleId.PassCards))
    }

    return moves
  }
}
