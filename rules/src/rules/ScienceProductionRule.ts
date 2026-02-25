import { isCreateItem, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character } from '../material/Character'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Science production phase (3rd of 5)
 * Supremacy bonus: Player chooses (Financier or General)
 */
export class ScienceProductionRule extends ProductionRule {
  resource = Resource.Science
  nextRule = RuleId.GoldProduction

  /**
   * Override to mark player as needing to choose a character instead of auto-awarding.
   */
  protected awardSupremacyBonus(empire: Empire, _moves: MaterialMove[]): void {
    this.memorize(Memory.ScienceBonus, true, empire)
  }

  /**
   * Override to add character choice moves for players who need to choose.
   */
  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    const moves = super.getActivePlayerLegalMoves(playerId)

    // If player needs to choose a character, add the two choice moves
    const needsToChoose = this.remind<boolean>(Memory.ScienceBonus, playerId)
    if (needsToChoose) {
      moves.push(
        this.material(MaterialType.CharacterToken).createItem({
          id: Character.Financier,
          location: {
            type: LocationType.PlayerCharacters,
            player: playerId,
            id: Character.Financier
          }
        }),
        this.material(MaterialType.CharacterToken).createItem({
          id: Character.General,
          location: {
            type: LocationType.PlayerCharacters,
            player: playerId,
            id: Character.General
          }
        })
      )
    }

    return moves
  }

  /**
   * Override to prevent ending turn if player still needs to choose a character.
   */
  canEndTurn(playerId: Empire): boolean {
    const needsToChoose = this.remind<boolean>(Memory.ScienceBonus, playerId)
    if (needsToChoose) return false
    return super.canEndTurn(playerId)
  }

  /**
   * After a character token is created in player's PlayerCharacters, clear the science bonus flag.
   * Must distinguish construction bonus tokens (consequences) from the actual supremacy choice.
   */
  afterItemMove(move: ItemMove): MaterialMove[] {
    const consequences = super.afterItemMove(move)

    // Track construction bonus character tokens in consequences so we can skip them later
    for (const consequence of consequences) {
      if (isCreateItem(consequence) && consequence.itemType === MaterialType.CharacterToken) {
        const player = consequence.item?.location?.player as Empire | undefined
        if (player !== undefined) {
          const count = this.remind<number>(Memory.PendingConstructionBonusTokens, player) ?? 0
          this.memorize(Memory.PendingConstructionBonusTokens, count + 1, player)
        }
      }
    }

    // Check if a character was created in player's PlayerCharacters
    if (isCreateItem(move) && move.itemType === MaterialType.CharacterToken) {
      const player = move.item?.location?.player as Empire | undefined
      if (player !== undefined && move.item?.location?.type === LocationType.PlayerCharacters) {
        const pending = this.remind<number>(Memory.PendingConstructionBonusTokens, player) ?? 0
        if (pending > 0) {
          // This is a construction bonus, not the supremacy choice
          this.memorize(Memory.PendingConstructionBonusTokens, pending - 1, player)
        } else {
          // This is the actual supremacy choice
          this.forget(Memory.ScienceBonus, player)
        }
      }
    }

    return consequences
  }
}
