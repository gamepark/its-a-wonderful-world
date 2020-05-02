enum Resource {
  Materials = 'Materials', Energy = 'Energy', Science = 'Science', Gold = 'Gold', Exploration = 'Exploration', Krystallium = 'Krystallium'
}

export default Resource

export function isResource(item: any): item is Resource {
  return Object.values(Resource).indexOf(item) !== -1
}