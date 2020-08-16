import {css} from '@emotion/core'
import React, {FunctionComponent, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Swipeable} from 'react-swipeable'
import Images from '../../material/Images'
import {cardHeight, cardWidth, popupBackgroundStyle} from '../../util/Styles'
import Development from './Development'
import DevelopmentCard, {cardTitleFontSize} from './DevelopmentCard'

type Props = {
  developments: Development[],
  onClose: () => void
  initialIndex?: number
}

const DevelopmentCardsCatalog: FunctionComponent<Props> = ({initialIndex = 0, onClose, developments}) => {
  const {t} = useTranslation()
  const [focusedIndex, setFocusedIndex] = useState(initialIndex)
  const [deltaX, setDeltaX] = useState(0)
  const slide = (deltaX: number, velocity: number) => {
    const diff = Math.round(deltaX * (1 + velocity) / 180)
    setFocusedIndex(Math.max(0, Math.min(focusedIndex + diff, developments.length - 1)))
    setDeltaX(0)
  }
  const discardLength = developments.length
  const disableLeftArrow = focusedIndex === 0
  const disableRightArrow = focusedIndex >=  ( developments.length - 1)
  return (
    <>
      <div css={popupBackgroundStyle} onClick={onClose}/>
      {discardLength > 3 && <button disabled={disableLeftArrow} css={[arrowStyle,leftArrowStyle]} onClick={() => slide(-manualShift,3)} title={t('Faire défiler les cartes' )}/>}
      <Swipeable css={swipeZoneStyle} trackMouse={true} preventDefaultTouchmoveEvent={true} delta={3}
                 onSwiping={event => setDeltaX(event.deltaX)}
                 onSwiped={event => slide(event.deltaX, event.velocity)}>
        {developments.map((development, index) =>
          <DevelopmentCard key={index} development={development} css={[cardStyle, cardPosition(index, focusedIndex, deltaX), deltaX === 0 && cardTransition]}/>
        )}
      </Swipeable>
      {discardLength > 3 && <button disabled={disableRightArrow} css={[arrowStyle,rightArrowStyle]} onClick={() => slide(manualShift,3)} title={t('Faire défiler les cartes' )}/>}
    </>
  )
}

export const swipeableScale = 2.5
const manualShift = cardWidth * swipeableScale * 6

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
    cursor:pointer;
  }
  &:disabled {
    display:none;
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
  right:0;
  &:active {
    transform: translateX(2px);
  }
`

const cardPosition = (index: number, focusedIndex: number, deltaX: number) => css`
  transform: translateX(${(index - focusedIndex) * 110}%) translateX(${-deltaX}px);
`
const cardTransition = css`
  transition: transform 1s ease-in-out;
`

export default DevelopmentCardsCatalog