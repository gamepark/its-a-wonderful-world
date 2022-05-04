/** @jsxImportSource @emotion/react */
import {css, Interpolation, Theme} from '@emotion/react'
import DeckType from '@gamepark/its-a-wonderful-world/material/DeckType'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {cardStyle} from '../../util/Styles'
import DevelopmentCard from './DevelopmentCard'

type Props = {
  size: number
  deckType?: DeckType
  position?: Interpolation<Theme>
}

export default function DrawPile({size, deckType = DeckType.Default, position}: Props) {
  const {t} = useTranslation()
  const [showTooltip, setShowTooltip] = useState(false)
  useEffect(() => {
    if (showTooltip) {
      setTimeout(() => setShowTooltip(false), 3000)
    }
  }, [showTooltip])
  return <>
    {[...Array(Math.min(size, drawPileMaxSize))].map((_, index) =>
      <DevelopmentCard key={index} deckType={deckType} css={[position, cardStyle, cardCss(index)]} onClick={() => setShowTooltip(true)}/>
    )}
    <span css={[tooltip, deckType === DeckType.Default ? deckTooltip : ascensionDeckTooltip, !showTooltip && invisible]}>
      {t('cards.count', {cards: size})}
    </span>
  </>
}

export const drawPileMaxSize = 8
export const drawPileScale = 0.4

const cardCss = (index: number) => css`
  transform: scale(${drawPileScale}) translate(${index * 2}%, ${index}%) rotateY(180deg);

  & > img {
    box-shadow: 0 0 3px black;
  }
`

const tooltip = css`
  position: absolute;
  font-size: 3em;
  color: white;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
  top: 3.2em;
  z-index: 1;
  width: 2em;
  text-align: center;
  display: flex;
  justify-content: center;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
`

const deckTooltip = css`
  left: 7.5em;
`

const ascensionDeckTooltip = css`
  left: 13.4em;
`

const invisible = css`
  opacity: 0;
`