import { CustomMove, isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character } from '../material/Character'
import { CustomMoveType } from '../material/CustomMoveType'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Data of the {@link CustomMoveType.ChooseScienceCharacter} move
 */
export type ScienceCharacterChoice = {
  player: Empire
  character: Character
}

/**
 * Filter the moves choosing the given character as the Science supremacy bonus
 */
export const isScienceCharacterChoice =
  (character: Character) =>
  (move: MaterialMove): move is CustomMove<CustomMoveType, ScienceCharacterChoice> =>
    isCustomMoveType(CustomMoveType.ChooseScienceCharacter)(move) && (move.data as ScienceCharacterChoice).character === character

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
   * The choice is a custom move, so that it cannot be mistaken for a character awarded by a construction bonus.
   */
  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    const moves = super.getActivePlayerLegalMoves(playerId)

    if (this.remind<boolean>(Memory.ScienceBonus, playerId)) {
      for (const character of [Character.Financier, Character.General]) {
        moves.push(this.customMove(CustomMoveType.ChooseScienceCharacter, { player: playerId, character } satisfies ScienceCharacterChoice))
      }
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

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.ChooseScienceCharacter)(move)) {
      const { player, character } = move.data as ScienceCharacterChoice
      this.forget(Memory.ScienceBonus, player)
      return [
        this.material(MaterialType.CharacterToken).createItem({
          id: character,
          location: {
            type: LocationType.PlayerCharacters,
            player,
            id: character
          }
        })
      ]
    }
    return super.onCustomMove(move)
  }

  /**
   * Games recorded before the choice became a custom move cleared the flag on the character creation:
   * make sure the flag never outlives the phase when they are replayed.
   */
  onRuleEnd() {
    this.forget(Memory.ScienceBonus)
    return []
  }
}
