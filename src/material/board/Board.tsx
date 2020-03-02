import {css} from '@emotion/core'
import React from 'react'
import {useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld from '../../ItsAWonderfulWorld'
import board from './board.png'
import roundTracker1 from './round-tracker-1-3.png'
import roundTracker2 from './round-tracker-2-4.png'

const Board = () => {
  const game = useGame<ItsAWonderfulWorld>()
  return (
    <div css={css`
       position: absolute;
       height: 34%;
       top: 9%;
       left: 50%;
       transform: translateX(-50%);
      `}>
      <img src={board} css={css`height: 100%; filter: drop-shadow(0.1vh 0.1vh 0.5vh black);`}/>
      <img alt={'Round tracker'} src={game.round % 2 ? roundTracker1 : roundTracker2} css={css`
        position: absolute;
        height: 10%;
        top: 4.1%;
        left: ${game.round == 1 ? 36.65 : game.round == 2 ? 40.6 : game.round == 3 ? 50.4 : 54.35}%;
      `}/>
    </div>
  )
}

export default Board