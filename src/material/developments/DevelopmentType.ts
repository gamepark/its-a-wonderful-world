enum DevelopmentType {
  Structure = 'Structure', Vehicle = 'Vehicle', Research = 'Research', Project = 'Project', Discovery = 'Discovery'
}

export default DevelopmentType

export const developmentTypes = Object.values(DevelopmentType) as DevelopmentType[]

export function isDevelopmentType(item: any): item is DevelopmentType {
  return developmentTypes.indexOf(item) !== -1
}