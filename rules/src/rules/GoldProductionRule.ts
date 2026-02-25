import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Gold production phase (4th of 5)
 * Supremacy bonus: Financier
 */
export class GoldProductionRule extends ProductionRule {
  resource = Resource.Gold
  supremacyCharacter = Character.Financier
  nextRule = RuleId.ExplorationProduction
}
