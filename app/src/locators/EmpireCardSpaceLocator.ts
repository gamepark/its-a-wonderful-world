import { Locator, MaterialContext } from '@gamepark/react-game'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { Location } from '@gamepark/rules-api'

// Base position of the empire card
export const empireCardX = -30.5
export const empireCardY = 14.5

// Vertical offset when moveUp condition is met (equivalent to v2's translateY(-27em))
export const moveUpOffset = 11

/**
 * In v2, during the draft phase with Ascension expansion and 2 or 4 players,
 * the empire card, constructed developments, and character tokens move up
 * to make room for the larger hand of cards.
 */
export function shouldMoveUpEmpire(context: MaterialContext<Empire, MaterialType, LocationType>): boolean {
  const ruleId = context.rules.game.rule?.id as RuleId | undefined
  const isDraftPhase = ruleId !== undefined && ruleId < RuleId.Planning
  if (!isDraftPhase) return false
  const players = context.rules.players.length
  if (players !== 2 && players !== 4) return false
  return context.rules.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length > 0
}

class EmpireCardSpaceLocator extends Locator<Empire, MaterialType, LocationType> {
  location = { type: LocationType.EmpireCardSpace }

  getCoordinates(_location: Location<Empire, LocationType>, context: MaterialContext<Empire, MaterialType, LocationType>) {
    const y = shouldMoveUpEmpire(context) ? empireCardY - moveUpOffset : empireCardY
    return { x: empireCardX, y, z: 0 }
  }
}

export const empireCardSpaceLocator = new EmpireCardSpaceLocator()
