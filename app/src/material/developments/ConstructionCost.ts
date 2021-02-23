import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'

export default function constructionCost(cost: { [key in Resource | Character]?: number }): Record<Resource | Character, number> {
  return {
    [Resource.Materials]: cost[Resource.Materials] || 0,
    [Resource.Energy]: cost[Resource.Energy] || 0,
    [Resource.Science]: cost[Resource.Science] || 0,
    [Resource.Gold]: cost[Resource.Gold] || 0,
    [Resource.Exploration]: cost[Resource.Exploration] || 0,
    [Resource.Krystallium]: cost[Resource.Krystallium] || 0,
    [Character.Financier]: cost[Character.Financier] || 0,
    [Character.General]: cost[Character.General] || 0
  }
}