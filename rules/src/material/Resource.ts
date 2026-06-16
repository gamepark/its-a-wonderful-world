import { getEnumValues } from '@gamepark/rules-api'

export enum Resource {
  Materials = 1,
  Energy,
  Science,
  Gold,
  Exploration,
  Krystallium
}

export const resources = getEnumValues(Resource)

export function isResource(item: unknown): item is Resource {
  return resources.indexOf(item as Resource) !== -1
}
