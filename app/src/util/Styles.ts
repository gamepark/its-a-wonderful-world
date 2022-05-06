import {css, keyframes, Theme} from '@emotion/react'
import {numberOfCardsToDraft} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Images from '../material/Images'

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
export const playerPanelHeight = (players: number) => players > 5 ? 11.5 : 16.7
export const playerPanelMargin = 1.5
export const areasBorders = 0.3
export const areasCardMargin = 1
export const areaWidth = (cardWidth + areasCardMargin) * numberOfCardsToDraft + 1
export const marginBetweenCardRows = 4
export const areasCardX = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin
export const areasX = areasCardX - areasBorders * 5 / screenRatio
export const constructedCardY = (index: number) => 100 - cardHeight - constructedCardBottomMargin - index * developmentCardVerticalShift
export const playerPanelY = (index: number, players: number) => headerHeight + playerPanelMargin + index * (playerPanelHeight(players) + playerPanelMargin)
export const playerPanelRightMargin = 1
export const charactersPilesY = 91.7
export const financiersPileX = empireCardLeftMargin
export const generalsPileX = 6
export const gameOverDelay = 10

export const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
export const discordUri = 'https://discord.gg/nMSDRag'

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
  border-radius: ${areasBorders * 5}em;
  border-style: solid;
  border-width: ${areasBorders}em;
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

export const glow = (color: string, from = '5px', to = '30px') => keyframes`
  from {
    box-shadow: 0 0 ${from} ${color};
  }
  to {
    box-shadow: 0 0 ${to} ${color};
  }
`

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const empireBackground: Record<EmpireName, string> = {
  [EmpireName.AztecEmpire]: Images.aztecEmpireArtwork,
  [EmpireName.FederationOfAsia]: Images.federationOfAsiaArtwork,
  [EmpireName.NoramStates]: Images.noramStatesArtwork,
  [EmpireName.PanafricanUnion]: Images.panafricanUnionArtwork,
  [EmpireName.RepublicOfEurope]: Images.republicOfEuropeArtwork,
  [EmpireName.NationsOfOceania]: Images.nationsOfOceaniaArtwork,
  [EmpireName.NorthHegemony]: Images.northHegemonyArtwork
}

export const textColor = (theme: Theme) => css`
  color: ${theme.light ? '#333' : '#FFF'};
  fill: ${theme.light ? '#333' : '#FFF'};
`

export const backgroundColor = (theme: Theme) => css`
  &:before {
    background-color: ${theme.light ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 30, 0.7)'};
    transition: background-color 1s ease-in;
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

export const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: all .5s ease;
`
export const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
export const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

export const popupStyle = css`
  position: absolute;
  text-align: center;
  max-height: 70%;
  z-index: 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

  &:hover {
    box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, .5);
  }

  & > h2 {
    font-size: 5em;
    margin: 0;
  }

  & > p {
    font-size: 4em;
    margin: 2% 0;
  }

  & > button {
    font-size: 4em;
  }
`

export const popupPosition = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const popupLightStyle = css`
  background-color: #e9e9e9;
  color: #082b2b;
  border: solid 1em #082b2b;
`

export const popupDarkStyle = css`
  background-color: #082b2b;
  color: #d4f7f7;
  border: solid 1em #d4f7f7;
`
export const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;

  &:hover {
    cursor: pointer;
    color: #26d9d9;
  }
`