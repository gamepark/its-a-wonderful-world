import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource, resources } from '@gamepark/its-a-wonderful-world/material/Resource'
import { getProductionAndCorruption } from '@gamepark/its-a-wonderful-world/Production'
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { useMemo } from 'react'

/**
 * Get production for all resources for a player
 */
export function usePlayerProduction(playerId: Empire): Map<Resource, number> {
  const rules = useRules<MaterialRules>()

  return useMemo(() => {
    const production = new Map<Resource, number>()
    if (!rules?.game) return production

    for (const resource of resources) {
      if (resource !== Resource.Krystallium) {
        production.set(resource, getProductionAndCorruption(rules.game, playerId, resource))
      }
    }
    return production
  }, [rules?.game, playerId])
}

/**
 * Get character token counts for a player.
 * Counts tokens in the player's PlayerCharacters location.
 */
export function usePlayerCharacters(playerId: Empire): Record<Character, number> {
  const rules = useRules<MaterialRules>()

  return useMemo(() => {
    const characters = {
      [Character.Financier]: 0,
      [Character.General]: 0
    }

    if (!rules?.game?.items?.[MaterialType.CharacterToken]) return characters

    // Player-owned tokens are in PlayerCharacters
    const playerTokens = rules.game.items[MaterialType.CharacterToken].filter(
      item => item.location?.player === playerId &&
              item.location?.type === LocationType.PlayerCharacters
    )

    for (const token of playerTokens) {
      const character = token.id as Character
      if (character === Character.Financier) {
        characters[Character.Financier] += token.quantity ?? 1
      } else if (character === Character.General) {
        characters[Character.General] += token.quantity ?? 1
      }
    }

    return characters
  }, [rules?.game, playerId])
}

/**
 * Check if a player is eliminated.
 * Note: This game doesn't have player elimination.
 */
export function usePlayerEliminated(_playerId: Empire): boolean {
  return false
}
