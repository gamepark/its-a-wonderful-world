import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { DraftHelp } from './DraftHelp'
import { PlanningHelp } from './PlanningHelp'
import { ProductionHelp } from './ProductionHelp'

// Map each production RuleId to a help component with the corresponding resource
function productionHelp(resource: Resource) {
  return () => ProductionHelp({ resource })
}

export const RulesHelp = {
  [RuleId.ChooseDevelopmentCard]: DraftHelp,
  [RuleId.Planning]: PlanningHelp,
  [RuleId.MaterialsProduction]: productionHelp(Resource.Materials),
  [RuleId.EnergyProduction]: productionHelp(Resource.Energy),
  [RuleId.ScienceProduction]: productionHelp(Resource.Science),
  [RuleId.GoldProduction]: productionHelp(Resource.Gold),
  [RuleId.ExplorationProduction]: productionHelp(Resource.Exploration)
}
