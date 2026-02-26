import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { Memory } from '../ItsAWonderfulWorldMemory'
import { DeckType } from '../material/DeckType'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Automatic rule that passes cards from each player's hand to the next player.
 * In rounds 1 and 3, cards pass clockwise. In rounds 2 and 4, cards pass counterclockwise.
 *
 * Animation is done in 3 steps:
 * 1. All players send their hand to transit (player undefined)
 * 2. Each transit hand is shuffled (separately by card back / deck type)
 * 3. Each transit hand is moved to the receiving player
 * This ensures cards are shuffled before the receiving player sees them.
 */
export class PassCardsRule extends MaterialRulesPart<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const players = this.game.players

    const round = this.remind<number>(Memory.Round)
    const clockwise = round % 2 === 1
    const getNextIndex = (index: number) => (clockwise ? (index + 1) % players.length : (index - 1 + players.length) % players.length)

    // Capture each player's hand (indexes are resolved now)
    const playerCards = players.map((player) => this.material(MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(player))

    // Step 1: All players send cards to transit (no player)
    for (let i = 0; i < players.length; i++) {
      moves.push(playerCards[i].sort((item) => item.location.x!).moveItemsAtOnce({ type: LocationType.PlayerHand }))
    }

    // Step 2: Shuffle each hand in transit, separately by card back (deck type)
    for (let i = 0; i < players.length; i++) {
      for (const deckType of Object.values(DeckType).filter((v): v is DeckType => typeof v === 'number')) {
        const cardsOfDeck = playerCards[i].filter((item) => (item.id as { back: DeckType }).back === deckType)
        if (cardsOfDeck.length > 1) {
          moves.push(cardsOfDeck.shuffle())
        }
      }
    }

    // Step 3: Move each hand to the receiving player
    for (let i = 0; i < players.length; i++) {
      moves.push(
        playerCards[i]
          .sort((item) => item.location.x!)
          .moveItemsAtOnce({
            type: LocationType.PlayerHand,
            player: players[getNextIndex(i)]
          })
      )
    }

    // After passing, go back to choosing a card
    moves.push(this.startSimultaneousRule(RuleId.ChooseDevelopmentCard))

    return moves
  }
}
