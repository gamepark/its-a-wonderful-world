import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import {cardStyle, cardWidth} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'
import {developmentCards} from './Developments'
import {drawPileCardX, drawPileCardY, drawPileMaxSize, drawPileScale} from './DrawPile'

const DiscardPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  return (
    <Fragment>
      {game.discard.slice(-discardPileMaxSize).map((card, index) => <DevelopmentCard key={index} development={developmentCards[card]} css={[cardStyle, css`
        position: absolute;
        left: ${discardPileCardX(index)}%;
        top: ${discardPileCardY(index)}%;
        transform: scale(${discardPileScale});
        & > img {
          box-shadow: 0 0 3px black;
        }
      `]}/>)}
    </Fragment>
  )
}

export const discardPileMaxSize = drawPileMaxSize
export const discardPileScale = drawPileScale
export const discardPileCardX = (index: number) => drawPileCardX(index) + cardWidth * drawPileScale + 1
export const discardPileCardY = drawPileCardY

export default DiscardPile