import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import {cardHeight, cardStyle, headerHeight, topMargin} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'

const DrawPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  return <>
    {[...Array(Math.min(game.deck, drawPileMaxSize))].map((_, index) => <DevelopmentCard key={index} css={[cardStyle, css`
      position: absolute;
      top: ${drawPileCardY(index)}%;
      left: ${drawPileCardX(index)}%;
      transform: scale(${drawPileScale});
      & > img {
        box-shadow: 0 0 3px black;
      }
    `]}/>)}
  </>
}

export const drawPileMaxSize = 8
export const drawPileScale = 0.4
export const drawPileCardX = (index: number) => 10 + index * 0.05
export const drawPileCardY = (index: number) => headerHeight + topMargin + cardHeight * (drawPileScale - 1) / 2 + index * 0.05

export default DrawPile