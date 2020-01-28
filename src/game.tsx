import React from 'react'
import {Game, useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import DevelopmentCard from './material/DevelopmentCard'
import Move from './moves/Move'

export default function () {
  const game = useGame<ItsAWonderfulWorld, Move>()
  return (
    <Game>
      <header>
        <h1>Welcome!</h1>
      </header>
      <p>{JSON.stringify(game)}</p>
      <DevelopmentCard/>
    </Game>
  )
}