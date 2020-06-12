enum Resource {
  Materials = 'Materials', Energy = 'Energy', Science = 'Science', Gold = 'Gold', Exploration = 'Exploration', Krystallium = 'Krystallium'
}

export default Resource

export function isResource(item: any): item is Resource {
  return resources.indexOf(item) !== -1
}

export const resources = Object.values(Resource) as Resource[]
export const productionSteps = resources.filter(resource => resource !== Resource.Krystallium)