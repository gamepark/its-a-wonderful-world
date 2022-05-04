/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Development from '@gamepark/its-a-wonderful-world/material/Development'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSwipeable} from 'react-swipeable'
import {cardHeight, cardWidth, popupBackgroundStyle} from '../../util/Styles'
import Images from '../Images'
import DevelopmentCard, {cardTitleFontSize} from './DevelopmentCard'

type Props = {
  developments: Development[],
  onClose: () => void
  initialIndex?: number
}

export default function DevelopmentCardsCatalog({initialIndex = 0, onClose, developments}: Props) {
  const {t} = useTranslation()
  const [focusedIndex, setFocusedIndex] = useState(initialIndex)
  const discardLength = developments.length
  const disableLeftArrow = focusedIndex === 0
  const disableRightArrow = focusedIndex >= (developments.length - 1)
  const swipeable = useSwipeable({
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    onSwipedLeft: () => setFocusedIndex(index => Math.min(index + 3, developments.length - 1)),
    onSwipedRight: () => setFocusedIndex(index => Math.max(index - 3, 0)),
  })
  return (
    <>
      <div css={popupBackgroundStyle} onClick={onClose}/>
      {discardLength > 3 &&
      <button disabled={disableLeftArrow} css={[arrowStyle, leftArrowStyle]}
              onClick={() => setFocusedIndex(index => Math.max(index - 3, 0))}
              title={t('Swipe cards')}/>}
      <div css={swipeZoneStyle}>
        <div {...swipeable}>
          {developments.map((development, index) =>
            <DevelopmentCard key={index} development={development}
                             css={[cardStyle, cardPosition(index, focusedIndex), cardTransition]}/>
          )}
        </div>
      </div>
      {discardLength > 3 &&
      <button disabled={disableRightArrow} css={[arrowStyle, rightArrowStyle]}
              onClick={() => setFocusedIndex(index => Math.min(index + 3, developments.length - 1))}
              title={t('Swipe cards')}/>}
    </>
  )
}

export const swipeableScale = 2.5

const swipeZoneStyle = css`
  position: absolute;
  width: 100%;
  height: ${cardHeight * swipeableScale}%;
  top: ${50 - cardHeight * swipeableScale / 2}%;
`

const cardStyle = css`
  position: absolute;
  left: ${50 - cardWidth * swipeableScale / 2}%;
  width: ${cardWidth * swipeableScale}%;
  height: 100%;
  z-index: 100;

  h3 {
    font-size: ${cardTitleFontSize * swipeableScale}em;
  }
`
const arrowStyle = css`
  position: absolute;
  top: 38em;
  width: 20em;
  height: 24em;
  z-index: 101;
  background-image: url(${Images.arrowWhite});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  filter: drop-shadow(0.1em 0.1em 0.5em black);

  &:focus {
    outline: 0;
  }

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    display: none;
  }
`

const leftArrowStyle = css`
  left: 0;
  transform: scaleX(-1);

  &:active {
    transform: scaleX(-1) translateX(2px);
  }
`

const rightArrowStyle = css`
  right: 0;

  &:active {
    transform: translateX(2px);
  }
`

const cardPosition = (index: number, focusedIndex: number) => css`
  transform: translateX(${(index - focusedIndex) * 110}%);
`
const cardTransition = css`
  transition: transform 0.5s ease-in-out;
`