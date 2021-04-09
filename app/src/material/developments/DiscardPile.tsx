/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {cardHeight, cardStyle, cardWidth} from '../../util/Styles'
import DevelopmentCard from './DevelopmentCard'
import DevelopmentCardsCatalog, {swipeableScale} from './DevelopmentCardsCatalog'
import {drawPileCardX, drawPileCardY, drawPileMaxSize, drawPileScale} from './DrawPile'

type Props = { game: GameView }

export default function DiscardPile({game}: Props) {
  const [displayCatalog, setDisplayCatalog] = useState(false)
  const discardLength = game.discard.length
  const {t} = useTranslation()
  return (
    <>
      {displayCatalog &&
      <>
        <DevelopmentCardsCatalog developments={game.discard.map(card => developmentCards[card])} onClose={() => setDisplayCatalog(false)}/>
        <h2 css={discardLengthStyle}>{t('There is {discardLength} cards in the discard pile.', {discardLength})}</h2>
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
  width: 100%;
  text-align: center;
  top: ${discardTitle}%;
  z-index: 101;
  color: #EEE;
  text-shadow: 0 0 2px black;
  font-size: 5em;
`