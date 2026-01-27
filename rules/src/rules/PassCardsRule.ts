import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Automatic rule that passes cards from each player's hand to the next player.
 * In rounds 1 and 3, cards pass clockwise. In rounds 2 and 4, cards pass counterclockwise.
 *
 * Moves are ordered so that for every viewer, their "send" animation plays before their "receive":
 * 1. Player[0] → transit
 * 2. Remaining players send in reverse (clockwise) or forward (counterclockwise) order
 * 3. transit → next(Player[0])
 */
export class PassCardsRule extends MaterialRulesPart<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const players = this.game.players

    const round = this.remind<number>(Memory.Round)
    const clockwise = round % 2 === 1
    const getNextIndex = (index: number) =>
      clockwise ? (index + 1) % players.length : (index - 1 + players.length) % players.length

    // Step 1: First player sends cards to a temporary hand (no player) to break the cycle
    const firstPlayerCards = this.material(MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(players[0])
    if (firstPlayerCards.length > 0) {
      moves.push(firstPlayerCards.moveItemsAtOnce({ type: LocationType.PlayerHand }))
    }

    // Steps 2..n: Remaining players send to their next, ordered so each sends before the next receives
    // Clockwise: descending order (n-1, n-2, ..., 1)
    // Counterclockwise: ascending order (1, 2, ..., n-1)
    const indices = clockwise
      ? Array.from({ length: players.length - 1 }, (_, k) => players.length - 1 - k)
      : Array.from({ length: players.length - 1 }, (_, k) => k + 1)

    for (const i of indices) {
      const playerCards = this.material(MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(players[i])
      if (playerCards.length > 0) {
        moves.push(playerCards.moveItemsAtOnce({
          type: LocationType.PlayerHand,
          player: players[getNextIndex(i)]
        }))
      }
    }

    // Step n+1: Transit cards reach first player's next
    if (firstPlayerCards.length > 0) {
      moves.push(firstPlayerCards.moveItemsAtOnce({
        type: LocationType.PlayerHand,
        player: players[getNextIndex(0)]
      }))
    }

    // After passing, go back to choosing a card
    moves.push(this.startSimultaneousRule(RuleId.ChooseDevelopmentCard))

    return moves
  }
}
