import {css} from '@emotion/core'
import React, {Fragment} from 'react'
import {Game, Hand, useGame} from 'tabletop-game-workshop'
import Header from './Header'
import ItsAWonderfulWorld from './ItsAWonderfulWorld'
import DevelopmentCard from './material/development-cards/DevelopmentCard'
import Empire from './material/Empire'
import EmpireCard from './material/empire-cards/EmpireCard'
import Move from './moves/Move'
import artwork from './material/its-cover-artwork.png'

const topLeft = css`
  position: absolute;
  top: 8vh;
  left: 1vh;
  transform: rotate(180deg);
`

const bottomRight = css`
  position: absolute;
  bottom: 1vh;
  right: 1vh;
`

export default function () {
  const game = useGame<ItsAWonderfulWorld, Move>()
  if (!game)
    return null
  return (
    <Game style={{backgroundImage: `url(${artwork})`, backgroundSize: 'cover'}}>
      <Header/>
      <p>{JSON.stringify(game)}</p>
      {Object.entries(game.players).map(([empire, player]) => (
        <Fragment key={empire}>
          <EmpireCard empire={empire as Empire} position={empire === Empire.PanafricanUnion ? bottomRight : topLeft}/>
          <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65/100} position={empire === Empire.PanafricanUnion ? css`
            bottom: 3vh;
            left: calc(50% - 20vh);
          ` : css`
            transform: rotate(180deg) scale(0.5);
            top: 10vh;
            left: calc(50% - 10vh);
          `}>
            {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
          </Hand>
        </Fragment>
      ))}
    </Game>
  )
}