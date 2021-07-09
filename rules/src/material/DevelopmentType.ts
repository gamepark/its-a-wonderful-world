import {isEnumValue} from '@gamepark/rules-api'

enum DevelopmentType {
  Structure = 1, Vehicle, Research, Project, Discovery
}

export default DevelopmentType

export const developmentTypes = Object.values(DevelopmentType).filter(isEnumValue)

export function isDevelopmentType(item: any): item is DevelopmentType {
  return developmentTypes.indexOf(item) !== -1
}