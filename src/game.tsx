import React from 'react'
import {Game, useGame, usePlayerId} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import Empire from './material/Empire'
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
      {Object.entries(game.players).map(([empire, player]) => {
        return empire === playerId ?
          <MyEmpire key={empire} empire={empire as Empire} player={player}/> :
          <OtherPlayerEmpire key={empire} empire={empire as Empire} player={player}/>
      })}
    </Game>
  )
}