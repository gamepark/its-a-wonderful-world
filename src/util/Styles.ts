import {css, keyframes} from '@emotion/core'
import EmpireName from '../material/empires/EmpireName'
import Images from '../material/Images'
import {numberOfCardsToDraft} from '../Rules'

export const screenRatio = 16 / 9
export const boardWidth = 66
export const boardHeight = 23
export const boardTop = 21
export const headerHeight = 7
export const topMargin = 1
export const bottomMargin = 3
export const cardHeight = 23  // percentage of playing area cardHeight
export const cardRatio = 65 / 100
export const cardWidth = cardHeight * cardRatio / screenRatio  // percentage of playing area cardWidth
export const tokenWidth = 4
export const tokenHeight = tokenWidth * screenRatio
export const empireCardRatio = 343 / 400
export const empireCardWidth = 9
export const empireCardHeight = empireCardWidth * empireCardRatio * screenRatio // percentage of playing area cardWidth
export const empireCardLeftMargin = 1
export const empireCardBottomMargin = 10
export const developmentCardVerticalShift = 2.6
export const constructedCardLeftMargin = 1.3
export const constructedCardBottomMargin = empireCardBottomMargin + 12.4
export const playerPanelWidth = 19.5
export const playerPanelHeight = 16.7
export const playerPanelMargin = 1.5
export const areasBorders = 0.3
export const areasCardMargin = 1
export const areaWidth = (cardWidth + areasCardMargin) * numberOfCardsToDraft + 1
export const marginBetweenCardRows = 4
export const areasCardX = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin
export const areasX = areasCardX - areasBorders * 5 / screenRatio
export const constructedCardY = (index: number) => 100 - cardHeight - constructedCardBottomMargin - index * developmentCardVerticalShift
export const playerPanelY = (index: number) => headerHeight + playerPanelMargin + index * (playerPanelHeight + playerPanelMargin)
export const playerPanelRightMargin = 1
export const charactersPilesY = 91.7
export const financiersPileX = empireCardLeftMargin
export const generalsPileX = 6

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
  border-style: solid;
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
export const opacity = (opacity: number) => keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: ${opacity};

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

export const empireBackground: Record<EmpireName, string> = {
  [EmpireName.AztecEmpire]: Images.aztecEmpireArtwork,
  [EmpireName.FederationOfAsia]: Images.federationOfAsiaArtwork,
  [EmpireName.NoramStates]: Images.noramStatesArtwork,
  [EmpireName.PanafricanUnion]: Images.panafricanUnionArtwork,
  [EmpireName.RepublicOfEurope]: Images.republicOfEuropeArtwork
}
