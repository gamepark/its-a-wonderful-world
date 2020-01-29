import {css} from '@emotion/core'
import React, {Fragment} from 'react'
import {Game, useGame} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import DevelopmentCard from './material/DevelopmentCard'
import Empire from './material/Empire'
import EmpireCard from './material/empire-cards/EmpireCard'
import Move from './moves/Move'

const topLeft = css`
  top: 8vh;
  left: 1vh;
  transform: rotate(180deg);
`

const bottomRight = css`
  bottom: 1vh;
  right: 1vh;
`

export default function () {
  const game = useGame<ItsAWonderfulWorld, Move>()
  if (!game)
    return null
  return (
    <Game>
      <Header/>
      <p>{JSON.stringify(game)}</p>
      <DevelopmentCard/>
      {Object.entries(game.players).map(([empire, player]) => (
        <Fragment key={empire}>
          <EmpireCard empire={empire as Empire} position={empire === Empire.PanafricanUnion ? bottomRight : topLeft}/>
        </Fragment>
      ))}
    </Game>
  )
}