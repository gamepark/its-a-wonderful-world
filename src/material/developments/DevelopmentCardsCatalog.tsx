import {css} from '@emotion/core'
import React, {FunctionComponent, useState} from 'react'
import {Swipeable} from 'react-swipeable'
import {cardHeight, cardWidth, popupBackgroundStyle} from '../../util/Styles'
import Development from './Development'
import DevelopmentCard, {cardTitleFontSize} from './DevelopmentCard'

type Props = {
  developments: Development[],
  onClose: () => void
  initialIndex?: number
}

const DevelopmentCardsCatalog: FunctionComponent<Props> = ({initialIndex = 0, onClose, developments}) => {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex)
  const [deltaX, setDeltaX] = useState(0)
  const slide = (deltaX: number, velocity: number) => {
    const diff = Math.round(deltaX * (1 + velocity) / 180)
    setFocusedIndex(Math.max(0, Math.min(focusedIndex + diff, developments.length - 1)))
    setDeltaX(0)
  }
  return (
    <>
      <div css={popupBackgroundStyle} onClick={onClose}/>
      <Swipeable css={swipeZoneStyle} trackMouse={true} preventDefaultTouchmoveEvent={true} delta={3}
                 onSwiping={event => {
                   setDeltaX(event.deltaX);
                   console.log(event.deltaX)
                 }}
                 onSwiped={event => slide(event.deltaX, event.velocity)}>
        {developments.map((development, index) =>
          <DevelopmentCard key={index} development={development} css={[cardStyle, cardPosition(index, focusedIndex, deltaX), deltaX === 0 && cardTransition]}/>
        )}
      </Swipeable>
    </>
  )
}

const scale = 2.5

const swipeZoneStyle = css`
  position: absolute;
  width: 100%;
  height: ${cardHeight * scale}%;
  top: ${50 - cardHeight * scale / 2}%;
`

const cardStyle = css`
  position: absolute;
  left: ${50 - cardWidth * scale / 2}%;
  width: ${cardWidth * scale}%;
  height: 100%;
  z-index: 100;
  & > h3 {
    font-size: ${cardTitleFontSize * scale}vh;
  }
`

const cardPosition = (index: number, focusedIndex: number, deltaX: number) => css`
  transform: translateX(${(index - focusedIndex) * 110}%) translateX(${-deltaX}px);
`

const cardTransition = css`
  transition: transform 1s ease-in-out;
`

export default DevelopmentCardsCatalog