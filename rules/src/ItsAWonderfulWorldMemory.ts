/**
 * Memory keys for game state that is not part of the material system.
 */
export enum Memory {
  /**
   * Current round (1-4)
   */
  Round = 1,

  /**
   * Indexes of the development card items drafted by each player in the current round.
   * Used to determine recycling bonus destination (AvailableResources vs EmpireCardResources),
   * and whether the cubes already placed on a recycled card are recovered or lost.
   * Indexes are stable: development card items are never deleted.
   * Stored per player: number[]
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
  PendingConstructionBonusTokens
}
