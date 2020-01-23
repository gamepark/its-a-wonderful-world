type Rules<Game extends Object, Move extends Object | String> = {
  setup(): Game

  getPlayerIds(game: Game): string[]

  getAutomaticMove(game: Game): Move | void

  play(move: Move, game: Game): void
}