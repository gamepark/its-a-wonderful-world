import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import {cardHeight, cardStyle, cardWidth, headerHeight, topMargin} from '../../util/Styles'
import DevelopmentCard from '../developments/DevelopmentCard'
import ReactTooltip from 'react-tooltip'
import {useTranslation} from 'react-i18next'
import {developmentCards} from './Developments'

const DrawPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
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
    <div css={drawPileTooltip} data-tip data-for='sadFace'></div>
    <ReactTooltip id='sadFace' type='warning' effect='solid' place='left' >
      <span>{t('Nb de cartes : ') + game.deck + '/' +  developmentCards.length }  </span>
    </ReactTooltip>
  </>
}

export const drawPileMaxSize = 8
export const drawPileScale = 0.4
export const drawPileCardX = (index: number) => 10 + index * 0.05
export const drawPileCardY = (index: number) => headerHeight + topMargin + cardHeight * (drawPileScale - 1) / 2 + index * 0.05

const drawPileTooltip = css`
  position: absolute;
  top: ${drawPileCardY(0)}%;
  left: ${drawPileCardX(0)}%;
  width: ${cardWidth + drawPileMaxSize*0.05}%;
  height: ${cardHeight}%;
  transform: scale(${drawPileScale});
`

export default DrawPile