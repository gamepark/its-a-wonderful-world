import {css} from '@emotion/core'
import {Draggable, useAnimation, usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {useDrop} from 'react-dnd'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import DevelopmentCard, {height as cardHeight, ratio as cardRatio, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import EmpireName from '../material/empires/EmpireName'
import ChooseDevelopmentCard, {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'
import {numberOfCardsToDraft} from '../Rules'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import screenRatio from '../util/screenRatio'
import {constructedCardLeftMargin} from './ConstructedCardsArea'
import {bottomMargin} from './DisplayedEmpire'
import {popupBackgroundStyle} from '../util/Styles'
import {isPlayer} from '../types/typeguards'
import {slateForConstruction} from '../moves/SlateForConstruction'
import {recycle} from '../moves/Recycle'
import {useTranslation} from 'react-i18next'

const DraftArea: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const {t} = useTranslation()
  const row = game.phase === Phase.Draft ? 1 : 0
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const [focusedCard, setFocusedCard] = useState<number>()
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation =>
    animation.move.type === MoveType.ChooseDevelopmentCard && animation.move.playerId === player.empire && !animation.undo)
  const chosenCard = player.chosenCard || (choosingDevelopment ? choosingDevelopment.move.card || true : undefined)
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_HAND,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_HAND,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(player.empire, item.card))
  })
  useEffect(() => {
    if ( focusedCard !== player.chosenCard && !player.draftArea.some(card => card === focusedCard)) {
      setFocusedCard(undefined)
    }
  }, [player, focusedCard])
  return (
    <>
      {focusedCard !== undefined &&
      <>
          <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        {isPlayer(player) && game.phase === Phase.Planning &&
        <>
            <button css={draftConstructionButton} onClick={() => play(slateForConstruction(player.empire,focusedCard))}>
              {t('Construire')}
            </button>
            <button css={draftRecyclingButton} onClick={() => play(recycle(player.empire,focusedCard))}>
              {t('Recycler')}
            </button>
        </>
        }
      </>
      }
      <div ref={ref} css={getDraftAreaStyle(row, game.players.length === 2, isValidTarget, isOver)}>
        {!player.draftArea.length && <span css={draftAreaText}>{t('Zone de draft')}</span>}
      </div>
      {player.draftArea.map((card, index) => (
        <Draggable key={card} item={developmentFromDraftArea(card)} css={getAreaCardStyle(row, index, focusedCard === card)}
                   disabled={playerId !== player.empire || game.phase !== Phase.Planning}
                   animation={{properties: ['bottom', 'left', 'transform', 'z-index'], seconds: 0.2}}>
          <DevelopmentCard development={developmentCards[card]} css={css`height: 100%;`} onClick={() => setFocusedCard(card)}/>
        </Draggable>
      ))}
      {chosenCard && <DevelopmentCard development={chosenCard !== true ? developmentCards[chosenCard] : undefined}
                                      css={[getAreaCardStyle(row, player.draftArea.length,focusedCard === chosenCard), choosingDevelopment && css`opacity: 0;`]}
                                      onClick={() => typeof chosenCard == 'number' && setFocusedCard(chosenCard)} />}
    </>
  )
}

export const areasLeftPosition = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin

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

export const getAreaCardStyle = (row: number, index: number, focused = false, totalCards = numberOfCardsToDraft, fullWidth = false) => css`
  position: absolute;
  width: ${cardWidth}%;
  height: ${cardHeight}%;
  ${getAreaCardBottomPosition(row)};
  ${getAreaCardLeftPosition(index, totalCards, fullWidth)};
  ${focused ? getFocusTransform() : css`z-index: 1`};
`

export const getAreaCardLeftPosition = (index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => css`
  left: ${getAreaCardLeft(index, totalCards, fullWidth)}%;
`

export const getAreaCardLeft = (index: number, totalCards = numberOfCardsToDraft, fullWidth = false) => {
  let leftShift = cardsShift
  if (fullWidth) {
    if (totalCards > 9) {
      const width = 100 - areasLeftPosition - cardHeight * cardRatio / screenRatio - 2
      leftShift = width / (totalCards - 1)
    }
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
  z-index: 100;
  transform: translate(-50%, 50%) scale(3);
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
const draftConstructionButton = css`
  position: absolute;
  z-index: 100;
  bottom: 51%;
  right: ${51 + cardWidth * 1.5}%;
  box-shadow: inset 0 0.1vh 0 0 #ffffff;
  background: #ededed linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
  border-radius: 2vh;
  border: 0.1vh solid #dcdcdc;
  color: #333333;
  padding: 0 2vh 0 1vh;
  font-size: 4.8vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  &:hover, &:focus {
    outline:0;
    background: #dfdfdf linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
  }
  &:active {
    transform: translateY(1px);
  }
`

const draftRecyclingButton = css`
  position: absolute;
  z-index: 100;
  top: 51%;
  right: ${51 + cardWidth * 1.5}%;
  box-shadow: inset 0 0.1vh 0 0 #ffffff;
  background: #ededed linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
  border-radius: 2vh;
  border: 0.1vh solid #dcdcdc;
  color: #333333;
  padding: 0 2vh 0 1vh;
  font-size: 4.8vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  &:hover, &:focus {
    outline:0;
    background: #dfdfdf linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
  }
  &:active {
    transform: translateY(1px);
  }
`


export default DraftArea