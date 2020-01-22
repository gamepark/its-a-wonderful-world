type Rules<Game> = {
  setup(): Game

  getPlayerIds(game: Game): string[]
}