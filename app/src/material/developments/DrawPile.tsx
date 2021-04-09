/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import {useTranslation} from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import {cardHeight, cardStyle, cardWidth, headerHeight, topMargin} from '../../util/Styles'
import DevelopmentCard from './DevelopmentCard'

type Props = { game: GameView }

export default function DrawPile({game}: Props) {
  const {t} = useTranslation()
  const nbDeck = game.deck
  const nbCards = developmentCards.length
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
    <div css={drawPileTooltip} data-tip/>
    <ReactTooltip type="warning" effect="solid" place="left">
      <span>{t('Number of cards: {nbDeck}/{nbCards}', {nbDeck, nbCards})}  </span>
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
  width: ${cardWidth + drawPileMaxSize * 0.05}%;
  height: ${cardHeight}%;
  transform: scale(${drawPileScale});
`