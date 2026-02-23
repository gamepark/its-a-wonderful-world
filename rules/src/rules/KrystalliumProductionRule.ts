import { MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { numberOfRounds } from '../ItsAWonderfulWorldConstants'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character } from '../material/Character'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { getKrystalliumAndCharacterProduction } from '../Production'
import { ConstructionRule } from './ConstructionRule'
import { RuleId } from './RuleId'

/**
 * Krystallium production phase (after Exploration).
 * Only activated for players who have constructed cards with krystalliumProduction.
 * Creates Krystallium cubes (directly to stock) and character tokens, then allows construction.
 */
export class KrystalliumProductionRule extends ConstructionRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    for (const empire of this.game.rule!.players!) {
      const production = getKrystalliumAndCharacterProduction(this.game, empire)

      const krystalliumCount = production[Resource.Krystallium] ?? 0
      if (krystalliumCount > 0) {
        moves.push(
          this.material(MaterialType.ResourceCube).createItem({
            id: Resource.Krystallium,
            location: {
              type: LocationType.KrystalliumStock,
              player: empire
            },
            quantity: krystalliumCount
          })
        )
      }

      const financierCount = production[Character.Financier] ?? 0
      for (let i = 0; i < financierCount; i++) {
        moves.push(
          this.material(MaterialType.CharacterToken).createItem({
            id: Character.Financier,
            location: {
              type: LocationType.PlayerCharacters,
              player: empire,
              id: Character.Financier
            }
          })
        )
      }

      const generalCount = production[Character.General] ?? 0
      for (let i = 0; i < generalCount; i++) {
        moves.push(
          this.material(MaterialType.CharacterToken).createItem({
            id: Character.General,
            location: {
              type: LocationType.PlayerCharacters,
              player: empire,
              id: Character.General
            }
          })
        )
      }
    }

    return moves
  }

  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []

    moves.push(...this.getConstructionMoves(playerId))

    if (this.canEndTurn(playerId)) {
      moves.push(this.endPlayerTurn(playerId))
    }

    return moves
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const round = this.remind<number>(Memory.Round)

    if (round < numberOfRounds) {
      this.memorize(Memory.Round, round + 1)
      moves.push(this.startRule(RuleId.DealDevelopmentCards))
    } else {
      moves.push(this.endGame())
    }

    return moves
  }
}
