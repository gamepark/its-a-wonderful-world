import {isEnumValue} from '@gamepark/rules-api'

enum Resource {
  Materials = 1, Energy, Science, Gold, Exploration, Krystallium
}

export default Resource

export function isResource(item: any): item is Resource {
  return resources.indexOf(item) !== -1
}

export const resources = Object.values(Resource).filter(isEnumValue)
export const productionSteps = resources.filter(resource => resource !== Resource.Krystallium)