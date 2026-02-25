import { MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { hasKrystalliumOrCharacterProduction } from '../Production'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Exploration production phase (5th and last of 5)
 * Supremacy bonus: General
 * After this phase, chain to KrystalliumProduction if any player has such production,
 * otherwise end the round.
 */
export class ExplorationProductionRule extends ProductionRule {
  resource = Resource.Exploration
  supremacyCharacter = Character.General

  getMovesAfterPlayersDone(): MaterialMove[] {
    const playersWithProduction = this.game.players.filter(
      (empire: Empire) => hasKrystalliumOrCharacterProduction(this.game, empire)
    )

    if (playersWithProduction.length > 0) {
      return [this.startSimultaneousRule(RuleId.KrystalliumProduction, playersWithProduction)]
    }

    return this.endRound()
  }
}
