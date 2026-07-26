import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
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
 * Two copies of the same development (Industrial Complex, recycling bonus: Gold):
 * - index 0: slated for construction on a previous round, with 2 Materials cubes already invested
 * - index 1: drafted this round, still in the draft area
 *
 * Index 2 is a Harbor Zone under construction, so that a Gold cube is never "unplaceable"
 * (an unplaceable resource is automatically sent to the empire card).
 */
function setupGame(): MaterialGame {
  const card = { front: Development.IndustrialComplex, back: DeckType.Default }
  return {
    players: [player],
    items: {
      [MaterialType.DevelopmentCard]: [
        { id: card, location: { type: LocationType.ConstructionArea, player, x: 0 } },
        { id: card, location: { type: LocationType.DraftArea, player, x: 0 } },
        { id: { front: Development.HarborZone, back: DeckType.Default }, location: { type: LocationType.ConstructionArea, player, x: 1 } }
      ],
      [MaterialType.ResourceCube]: [
        { id: Resource.Materials, location: { type: LocationType.ConstructionCardCost, parent: 0, x: 0 } },
        { id: Resource.Materials, location: { type: LocationType.ConstructionCardCost, parent: 0, x: 1 } }
      ]
    },
    memory: {},
    rule: { id: RuleId.Planning, players: [player] }
  }
}

/** Play a move and all the consequences the rules trigger, like the server does. */
function play(rules: ItsAWonderfulWorldRules, move: MaterialMove) {
  for (const consequence of rules.play(move)) {
    play(rules, consequence)
  }
}

function recycle(cardIndex: number) {
  const game = setupGame()
  // Memorizes the cards drafted this round
  new PlanningRule(game).onRuleStart()

  const rules = new ItsAWonderfulWorldRules(game)
  play(rules, rules.material(MaterialType.DevelopmentCard).index(cardIndex).moveItem({ type: LocationType.Discard }))
  return rules
}

describe('Recycling a development card during the Planning phase', () => {
  it('sends the recycling bonus to the empire card when the card was slated on a previous round', () => {
    const rules = recycle(0)

    expect(rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).getQuantity()).toBe(0)
    const onEmpire = rules.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(player)
    expect(onEmpire.getQuantity()).toBe(1)
    expect(onEmpire.getItem()!.id).toBe(Resource.Gold)
  })

  it('loses the cubes already invested on a card slated on a previous round', () => {
    const rules = recycle(0)

    expect(rules.material(MaterialType.ResourceCube).location(LocationType.ConstructionCardCost).getQuantity()).toBe(0)
    // The 2 Materials cubes are destroyed, not given back: only the recycling bonus remains
    expect(rules.material(MaterialType.ResourceCube).getQuantity()).toBe(1)
  })

  it('keeps the recycling bonus available when the card is still in the draft area', () => {
    const rules = recycle(1)

    expect(rules.material(MaterialType.ResourceCube).location(LocationType.EmpireCardResources).getQuantity()).toBe(0)
    const available = rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(player)
    expect(available.getQuantity()).toBe(1)
    expect(available.getItem()!.id).toBe(Resource.Gold)

    // The other copy keeps the cubes invested on it
    expect(rules.material(MaterialType.ResourceCube).location(LocationType.ConstructionCardCost).getQuantity()).toBe(2)
  })
})
