import { Character } from '../material/Character'
import { Resource } from '../material/Resource'
import { ProductionRule } from './ProductionRule'
import { RuleId } from './RuleId'

/**
 * Exploration production phase (5th and last of 5)
 * Supremacy bonus: General
 * After this phase, either start a new round or end the game
 */
export class ExplorationProductionRule extends ProductionRule {
  get resource(): Resource {
    return Resource.Exploration
  }

  get supremacyCharacter(): Character {
    return Character.General
  }

  get nextRule(): RuleId | undefined {
    // Last production phase - no next rule
    return undefined
  }
}
