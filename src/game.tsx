import React from 'react'
import {Game, useGame, usePlayerId} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import Board from './material/Board'
import artwork from './material/its-cover-artwork.png'
import MyEmpire from './players/MyEmpire'
import OtherPlayerEmpire from './players/OtherPlayerEmpire'

export default function () {
  const game = useGame<ItsAWonderfulWorld>()
  const playerId = usePlayerId()
  if (!game)
    return null
  return (
    <Game style={{backgroundImage: `url(${artwork})`, backgroundSize: 'cover'}}>
      <Header/>
      <Board/>
      {game.players.map(player => {
        return player.empire === playerId ?
          <MyEmpire key={player.empire} player={player}/> :
          <OtherPlayerEmpire key={player.empire} empire={player.empire} player={player}/>
      })}
    </Game>
  )
}