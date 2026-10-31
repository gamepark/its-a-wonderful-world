import { applyAutomaticMoves, isEndPlayerTurn, MaterialGame, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { ItsAWonderfulWorldRules } from '../ItsAWonderfulWorldRules'
import { Character } from '../material/Character'
import { DeckType } from '../material/DeckType'
import { Development } from '../material/Development'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { RuleId } from './RuleId'
import { isScienceCharacterChoice, ScienceProductionRule } from './ScienceProductionRule'

const player = Empire.AztecEmpire

/**
 * The player won the Science supremacy and has a Financial Center under construction (4 Materials, 1 Energy).
 * Its construction bonus is a Financier, which must not be mistaken for the supremacy choice.
 */
function setupGame(resources: MaterialItem[]): ItsAWonderfulWorldRules {
  const game: MaterialGame = {
    players: [player],
    items: {
      [MaterialType.DevelopmentCard]: [
        { id: { front: Development.FinancialCenter, back: DeckType.Default }, location: { type: LocationType.ConstructionArea, player, x: 0 } }
      ],
      [MaterialType.ResourceCube]: resources
    },
    memory: {},
    rule: { id: RuleId.ScienceProduction, players: [player] }
  }
  const rules = new ItsAWonderfulWorldRules(game)
  rules.memorize(Memory.ScienceBonus, true, player)
  return rules
}

function supremacyChoices(rules: ItsAWonderfulWorldRules): MaterialMove[] {
  return rules.getLegalMoves(player).filter((move) => isScienceCharacterChoice(Character.Financier)(move) || isScienceCharacterChoice(Character.General)(move))
}

function expectSupremacyChoiceStillPending(rules: ItsAWonderfulWorldRules) {
  expect(rules.material(MaterialType.DevelopmentCard).location(LocationType.ConstructedDevelopments).length).toBe(1)
  expect(rules.material(MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(player).getQuantity()).toBe(1)
  expect(supremacyChoices(rules)).toHaveLength(2)
  expect(rules.getLegalMoves(player).some(isEndPlayerTurn)).toBe(false)

  applyAutomaticMoves(rules, [rules.getLegalMoves(player).find(isScienceCharacterChoice(Character.General))!])
  expect(rules.material(MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(player).id(Character.General).getQuantity()).toBe(1)
  expect(supremacyChoices(rules)).toHaveLength(0)
  expect(rules.getLegalMoves(player).some(isEndPlayerTurn)).toBe(true)
}

describe('Science supremacy choice', () => {
  it('stays pending after a direct construction that awards a character', () => {
    const rules = setupGame([
      { id: Resource.Materials, location: { type: LocationType.AvailableResources, player, id: Resource.Materials }, quantity: 4 },
      { id: Resource.Energy, location: { type: LocationType.AvailableResources, player, id: Resource.Energy }, quantity: 1 }
    ])

    applyAutomaticMoves(rules, [rules.material(MaterialType.DevelopmentCard).index(0).moveItem({ type: LocationType.ConstructedDevelopments, player })])

    expectSupremacyChoiceStillPending(rules)
  })

  it('stays pending after placing the last resource of a construction that awards a character', () => {
    const rules = setupGame([
      ...[0, 1, 2, 3].map((x) => ({ id: Resource.Materials, location: { type: LocationType.ConstructionCardCost, parent: 0, x } })),
      { id: Resource.Energy, location: { type: LocationType.AvailableResources, player, id: Resource.Energy }, quantity: 1 }
    ])

    applyAutomaticMoves(rules, [rules.material(MaterialType.ResourceCube).index(4).moveItem({ type: LocationType.ConstructionCardCost, parent: 0, x: 4 }, 1)])

    expectSupremacyChoiceStillPending(rules)
  })
})

describe('Science supremacy flag', () => {
  it('never outlives the Science production phase', () => {
    const rules = setupGame([])
    // Replaying a game recorded when the choice was a create item move: the flag is still set when the player ends the turn
    applyAutomaticMoves(rules, [new ScienceProductionRule(rules.game).endPlayerTurn(player)])

    expect(rules.game.rule?.id).not.toBe(RuleId.ScienceProduction)
    expect(rules.remind(Memory.ScienceBonus, player)).toBeUndefined()
  })
})
