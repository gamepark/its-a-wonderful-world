import { applyAutomaticMoves, MaterialGame } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Empire } from '../Empire'
import { ItsAWonderfulWorldRules } from '../ItsAWonderfulWorldRules'
import { DeckType } from '../material/DeckType'
import { Development } from '../material/Development'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { PlanningRule } from './PlanningRule'
import { RuleId } from './RuleId'

const player = Empire.AztecEmpire

/**
 * The Harbor Zone is the only card of the player, it costs Gold and its recycling bonus is Gold.
 * Once it is recycled, no Gold can be placed anywhere anymore.
 */
function setupGame(availableGold: number): MaterialGame {
  return {
    players: [player],
    items: {
      [MaterialType.DevelopmentCard]: [{ id: { front: Development.HarborZone, back: DeckType.Default }, location: { type: LocationType.DraftArea, player, x: 0 } }],
      [MaterialType.ResourceCube]: [{ id: Resource.Gold, location: { type: LocationType.AvailableResources, player, id: Resource.Gold }, quantity: availableGold }]
    },
    memory: {},
    rule: { id: RuleId.Planning, players: [player] }
  }
}

function recycleTheOnlyGoldCard(availableGold: number) {
  const game = setupGame(availableGold)
  // Memorizes the cards drafted this round, so that the recycling bonus stays available
  new PlanningRule(game).onRuleStart()

  const rules = new ItsAWonderfulWorldRules(game)
  // Plays the move, its consequences and the automatic moves, exactly like the server does
  applyAutomaticMoves(rules, [rules.material(MaterialType.DevelopmentCard).index(0).moveItem({ type: LocationType.Discard })])
  return rules
}

describe('Recycling the last card that accepts a resource', () => {
  it('sends the resources that were already available to the empire card, along with the recycling bonus', () => {
    const rules = recycleTheOnlyGoldCard(2)

    expect(rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).getQuantity()).toBe(0)
    // The 2 Gold already available + the recycling bonus
    expect(rules.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(player).getQuantity()).toBe(3)
  })

  it('converts the resources into a Krystallium when the empire card gets full', () => {
    const rules = recycleTheOnlyGoldCard(4)

    expect(rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).getQuantity()).toBe(0)
    expect(rules.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).getQuantity()).toBe(0)
    expect(rules.material(MaterialType.ResourceCube).location(LocationType.KrystalliumStock).player(player).getQuantity()).toBe(1)
  })
})
