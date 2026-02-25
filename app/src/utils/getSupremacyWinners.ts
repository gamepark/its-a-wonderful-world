import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { getProduction } from '@gamepark/its-a-wonderful-world/Production'
import { MaterialGame } from '@gamepark/rules-api'

/**
 * Compute who wins the supremacy bonus, mirroring the logic in ProductionRule.ts
 */
export function getSupremacyWinners(game: MaterialGame, resource: Resource): Empire[] {
  const supremacySeats = game.players.length >= 6 ? 2 : 1

  const productionByPlayer = (game.players as Empire[])
    .map(empire => ({ empire, production: getProduction(game, empire, resource) }))
    .filter(p => p.production > 0)
    .sort((a, b) => b.production - a.production)

  if (productionByPlayer.length === 0) return []

  const topProduction = productionByPlayer[0].production
  const topPlayers = productionByPlayer.filter(p => p.production === topProduction)

  if (topPlayers.length > supremacySeats) return []

  const winners = topPlayers.map(p => p.empire)

  if (winners.length < supremacySeats) {
    const secondProduction = productionByPlayer.find(p => p.production < topProduction)?.production
    if (secondProduction) {
      const secondPlayers = productionByPlayer.filter(p => p.production === secondProduction)
      if (secondPlayers.length <= supremacySeats - winners.length) {
        winners.push(...secondPlayers.map(p => p.empire))
      }
    }
  }

  return winners
}
