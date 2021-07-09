/** @jsxImportSource @emotion/react */
import {css, Interpolation, Theme} from '@emotion/react'
import DeckType from '@gamepark/its-a-wonderful-world/material/DeckType'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import {useTranslation} from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import {cardHeight, cardStyle, cardWidth} from '../../util/Styles'
import DevelopmentCard from './DevelopmentCard'

type Props = {
  size: number
  deckType?: DeckType
  position?: Interpolation<Theme>
}

export default function DrawPile({size, deckType = DeckType.Default, position}: Props) {
  const {t} = useTranslation()
  const nbCards = developmentCards.length
  return <>
    {[...Array(Math.min(size, drawPileMaxSize))].map((_, index) =>
      <DevelopmentCard key={index} deckType={deckType} css={[position, cardStyle, cardCss(index)]}/>
    )}
    <div css={[position, drawPileTooltip]} data-tip/>
    <ReactTooltip type="warning" effect="solid" place="left">
      <span>{t('Number of cards: {nbDeck}/{nbCards}', {nbDeck: size, nbCards})}  </span>
    </ReactTooltip>
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

const drawPileTooltip = css`
  width: ${cardWidth + drawPileMaxSize * 0.05}%;
  height: ${cardHeight}%;
  transform: scale(${drawPileScale});
`