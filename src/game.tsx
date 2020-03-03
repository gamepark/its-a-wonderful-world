import {css} from '@emotion/core'
import React, {useState} from 'react'
import {Game, Letterbox, useGame, usePlayerId} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import Board from './material/board/Board'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import artwork from './material/its-cover-artwork.png'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanel from './players/PlayerPanel'

export default function () {
  const game = useGame<ItsAWonderfulWorld>()
  const playerId = usePlayerId()
  const [displayedEmpire, setDisplayedEmpire] = useState(playerId || game.players[0].empire)
  const displayedPlayer = game.players.find(player => player.empire == displayedEmpire)
  let playersStartingWithMyself = game.players
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.empire == playerId)
    playersStartingWithMyself = [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  }
  return (
    <Game css={style}>
      <Letterbox>
        <Board availableResources={displayedPlayer.availableResources}/>
        <DrawPile/>
        <DiscardPile/>
        <DisplayedEmpire player={displayedPlayer}/>
        {playersStartingWithMyself.map((player, index) =>
          <PlayerPanel key={player.empire} player={player} position={index} onClick={() => setDisplayedEmpire(player.empire)}
                       highlight={player.empire == displayedEmpire}/>
        )}
      </Letterbox>
      <Header/>
    </Game>
  )
}

const style = css`
  background-image: url(${artwork});
  background-size: cover;
  background-position: center;
`