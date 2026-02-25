import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Materials production phase (1st of 5)
 * Supremacy bonus: Financier
 */
export class MaterialsProductionRule extends ProductionRule {
  get resource(): Resource {
    return Resource.Materials
  }

  get supremacyCharacter(): Character {
    return Character.Financier
  }

  get nextRule(): RuleId {
    return RuleId.EnergyProduction
  }
}
