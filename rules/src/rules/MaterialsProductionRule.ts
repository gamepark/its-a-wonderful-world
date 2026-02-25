import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Materials production phase (1st of 5)
 * Supremacy bonus: Financier
 */
export class MaterialsProductionRule extends ProductionRule {
  resource = Resource.Materials
  supremacyCharacter = Character.Financier
  nextRule = RuleId.EnergyProduction
}
