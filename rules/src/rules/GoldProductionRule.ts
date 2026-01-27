import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Gold production phase (4th of 5)
 * Supremacy bonus: Financier
 */
export class GoldProductionRule extends ProductionRule {
  get resource(): Resource {
    return Resource.Gold
  }

  get supremacyCharacter(): Character {
    return Character.Financier
  }

  get nextRule(): RuleId {
    return RuleId.ProductionExploration
  }
}
