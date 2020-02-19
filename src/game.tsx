import React from 'react'
import {Game, useGame, usePlayerId} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import Board from './material/board/Board'
import artwork from './material/its-cover-artwork.png'
import DisplayedEmpire from './players/DisplayedEmpire'
import OtherPlayerEmpire from './players/OtherPlayerEmpire'

export default function () {
  const game = useGame<ItsAWonderfulWorld>()
  const playerId = usePlayerId()
  if (!game)
    return null
  return (
    <Game style={{backgroundImage: `url(${artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Header/>
      <Board/>
      {game.players.map(player => player.empire === playerId ?
        <DisplayedEmpire key={player.empire} player={player}/> :
        <OtherPlayerEmpire key={player.empire} player={player}/>)}
    </Game>
  )
}