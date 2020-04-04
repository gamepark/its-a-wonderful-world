import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Draggable, useDrop, useGame, usePlay} from 'tabletop-game-workshop'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import ItsAWonderfulWorld, {Phase, Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import {numberOfCardsToDraft} from '../rules'
import screenRatio from '../util/screenRatio'
import {constructedCardLeftMargin} from './ConstructedCardsArea'

const DraftArea: FunctionComponent<{ player: Player }> = ({player}) => {
  const game = useGame<ItsAWonderfulWorld>()
  const row = game.phase == Phase.Draft ? 1 : 0
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_HAND,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_HAND,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(player.empire, item.card))
  })
  return (
    <Fragment>
      <div ref={ref} css={getDraftAreaStyle(row, game.players.length == 2, isValidTarget, isOver)}>
        {!player.draftArea.length && <span css={draftAreaText}>Zone de draft</span>}
      </div>
      {player.draftArea.map((card, index) => (
        <Draggable key={index} item={developmentFromDraftArea(card)} css={getAreaCardStyle(row, index)}>
          <DevelopmentCard development={developmentCards[card]} css={css`height: 100%;`}/>
        </Draggable>
      ))}
      {player.chosenCard && <DevelopmentCard development={player.chosenCard != true ? developmentCards[player.chosenCard] : null}
                                             css={getAreaCardStyle(row, player.draftArea.length)}/>}
    </Fragment>
  )
}

export const areasLeftPosition = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + 3

const getDraftAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(0, 255, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: green;
  ${getAreasStyle(row, fullWidth, isValidTarget)};
`

const border = 0.3

export const cardsShift = cardHeight * cardRatio / screenRatio + 1

export const getAreasStyle = (row: number, fullWidth: boolean, isValidTarget = false) => css`
  position: absolute;
  height: ${cardHeight + border * 10}%;
  bottom: ${getAreaCardBottom(row) - border * 5}%;
  left: ${areasLeftPosition - border * 5 / screenRatio}%;
  right: ${fullWidth ? '1%' : 'auto'};
  width: ${fullWidth ? 'auto' : (cardsShift * numberOfCardsToDraft + 1) + '%'};
  border-radius: ${border * 5}vh;
  border-style: dashed;
  border-width: ${border}vh;
  z-index: ${isValidTarget ? 1 : 'auto'};

`

export const getAreaCardStyle = (row: number, index: number, totalCards = numberOfCardsToDraft, fullWidth = false, focused = false) => css`
  position: absolute;
  height: ${cardHeight}%;
  will-change: bottom, left, transform !important;
  transition-property: bottom, left, transform, z-index;
  z-index: 0;
  ${getAreaCardBottomPosition(row)}
  ${getAreaCardLeftPosition(index, totalCards, fullWidth)};
  ${focused && getFocusTransform()}
`

export const getAreaCardLeftPosition = (index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => css`
  left: ${getAreaCardLeft(index, totalCards, fullWidth)}%;
`

const getAreaCardLeft = (index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => {
  let leftShift = cardsShift
  if (fullWidth && totalCards > 9) {
    const width = 100 - areasLeftPosition - cardHeight * cardRatio / screenRatio - 2
    leftShift = width / (totalCards - 1)
  } else if (totalCards > numberOfCardsToDraft) {
    leftShift = cardsShift * (numberOfCardsToDraft - 1) / (totalCards - 1)
  }
  return areasLeftPosition + index * leftShift
}

export const getAreaCardBottomPosition = (row: number) => css`
  bottom: ${getAreaCardBottom(row)}%;
`

const getFocusTransform = () => css`
  bottom: 50%;
  left: 50%;
  z-index: 100 !important;
  transform: translate(-50%, 50%) scale(3) !important;
`

export const getAreaCardBottom = (row: number) => (cardHeight + 4) * row + 3

const draftAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: darkgreen;
  font-size: 4vh;
`

export default DraftArea