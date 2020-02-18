import {css} from '@emotion/core'
import React from 'react'
import {useGame} from 'tabletop-game-workshop'
import ItsAWonderfulWorld from '../../ItsAWonderfulWorld'
import board from './board.png'
import DevelopmentCard from '../developments/DevelopmentCard'
import roundTracker1 from './round-tracker-1-3.png'
import roundTracker2 from './round-tracker-2-4.png'

const height = '30vh'
const ratio = 2.817

const Board = () => {
  const game = useGame<ItsAWonderfulWorld>()
  return (
    <div css={css`
       background-image: url('${board}');
       background-size: cover;
       height: ${height};
       position: absolute;
       top: 17vh;
       width: calc(${ratio} * ${height});
       left: calc(50% - 2.7 * ${height} / 2);
       margin: auto;
       filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
      `}>
      <img alt={'Round tracker'} src={game.round % 2 ? roundTracker1 : roundTracker2} css={css`
        position: absolute;
        height: 3.5vh;
        top: 1vh;
        left: ${game.round == 1 ? 30.7 : game.round == 2 ? 34 : game.round == 3 ? 42.4 : 45.7}vh;
      `}/>
      {game.deck.slice(-8).map((development, index) => <DevelopmentCard key={index} css={css`
        position: absolute;
        top: -${14.8 + index * 0.1}vh;
        left: ${13.8 + index * 0.1}vh;
        transform: rotate(90deg) scale(0.66);
      `}/>)}
      {game.discard.slice(-8).map((development, index) => <DevelopmentCard key={index} development={development} css={css`
        position: absolute;
        top: -${14.8 + index * 0.1}vh;
        left: ${52 + index * 0.1}vh;
        transform: rotate(90deg) scale(0.66);
      `}/>)}
    </div>
  )
}

export default Board