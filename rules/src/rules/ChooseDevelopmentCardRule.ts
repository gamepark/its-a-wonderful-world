import { isMoveItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { Empire } from '../Empire'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

/**
 * Simultaneous rule where all players choose one card from their hand.
 * When all players have chosen, the game reveals the chosen cards and passes the remaining cards.
 */
export class ChooseDevelopmentCardRule extends SimultaneousRule<Empire, MaterialType, LocationType> {
  onRuleStart(): MaterialMove[] {
    // Count total cards in all players' hands
    const totalCardsInHands = this.material(MaterialType.DevelopmentCard)
      .location(LocationType.PlayerHand)
      .length

    // If each player has exactly one card left, choose them all automatically (revealed)
    if (totalCardsInHands === this.game.players.length) {
      return [
        // Move all cards to draft area, revealed (rotation: true), keeping their owner
        ...this.material(MaterialType.DevelopmentCard)
          .location(LocationType.PlayerHand)
          .moveItems((item) => ({
            type: LocationType.DraftArea,
            player: item.location.player,
            rotation: true
          })),
        // Go directly to Planning phase
        this.startSimultaneousRule(RuleId.Planning)
      ]
    }

    return []
  }

  getActivePlayerLegalMoves(playerId: Empire): MaterialMove[] {
    return this.material(MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(playerId).moveItems({
      type: LocationType.DraftArea,
      player: playerId
    })
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItemType(MaterialType.DevelopmentCard)(move)) return []

    // If the card was moved revealed (last card auto-pick), don't end turn
    // (the rule will transition directly to Planning)
    if (move.location.rotation) return []

    // After a player chooses a card, automatically end their turn
    const player = move.location.player
    if (player) {
      return [this.endPlayerTurn(player)]
    }

    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    // All players have chosen their card (or passed)
    // Move to reveal phase
    return [this.startRule(RuleId.RevealChosenCards)]
  }
}
