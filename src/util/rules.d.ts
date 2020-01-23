type Rules<Game, Move> = {
  setup(): Game

  getPlayerIds(game: Game): string[]

  getAutomaticMove(game: Game): Move | void

  play(move: Move, game: Game): void
}