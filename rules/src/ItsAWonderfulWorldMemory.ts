/**
 * Memory keys for game state that is not part of the material system.
 */
export enum Memory {
  /**
   * Current round (1-4)
   */
  Round = 1,

  /**
   * Cards drafted by each player in the current round.
   * Used to determine recycling bonus destination (AvailableResources vs EmpireCardResources)
   * Stored per player: Development[]
   */
  DraftedCards,

  /**
   * Empire card side used in this game (A-F).
   * All players use the same side.
   */
  EmpireSide,

  /**
   * Marks players who need to choose a character for science supremacy bonus.
   * Stored per player: boolean
   */
  ScienceBonus,

  /**
   * Number of pending construction bonus character tokens for a player.
   * Used to distinguish construction bonuses from science supremacy choice.
   * Stored per player: number
   */
  PendingConstructionBonusTokens,

  /**
   * Player whose resources should be checked for unplaceability after a card move.
   * Set in beforeItemMove (where we still know the card's owner), read in afterItemMove (where the state is updated).
   */
  CheckUnplaceableResources
}
