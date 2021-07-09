/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import DeckType from '@gamepark/its-a-wonderful-world/material/DeckType'
import Development, {getDevelopmentDetails} from '@gamepark/its-a-wonderful-world/material/Development'
import {forwardRef, HTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../Images'
import {getDevelopmentDisplay} from './DevelopmentDisplay'

type Props = {
  deckType?: DeckType
  development?: Development
} & HTMLAttributes<HTMLDivElement>

const DevelopmentCard = forwardRef<HTMLDivElement, Props>(({deckType, development, ...props}, ref) => {
  const {t} = useTranslation()
  return (
    <div ref={ref} {...props} css={[style, backgroundCss(deckType ?? getDevelopmentDetails(development!).deck), development === undefined && hidden]}>
      <div css={[frontFace, development && backgroundImage(getDevelopmentDisplay(development).image)]}>
        {development && <h3 css={cardTitle}>{getDevelopmentDisplay(development).title(t)}</h3>}
      </div>
    </div>
  )
})

const style = css`
  height: 100%;
  border-radius: 6% / ${65 / 100 * 6}%;
  box-shadow: 0 0 5px black;
  transform-style: preserve-3d;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6% / ${65 / 100 * 6}%;
    background-size: cover;
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }
`

const backgroundCss = (deckType: DeckType) => css`
  &:after {
    background-image: url(${backfaceImage(deckType)});
  }
`

const backfaceImage = (deckType: DeckType) => {
  switch (deckType) {
    case DeckType.Default:
      return Images.developmentBack
    case DeckType.Ascension:
      return Images.ascensionBack
  }
}

const hidden = css`
  transform: rotateY(180deg);
`

const frontFace = css`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  border-radius: 6% / ${65 / 100 * 6}%;
  // noinspection CssInvalidPropertyValue
  image-rendering: -webkit-optimize-contrast;
`

const backgroundImage = (image: string) => css`
  background-image: url(${image});
`

export const cardTitleFontSize = 0.9

const cardTitle = css`
  position: absolute;
  top: 1.4%;
  left: 19%;
  width: 68%;
  text-align: center;
  color: #EEE;
  font-size: ${cardTitleFontSize}em;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform: uppercase;
`

export default DevelopmentCard