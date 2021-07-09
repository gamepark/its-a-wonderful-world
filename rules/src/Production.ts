import {getCardDetails} from './material/Developments'
import DevelopmentType from './material/DevelopmentType'
import Empires from './material/Empires'
import Resource, {isResource} from './material/Resource'
import Player from './Player'
import PlayerView from './PlayerView'

type ProductionFactor = {
  resource: Resource
  factor: DevelopmentType
}

type Production = Resource | { [key in Resource]?: number } | ProductionFactor

export default Production

export function isProductionFactor(production: Production): production is ProductionFactor {
  const productionFactor = production as ProductionFactor
  return productionFactor.resource !== undefined && productionFactor.factor !== undefined
}

export function getProduction(player: Player | PlayerView, resource: Resource): number {
  const developmentsProduction = player.constructedDevelopments.reduce((sum, card) =>
    sum + getResourceProduction(player, resource, getCardDetails(card).production), 0
  )
  return Math.max(0, getEmpireProduction(player, resource) + developmentsProduction)
}

function getEmpireProduction(player: Player | PlayerView, resource: Resource): number {
  return getResourceProduction(player, resource, Empires[player.empire][player.empireSide].production)
}

function getResourceProduction(player: Player | PlayerView, resource: Resource, production?: Production) {
  if (!production) {
    return 0
  }
  if (isResource(production)) {
    return production === resource ? 1 : 0
  }
  if (!isProductionFactor(production)) {
    return production[resource] ?? 0
  }
  if (production.resource === resource) {
    return player.constructedDevelopments.reduce((sum, card) => getCardDetails(card).type === production.factor ? sum + 1 : sum, 0)
  }
  return 0
}