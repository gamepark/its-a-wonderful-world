/**
 * Production system for calculating resource production from empire cards and constructed developments.
 * Reimplemented for Material approach.
 */

import { MaterialGame } from '@gamepark/rules-api'
import { Empire } from './Empire'
import { Memory } from './ItsAWonderfulWorldMemory'
import { getDevelopmentDetails } from './material/Development'
import { DevelopmentType } from './material/DevelopmentType'
import { Empires } from './material/Empires'
import { EmpireSide } from './material/EmpireSide'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { isResource, Resource } from './material/Resource'

type ProductionFactor = {
  resource: Resource
  factor: DevelopmentType
}

export type Production = Resource | { [key in Resource]?: number } | ProductionFactor

export function isProductionFactor(production: Production): production is ProductionFactor {
  const productionFactor = production as ProductionFactor
  return productionFactor.resource !== undefined && productionFactor.factor !== undefined
}

/**
 * Get the empire side from game memory
 */
export function getEmpireSide(game: MaterialGame): EmpireSide {
  return game.memory[Memory.EmpireSide] ?? EmpireSide.A
}

/**
 * Get total production (including negative corruption) for a resource
 */
export function getProductionAndCorruption(game: MaterialGame, empire: Empire, resource: Resource): number {
  // Get empire production from memory (empire cards are static)
  const empireSide = getEmpireSide(game)
  const empireDetails = Empires[empire]?.[empireSide]
  if (!empireDetails) return 0

  let total = getResourceProduction(game, empire, resource, empireDetails.production)

  // Get production from constructed developments
  const constructedDevelopments = game.items[MaterialType.DevelopmentCard]?.filter(
    (item) => item.location?.type === LocationType.ConstructedDevelopments && item.location?.player === empire
  ) ?? []

  for (const card of constructedDevelopments) {
    const development = card.id.front
    const details = getDevelopmentDetails(development)
    total += getResourceProduction(game, empire, resource, details.production)
  }

  return total
}

/**
 * Get actual production (minimum 0) for a resource
 */
export function getProduction(game: MaterialGame, empire: Empire, resource: Resource): number {
  return Math.max(0, getProductionAndCorruption(game, empire, resource))
}

/**
 * Calculate production for a specific resource from a Production definition
 */
function getResourceProduction(game: MaterialGame, empire: Empire, resource: Resource, production?: Production): number {
  if (!production) {
    return 0
  }

  // Simple resource production (produces 1 of that resource)
  if (isResource(production)) {
    return production === resource ? 1 : 0
  }

  // Production factor (produces based on count of certain development types)
  if (isProductionFactor(production)) {
    if (production.resource === resource) {
      // Count constructed developments of the specified type
      const constructedDevelopments = game.items[MaterialType.DevelopmentCard]?.filter(
        (item) => item.location?.type === LocationType.ConstructedDevelopments && item.location?.player === empire
      ) ?? []

      return constructedDevelopments.reduce((sum, card) => {
        const development = card.id.front
        const details = getDevelopmentDetails(development)
        return details.type === production.factor ? sum + 1 : sum
      }, 0)
    }
    return 0
  }

  // Object mapping {[Resource]: number}
  return production[resource] ?? 0
}
