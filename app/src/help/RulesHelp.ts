import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { ProductionHelp } from './ProductionHelp'

// Map each production RuleId to a help component with the corresponding resource
function productionHelp(resource: Resource) {
  return () => ProductionHelp({ resource })
}

export const RulesHelp = {
  [RuleId.ProductionMaterials]: productionHelp(Resource.Materials),
  [RuleId.ProductionEnergy]: productionHelp(Resource.Energy),
  [RuleId.ProductionScience]: productionHelp(Resource.Science),
  [RuleId.ProductionGold]: productionHelp(Resource.Gold),
  [RuleId.ProductionExploration]: productionHelp(Resource.Exploration)
}
