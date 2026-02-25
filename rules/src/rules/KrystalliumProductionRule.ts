import { MaterialMove } from '@gamepark/rules-api'
import { Character } from '../material/Character'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { getKrystalliumAndCharacterProduction } from '../Production'
import { ProductionRule } from './ProductionRule'

/**
 * Krystallium production phase (after Exploration).
 * Only activated for players who have constructed cards with krystalliumProduction.
 * Creates Krystallium cubes (directly to stock) and character tokens, then allows construction.
 */
export class KrystalliumProductionRule extends ProductionRule {
  resource = Resource.Krystallium

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
}
