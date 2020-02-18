enum DevelopmentType {
  Structure = 'Structure', Vehicle = 'Vehicle', Research = 'Research', Project = 'Project', Discovery = 'Discovery'
}

export default DevelopmentType

export function isDevelopmentType(item: any): item is DevelopmentType {
  return Object.values(DevelopmentType).indexOf(item) != -1
}