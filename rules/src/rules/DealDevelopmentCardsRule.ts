import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

const numberOfCardsToDraft = 7

/**
 * Automatic rule that deals development cards to each player at the start of a round.
 * The number of cards dealt depends on the number of players and whether the Corruption & Ascension expansion is enabled.
 * In a draft game, all players receive their cards simultaneously.
 */
export class DealDevelopmentCardsRule extends MaterialRulesPart<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const players = this.game.players
    const hasAscensionDeck = this.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length > 0

    // Determine how many cards to deal from each deck
    const baseCardsToDeal = this.getBaseCardsToDeal(players.length, hasAscensionDeck)
    const ascensionCardsToDeal = this.getAscensionCardsToDeal(players.length, hasAscensionDeck)

    // Deal cards to each player
    const baseDeck = this.material(MaterialType.DevelopmentCard).location(LocationType.Deck).deck()
    const ascensionDeck = this.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).deck()
    for (const player of players) {
      // Deal base development cards
      moves.push(...baseDeck.deal({ type: LocationType.PlayerHand, player }, baseCardsToDeal))

      // Deal ascension cards if the expansion is enabled
      if (hasAscensionDeck && ascensionCardsToDeal > 0) {
        moves.push(...ascensionDeck.deal({ type: LocationType.PlayerHand, player }, ascensionCardsToDeal))
      }
    }

    // After dealing, move to the choosing phase (simultaneous)
    moves.push(this.startSimultaneousRule(RuleId.ChooseDevelopmentCard))

    return moves
  }

  /**
   * Get the number of base development cards to deal based on player count and expansion
   */
  private getBaseCardsToDeal(playerCount: number, hasAscension: boolean): number {
    if (!hasAscension) {
      // Without expansion: 10 cards for 2 players, 7 for others
      return playerCount === 2 ? 10 : numberOfCardsToDraft
    }

    // With Corruption & Ascension expansion
    switch (playerCount) {
      case 2:
        return 8
      case 7:
        return 5
      default:
        return 6
    }
  }

  /**
   * Get the number of ascension cards to deal based on player count
   */
  private getAscensionCardsToDeal(playerCount: number, hasAscension: boolean): number {
    if (!hasAscension) return 0

    switch (playerCount) {
      case 2:
        return 4
      case 3:
      case 4:
        return 3
      default:
        return 2
    }
  }
}
