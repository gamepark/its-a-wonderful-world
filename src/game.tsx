import {css} from '@emotion/core'
import React from 'react'
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
  if (!game)
    return null
  return (
    <Game css={style}>
      <Header/>
      <Letterbox>
        <Board/>
        <DrawPile/>
        <DiscardPile/>
        <DisplayedEmpire player={game.players.find(player => player.empire == playerId)}/>
        {game.players.map((player, index) => <PlayerPanel key={player.empire} player={player} position={index}/>)}
      </Letterbox>
    </Game>
  )
}

const style = css`
  background-image: url(${artwork});
  background-size: cover;
  background-position: center;
`