import {css} from '@emotion/core'
import React, {FunctionComponent, useState} from 'react'
import GameView from '../../types/GameView'
import {cardHeight, cardStyle, cardWidth} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'
import DevelopmentCardsCatalog, {swipeableScale} from './DevelopmentCardsCatalog'
import {developmentCards} from './Developments'
import {drawPileCardX, drawPileCardY, drawPileMaxSize, drawPileScale} from './DrawPile'
import {useTranslation} from 'react-i18next'

const DiscardPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  const [displayCatalog, setDisplayCatalog] = useState(false)
  const discardLength = game.discard.length
  const {t} = useTranslation()
  return (
    <>
      {displayCatalog &&
        <>
      <DevelopmentCardsCatalog developments={game.discard.map(card => developmentCards[card])} onClose={() => setDisplayCatalog(false)}/>
      <h1 css={discardLengthStyle}>{t('Nombre de cartes dans la Défausse : ')}{discardLength}</h1>
      </>
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
const discardTitle = 51 + cardHeight * swipeableScale / 2

const getCardStyle = (index: number) => css`
  position: absolute;
  left: ${discardPileCardX(index)}%;
  top: ${discardPileCardY(index)}%;
  transform: scale(${discardPileScale});
  & > img {
    box-shadow: 0 0 3px black;
  }
`
const discardLengthStyle = css`
  position: absolute;
  width:100%;
  text-align:center;
  top: ${discardTitle}%;
  z-index: 101;
  color:#EEE;
  text-shadow: 0 0 2px black;
  font-size:5vh;
`

export default DiscardPile