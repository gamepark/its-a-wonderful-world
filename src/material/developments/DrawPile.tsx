import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import {areasCardX, cardStyle} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'

const DrawPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  return <>
    {[...Array(Math.min(game.deck, 8))].map((_, index) => <DevelopmentCard key={index} css={[cardStyle, css`
      position: absolute;
      top: ${8 + index * 0.05}%;
      left: ${areasCardX - 0.6 + index * 0.05}%;
      transform-origin: top left;
      transform: scale(0.4);
      & > img {
        box-shadow: 0 0 3px black;
      }
    `]}/>)}
  </>
}

export default DrawPile