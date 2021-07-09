import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {usePlayerId} from '@gamepark/react-client'
import {useMemo} from 'react'

export default function usePlayersStartingWithMe(game: GameView) {
  const playerId = usePlayerId<EmpireName>()
  return useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
}

const getPlayersStartingWith = (game: GameView, playerId?: EmpireName) => {
  if (!playerId) {
    return game.players
  }
  const playerIndex = game.players.findIndex(player => player.empire === playerId)
  return [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
}
