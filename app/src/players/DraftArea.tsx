/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {getMovesToBuild} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {developmentCards, getCardDetails} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import ChooseDevelopmentCard, {
  chooseDevelopmentCardMove, ChooseDevelopmentCardView, isChooseDevelopmentCard, isChosenDevelopmentCardVisible
} from '@gamepark/its-a-wonderful-world/moves/ChooseDevelopmentCard'
import CompleteConstruction, {isCompleteConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import MoveView from '@gamepark/its-a-wonderful-world/moves/MoveView'
import Recycle, {isRecycle, recycleMove} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import SlateForConstruction, {isSlateForConstruction, slateForConstructionMove} from '@gamepark/its-a-wonderful-world/moves/SlateForConstruction'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useAnimation, usePlay, usePlayerId, useUndo} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {discardPileCardX, discardPileCardY, discardPileMaxSize, discardPileScale} from '../material/developments/DiscardPile'
import FocusedDevelopmentOptions from '../material/developments/FocusedDevelopmentOptions'
import DragItemType from '../material/DragItemType'
import Images from '../material/Images'
import Button from '../util/Button'
import {
  areaCardStyle, cardHeight, cardStyle, cardWidth, getAreaCardTransform, getAreaCardX, getAreaCardY, getAreasStyle, getCardFocusTransform, playerPanelMargin,
  playerPanelWidth, popupBackgroundStyle
} from '../util/Styles'

type DropItem = { card: number }

type Props = { game: GameView, player: Player | PlayerView }

export default function DraftArea({game, player}: Props) {
  const {t} = useTranslation()
  const row = game.phase === Phase.Draft ? 1 : 0
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const [, canUndo] = useUndo<MoveView>()
  const [focusedCard, setFocusedCard] = useState<number>()
  const animation = useAnimation<ChooseDevelopmentCard | ChooseDevelopmentCardView | SlateForConstruction | Recycle>(animation =>
    (isChooseDevelopmentCard(animation.move) || isSlateForConstruction(animation.move) || isRecycle(animation.move))
    && animation.move.playerId === player.empire
  )
  const choosingDevelopment = animation && !animation.action.cancelled && isChooseDevelopmentCard(animation.move) ? animation.move : undefined
  const slatingForConstruction = animation && !animation.action.cancelled && isSlateForConstruction(animation.move) ? animation.move : undefined
  const undoingSlateForConstruction = animation && animation.action.cancelled && isSlateForConstruction(animation.move) ? animation.move : undefined
  const recycling = animation && isRecycle(animation.move) ? animation.move : undefined
  const removeIndex = player.draftArea.findIndex(card => card === slatingForConstruction?.card)
  const chosenCard = isPlayer(player) ? choosingDevelopment && isChosenDevelopmentCardVisible(choosingDevelopment) ? choosingDevelopment.card : player.chosenCard : undefined
  const canDrop = (monitor: DropTargetMonitor<DropItem>, card = monitor.getItem().card) => monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_HAND
    || (canUndo(move => isSlateForConstruction(move) && move.card === card))
  const [{dragItemType, isValidTarget, isOver}, ref] = useDrop({
    accept: [DragItemType.DEVELOPMENT_FROM_HAND, DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA],
    canDrop: (item: DropItem, monitor) => canDrop(monitor, item.card),
    collect: (monitor) => ({
      dragItemType: monitor.getItemType(),
      isValidTarget: monitor.canDrop() && canDrop(monitor),
      isOver: monitor.isOver()
    }),
    drop: (item: DropItem) => chooseDevelopmentCardMove(player.empire, item.card)
  })
  useEffect(() => {
    if (!animation && focusedCard !== chosenCard && !player.draftArea.some(card => card === focusedCard)) {
      setFocusedCard(undefined)
    }
  }, [player, focusedCard, animation])

  function getTransform(card: number, index: number) {
    if (card === slatingForConstruction?.card) {
      const fullWidth = game.players.length === 2 && game.phase !== Phase.Draft
      const x = getAreaCardX(player.constructionArea.length, player.constructionArea.length + 1, fullWidth) * 100 / cardWidth
      const y = getAreaCardY(row + 1) * 100 / cardHeight
      return `translate(${x}%, ${y}%)`
    } else if (card === recycling?.card) {
      const discardIndex = Math.min(game.discard.length, discardPileMaxSize)
      const x = discardPileCardX(discardIndex) * 100 / cardWidth
      const y = discardPileCardY(discardIndex) * 100 / cardHeight
      return `translate(${x}%, ${y}%) scale(${discardPileScale})`
    } else {
      if (removeIndex !== -1 && removeIndex < index) {
        index--
      }
      return `translate(${getAreaCardX(index) * 100 / cardWidth}%, ${getAreaCardY(row) * 100 / cardHeight}%)`
    }
  }

  function zIndexStyle(card: number) {
    if (card === slatingForConstruction?.card || card === recycling?.card) {
      return css`z-index: 100`
    }
    return
  }

  const [buildingOrRecyclingAll, setBuildingOrRecyclingAll] = useState(false)
  useEffect(() => {
    if (buildingOrRecyclingAll && player.draftArea.length === 0) {
      setBuildingOrRecyclingAll(false)
    }
  }, [player, buildingOrRecyclingAll])
  const buildAll = () => {
    setBuildingOrRecyclingAll(true)
    player.draftArea.forEach(card => play(slateForConstructionMove(player.empire, card), {delayed: true}))
  }
  const recycleAll = () => {
    setBuildingOrRecyclingAll(true)
    player.draftArea.forEach(card => play(recycleMove(player.empire, card), {delayed: true}))
  }
  const drop = (move: SlateForConstruction | Recycle | CompleteConstruction) => {
    if (isCompleteConstruction(move)) {
      play(slateForConstructionMove(move.playerId, move.card), {skipAnimation: true})
      getMovesToBuild(player as Player, move.card).forEach(move => play(move))
    } else {
      play(move)
    }
  }

  return (
    <>
      {focusedCard !== undefined &&
      <>
        <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        {isPlayer(player) && game.phase === Phase.Planning &&
        <>
          <button css={[textButton, textButtonLeft, draftConstructionButton]} onClick={() => play(slateForConstructionMove(player.empire, focusedCard))}>
            {t('Build')}
          </button>
          <button css={[textButton, textButtonRight, recyclingButton(getCardDetails(focusedCard).recyclingBonus)]}
                  onClick={() => play(recycleMove(player.empire, focusedCard))}>
            {t('Recycle')}
          </button>
        </>
        }
        <FocusedDevelopmentOptions development={getCardDetails(focusedCard)} onClose={() => setFocusedCard(undefined)}/>
      </>
      }
      <div ref={ref} css={getDraftAreaStyle(row, game.players.length === 2, isValidTarget, isOver)}>
        {!player.draftArea.length && <span css={draftAreaText}>{t('Draft area')}</span>}
        {isValidTarget && <span css={draftActionAreaText}>&rarr; {
          dragItemType === DragItemType.DEVELOPMENT_FROM_HAND ? t('Choose this card') : t('Cancel construction')
        }</span>}
      </div>
      {player.draftArea.map((card, index) => (
        <Draggable key={card} type={DragItemType.DEVELOPMENT_FROM_DRAFT_AREA} item={{card}} drop={drop} postTransform={getTransform(card, index)}
                   css={[cardStyle, areaCardStyle, focusedCard === card && getCardFocusTransform, zIndexStyle(card),
                     undoingSlateForConstruction?.card === card && css`display: none`]}
                   canDrag={!animation && playerId === player.empire && game.phase === Phase.Planning && focusedCard === undefined}
                   animation={{properties: ['transform', 'z-index'], seconds: animation?.duration ?? 0.2}}>
          <DevelopmentCard development={developmentCards[card]} css={css`height: 100%;`} onClick={() => setFocusedCard(card)}/>
        </Draggable>
      ))}
      {chosenCard !== undefined && <DevelopmentCard development={developmentCards[chosenCard]}
                                                    css={[getAreaCardTransform(row, player.draftArea.length),
                                                      cardStyle, areaCardStyle, focusedCard === chosenCard && getCardFocusTransform,
                                                      choosingDevelopment && css`opacity: 0;`]}
                                                    onClick={() => typeof chosenCard == 'number' && setFocusedCard(chosenCard)}/>}
      {isPlayer(player) && game.phase === Phase.Planning && player.draftArea.length > 0 && !buildingOrRecyclingAll && <div css={buttonsArea}>
        <Button onClick={buildAll}>{t('Build all')}</Button>
        <Button onClick={recycleAll}>{t('Recycle all')}</Button>
      </div>}
    </>
  )
}

const getDraftAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(175, 202, 11, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: #afca0b;
  box-shadow: 0 0 0.7em #afca0b;
  ${getAreasStyle(row, fullWidth, isValidTarget)};
`

const draftAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 0.25em;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #879d12;
  font-size: 4em;
`
const draftActionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 0.2em;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: antiquewhite;
  font-size: 6em;
  text-shadow: 0 0 0.2em #333;
`

export const textButtonFontStyle = css`
  font-size: 3.2em;
  line-height: 2em;
  color: #EEE;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform: uppercase;
`

export const textButton = css`
  position: absolute;
  z-index: 100;
  width: 20%;
  ${textButtonFontStyle};
  background-color: transparent;
  padding: 0.5% 1.5%;
  border: none;

  &:hover, &:focus {
    outline: 0;
    color: #FFF;
    transform: translateY(1px) scale(1.05);
    cursor: pointer;
  }

  &:active {
    color: #FFF;
    transform: translateY(1px);
  }
`

export const textButtonRight = css`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom center;
`

export const textButtonLeft = css`
  text-align: right;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom center;
    transform: scaleX(-1);
    z-index: -1;
  }
`

const draftConstructionButton = css`
  bottom: 27%;
  right: ${51 + cardWidth * 1.5}%;

  &:before {
    background-image: url(${Images.titleOrange});
  }
`

export const recyclingButton = (resource: Resource) => css`
  bottom: 27%;
  left: ${51 + cardWidth * 1.5}%;
  background-image: url(${buttonImages.get(resource)});
  text-align: left;
`

const buttonImages = new Map<Resource, any>()

buttonImages.set(Resource.Materials, Images.titleWhite)
buttonImages.set(Resource.Energy, Images.titleBlack)
buttonImages.set(Resource.Science, Images.titleGreen)
buttonImages.set(Resource.Gold, Images.titleYellow)
buttonImages.set(Resource.Exploration, Images.titleBlue)

const buttonsArea = css`
  position: absolute;
  top: 11%;
  left: 43%;
  font-size: 4em;
  right: ${playerPanelWidth + playerPanelMargin * 2}%;
  display: flex;
  justify-content: space-evenly;
`