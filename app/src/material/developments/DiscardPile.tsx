/** @jsxImportSource @emotion/react */
import {css, Interpolation, Theme} from '@emotion/react'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {cardHeight, cardStyle, cardWidth, headerHeight, topMargin} from '../../util/Styles'
import DevelopmentCard from './DevelopmentCard'
import DevelopmentCardsCatalog, {swipeableScale} from './DevelopmentCardsCatalog'
import {drawPileMaxSize, drawPileScale} from './DrawPile'

type Props = {
  discard: number[]
  position?: Interpolation<Theme>
}

export default function DiscardPile({discard, position}: Props) {
  const [displayCatalog, setDisplayCatalog] = useState(false)
  const discardLength = discard.length
  const {t} = useTranslation()
  return (
    <>
      {displayCatalog &&
      <>
        <DevelopmentCardsCatalog developments={discard.map(card => developmentCards[card])} onClose={() => setDisplayCatalog(false)}/>
        <h2 css={discardLengthStyle}>{t('There is {discardLength} cards in the discard pile.', {discardLength})}</h2>
      </>
      }
      {discard.slice(-discardPileMaxSize).map((card, index) =>
        <DevelopmentCard key={index} development={developmentCards[card]} onClick={() => setDisplayCatalog(true)}
                         css={[position, cardStyle, getCardStyle(index)]}/>)}
    </>
  )
}

export const discardPileMaxSize = drawPileMaxSize
export const discardPileScale = drawPileScale
export const discardPileCardX = (index: number) => 10 + index * 0.05 + cardWidth * drawPileScale + 1
export const discardPileCardY = (index: number) => headerHeight + topMargin + cardHeight * (drawPileScale - 1) / 2 + index * 0.05
const discardTitle = 51 + cardHeight * swipeableScale / 2

const getCardStyle = (index: number) => css`
  transform: scale(${discardPileScale}) translate(${index * 2}%, ${index}%);

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