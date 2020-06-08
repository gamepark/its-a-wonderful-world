import {css} from '@emotion/core'
import React, {FunctionComponent, useState} from 'react'
import GameView from '../../types/GameView'
import {cardStyle, cardWidth} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'
import DevelopmentCardsCatalog from './DevelopmentCardsCatalog'
import {developmentCards} from './Developments'
import {drawPileCardX, drawPileCardY, drawPileMaxSize, drawPileScale} from './DrawPile'

const DiscardPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  const [displayCatalog, setDisplayCatalog] = useState(false)
  return (
    <>
      {displayCatalog &&
      <DevelopmentCardsCatalog developments={game.discard.map(card => developmentCards[card])} onClose={() => setDisplayCatalog(false)}/>
      }
      {game.discard.slice(-discardPileMaxSize).map((card, index) =>
        <DevelopmentCard key={index} development={developmentCards[card]} onClick={() => setDisplayCatalog(true)}
                         css={[cardStyle, getCardStyle(index)]}/>)}
    </>
  )
}

export const discardPileMaxSize = drawPileMaxSize
export const discardPileScale = drawPileScale
export const discardPileCardX = (index: number) => drawPileCardX(index) + cardWidth * drawPileScale + 1
export const discardPileCardY = drawPileCardY

const getCardStyle = (index: number) => css`
  position: absolute;
  left: ${discardPileCardX(index)}%;
  top: ${discardPileCardY(index)}%;
  transform: scale(${discardPileScale});
  & > img {
    box-shadow: 0 0 3px black;
  }
`

export default DiscardPile