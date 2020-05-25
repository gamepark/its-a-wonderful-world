import {css, keyframes} from '@emotion/core'
import {numberOfCardsToDraft} from '../Rules'

export const screenRatio = 16 / 9
export const headerHeight = 7
export const topMargin = 1
export const bottomMargin = 3
export const cardHeight = 23  // percentage of playing area cardHeight
export const cardRatio = 65 / 100
export const cardWidth = cardHeight * cardRatio / screenRatio  // percentage of playing area cardWidth
export const empireCardHorizontalShift = 0.44
export const empireCardVerticalShift = 0.9
export const developmentCardVerticalShift = 2.5
export const constructedCardLeftMargin = cardHeight * empireCardHorizontalShift / screenRatio - 5
export const playerPanelWidth = 20
export const playerPanelHeight = 16.7
export const playerPanelMargin = 1.5
export const areasBorders = 0.3
export const areasCardMargin = 1
export const areaWidth = (cardWidth + areasCardMargin) * numberOfCardsToDraft + 1
export const marginBetweenCardRows = 4
export const areasCardX = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin
export const areasX = areasCardX - areasBorders * 5 / screenRatio

export const cardStyle = css`
  width: ${cardWidth}%;
  height: ${cardHeight}%;
`

export const getAreaCardX = (index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => {
  let leftShift = cardWidth + areasCardMargin
  if (fullWidth) {
    if (totalCards > 9) {
      const width = 100 - areasCardX - cardHeight * cardRatio / screenRatio - 2
      leftShift = width / (totalCards - 1)
    }
  } else if (totalCards > numberOfCardsToDraft) {
    leftShift = leftShift * (numberOfCardsToDraft - 1) / (totalCards - 1)
  }
  return areasCardX + index * leftShift
}

export const getAreaCardY = (row: number) => 100 - cardHeight - bottomMargin - (cardHeight + marginBetweenCardRows) * row

export const getAreasStyle = (row: number, fullWidth: boolean, isValidTarget = false) => css`
  position: absolute;
  width: ${fullWidth ? 'auto' : `${areaWidth}%`};
  height: ${cardHeight + areasBorders * 10}%;
  left: ${areasX}%;
  right: ${fullWidth ? '1%' : 'auto'};
  top: ${getAreaCardY(row) - areasBorders * 5}%;
  border-radius: ${areasBorders * 5}vh;
  border-style: dashed;
  border-width: ${areasBorders}vh;
  z-index: ${isValidTarget ? 10 : 'auto'};
`

export const areaCardStyle = css`
  position: absolute;
  z-index: 1;
`

export const getAreaCardTransform = (row: number, index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => css`
  transform: translate(${getAreaCardX(index, totalCards, fullWidth) * 100 / cardWidth}%, ${getAreaCardY(row) * 100 / cardHeight}%)
`

export const getCardFocusTransform = css`
  z-index: 100;
  transform: translate(${50 * 100 / cardWidth - 50}%, ${50 * 100 / cardHeight - 50}%) scale(3) !important;
`

export const glow = (color: string) => keyframes`
  from {
    box-shadow: 0 0 5px ${color};
  }
  to {
    box-shadow: 0 0 30px ${color};
  }
`

export const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`
