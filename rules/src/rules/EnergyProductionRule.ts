import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Energy production phase (2nd of 5)
 * Supremacy bonus: General
 */
export class EnergyProductionRule extends ProductionRule {
  get resource(): Resource {
    return Resource.Energy
  }

  get supremacyCharacter(): Character {
    return Character.General
  }

  get nextRule(): RuleId {
    return RuleId.ScienceProduction
  }
}
