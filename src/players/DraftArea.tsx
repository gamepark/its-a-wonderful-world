import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Draggable, useDrop, useGame, usePlay} from 'tabletop-game-workshop'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import ItsAWonderfulWorld, {Phase, Player} from '../ItsAWonderfulWorld'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio} from '../material/developments/DevelopmentCard'
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
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(player.empire, item.index))
  })
  return (
    <Fragment>
      <div ref={ref} css={getDraftAreaStyle(row, game.players.length == 2, isValidTarget, isOver)}>
        {!player.draftArea.length && <span css={draftAreaText}>Zone de draft</span>}
      </div>
      {player.draftArea.map((development, index) => (
        <Draggable key={index} item={developmentFromDraftArea(index)} css={getAreaCardStyle(row, index)}>
          <DevelopmentCard development={development}/>
        </Draggable>
      ))}
      {player.chosenCard && <DevelopmentCard development={player.chosenCard != true ? player.chosenCard : null}
                                             css={getAreaCardStyle(row, player.draftArea.length)}/>}
    </Fragment>
  )
}

export const areasLeftPosition = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + 3

const getDraftAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(0, 255, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: green;
  ${getAreasStyle(row, fullWidth)};
`

const border = 0.3

export const cardsShift = cardHeight * cardRatio / screenRatio + 1

export const getAreasStyle = (row: number, fullWidth: boolean) => css`
  position: absolute;
  height: ${cardHeight + border * 10}%;
  bottom: ${getAreaCardBottom(row) - border * 5}%;
  left: ${areasLeftPosition - border * 5 / screenRatio}%;
  right: ${fullWidth ? '1%' : 'auto'};
  width: ${fullWidth ? 'auto' : (cardsShift * numberOfCardsToDraft + 1) + '%'};
  border-radius: ${border * 5}vh;
  border-style: dashed;
  border-width: ${border}vh;

`

export const getAreaCardStyle = (row: number, index: number) => css`
  position: absolute;
  height: ${cardHeight}%;
  ${getAreaCardBottomPosition(row)}
  ${getAreaCardLeftPosition(index)};
`

export const getAreaCardLeftPosition = (index: number) => css`
  left: ${areasLeftPosition + index * cardsShift}%;
`

export const getAreaCardBottomPosition = (row: number) => css`
  bottom: ${getAreaCardBottom(row)}%;
  will-change: bottom;
  transition: bottom 1s ease-in-out;
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