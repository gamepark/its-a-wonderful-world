import { MaterialMove } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { numberOfRounds } from '../ItsAWonderfulWorldConstants'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { Character } from '../material/Character'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Resource } from '../material/Resource'
import { getProduction } from '../Production'
import { ConstructionRule } from './ConstructionRule'
import { RuleId } from './RuleId'

/**
 * Abstract base class for production phases.
 * Each resource has its own production rule that extends this class.
 * Production happens in order: Materials -> Energy -> Science -> Gold -> Exploration
 */
export abstract class ProductionRule extends ConstructionRule {
  abstract resource: Resource
  supremacyCharacter: Character | undefined = undefined
  nextRule: RuleId | undefined = undefined

  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Calculate production for each player and create resources
    const productionByPlayer: { empire: Empire; production: number }[] = []

    for (const empire of this.game.players) {
      const production = getProduction(this.game, empire, this.resource)

      if (production > 0) {
        // Create resources in available resources
        moves.push(
          this.material(MaterialType.ResourceCube).createItem({
            id: this.resource,
            location: {
              type: LocationType.AvailableResources,
              player: empire,
              id: this.resource
            },
            quantity: production
          })
        )

        productionByPlayer.push({ empire, production })
      }
    }

    // Award supremacy bonuses (characters) to top producers
    if (productionByPlayer.length > 0) {
      this.awardSupremacyBonuses(productionByPlayer, moves)
    }

    return moves
  }

  /**
   * Award supremacy bonuses to top producers
   */
  private awardSupremacyBonuses(productionByPlayer: { empire: Empire; production: number }[], moves: MaterialMove[]): void {
    // Sort by production (descending)
    productionByPlayer.sort((a, b) => b.production - a.production)

    // Determine number of supremacy seats (1 for <6 players, 2 for >=6 players)
    const supremacySeats = this.game.players.length >= 6 ? 2 : 1

    // Find players who get supremacy (highest production, respecting ties)
    // If more players are tied than available seats, no one gets the bonus at that rank
    const topProduction = productionByPlayer[0].production
    const topPlayers = productionByPlayer.filter((p) => p.production === topProduction)
    const supremacyPlayers: Empire[] = []

    if (topPlayers.length <= supremacySeats) {
      // Top producers fit in available seats
      supremacyPlayers.push(...topPlayers.map((p) => p.empire))

      // If there's room and a clear second place, add them too
      if (supremacyPlayers.length < supremacySeats) {
        const secondProduction = productionByPlayer.find((p) => p.production < topProduction)?.production
        if (secondProduction) {
          const secondPlacePlayers = productionByPlayer.filter((p) => p.production === secondProduction)
          if (secondPlacePlayers.length <= supremacySeats - supremacyPlayers.length) {
            supremacyPlayers.push(...secondPlacePlayers.map((p) => p.empire))
          }
        }
      }
    }

    // Award character bonuses to supremacy players
    for (const empire of supremacyPlayers) {
      this.awardSupremacyBonus(empire, moves)
    }
  }

  /**
   * Award supremacy bonus to a single player.
   * Override in subclasses for special behavior (e.g., Science lets player choose).
   */
  protected awardSupremacyBonus(empire: Empire, moves: MaterialMove[]): void {
    const character = this.supremacyCharacter
    if (character !== undefined) {
      moves.push(
        this.material(MaterialType.CharacterToken).createItem({
          id: character,
          location: {
            type: LocationType.PlayerCharacters,
            player: empire,
            id: character
          }
        })
      )
    }
  }

  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    const moves: MaterialMove[] = []

    // Add common construction moves (recycle from construction area, place resources)
    moves.push(...this.getConstructionMoves(playerId))

    // Player can end their turn if they have placed all resources
    if (this.canEndTurn(playerId)) {
      moves.push(this.endPlayerTurn(playerId))
    }

    return moves
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    if (this.nextRule !== undefined) {
      return [this.startSimultaneousRule(this.nextRule)]
    } else {
      // Last production phase (Exploration) - end of round
      return this.endRound()
    }
  }

  /**
   * Called after the last production phase (Exploration) to either start a new round or end the game
   */
  protected endRound(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const round = this.remind<number>(Memory.Round)

    if (round < numberOfRounds) {
      // Start next round
      this.memorize(Memory.Round, round + 1)
      moves.push(this.startRule(RuleId.DealDevelopmentCards))
    } else {
      // Game is over
      moves.push(this.endGame())
    }

    return moves
  }
}
