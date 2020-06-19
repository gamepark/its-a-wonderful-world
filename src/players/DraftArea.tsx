import {css} from '@emotion/core'
import {Draggable, useActions, useAnimation, usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromConstructionArea from '../drag-objects/DevelopmentFromConstructionArea'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import RecyclingBackgroundImage from '../material/board/title-black-2.png'
import ConstructBackgroundImage from '../material/board/title-orange-2.png'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import {discardPileCardX, discardPileCardY, discardPileMaxSize, discardPileScale} from '../material/developments/DiscardPile'
import EmpireName from '../material/empires/EmpireName'
import ChooseDevelopmentCard, {
  chooseDevelopmentCard, ChooseDevelopmentCardView, isChooseDevelopmentCard, isChosenDevelopmentCardVisible
} from '../moves/ChooseDevelopmentCard'
import Move from '../moves/Move'
import Recycle, {isRecycle, recycle} from '../moves/Recycle'
import SlateForConstruction, {isSlateForConstruction, slateForConstruction} from '../moves/SlateForConstruction'
import {canUndoSlateForConstruction} from '../Rules'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {
  areaCardStyle, cardHeight, cardStyle, cardWidth, getAreaCardTransform, getAreaCardX, getAreaCardY, getAreasStyle, getCardFocusTransform, popupBackgroundStyle
} from '../util/Styles'

const DraftArea: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const {t} = useTranslation()
  const row = game.phase === Phase.Draft ? 1 : 0
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const actions = useActions<Move, EmpireName>()
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
  const chosenCard = choosingDevelopment ? isChosenDevelopmentCardVisible(choosingDevelopment) ? choosingDevelopment.card : true : player.chosenCard
  const canDrop = (item: DevelopmentFromHand | DevelopmentFromConstructionArea) => item.type === DragObjectType.DEVELOPMENT_FROM_HAND
    || (!!playerId && !!actions && canUndoSlateForConstruction(actions, playerId, item.card))
  const [{dragItemType, isValidTarget, isOver}, ref] = useDrop({
    accept: [DragObjectType.DEVELOPMENT_FROM_HAND, DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA], canDrop,
    collect: (monitor) => ({
      dragItemType: monitor.getItemType(),
      isValidTarget: monitor.canDrop() && canDrop(monitor.getItem()),
      isOver: monitor.isOver()
    }),
    drop: item => item.type === DragObjectType.DEVELOPMENT_FROM_HAND ? chooseDevelopmentCard(player.empire, item.card) : slateForConstruction(player.empire, item.card)
  })
  useEffect(() => {
    if (!animation && focusedCard !== player.chosenCard && !player.draftArea.some(card => card === focusedCard)) {
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
      return css`z-index: 10`
    }
    return
  }

  return (
    <>
      {focusedCard !== undefined &&
      <>
        <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        {isPlayer(player) && game.phase === Phase.Planning &&
        <>
          <button css={draftConstructionButton} onClick={() => play(slateForConstruction(player.empire, focusedCard))}>
            {t('Construire')}
          </button>
          <button css={draftRecyclingButton} onClick={() => play(recycle(player.empire, focusedCard))}>
            {t('Recycler')}
          </button>
        </>
        }
      </>
      }
      <div ref={ref} css={getDraftAreaStyle(row, game.players.length === 2, isValidTarget, isOver)}>
        {!player.draftArea.length && <span css={draftAreaText}>{t('Zone de draft')}</span>}
        {isValidTarget && <span css={draftActionAreaText}>&rarr; {
          dragItemType === DragObjectType.DEVELOPMENT_FROM_HAND ? t('Sélectionner cette carte') : t('Annuler la construction')
        }</span>}
      </div>
      {player.draftArea.map((card, index) => (
        <Draggable key={card} item={developmentFromDraftArea(card)} onDrop={play} postTransform={getTransform(card, index)}
                   css={[cardStyle, areaCardStyle, focusedCard === card && getCardFocusTransform, zIndexStyle(card),
                     undoingSlateForConstruction?.card === card && css`display: none`]}
                   disabled={animation !== undefined || playerId !== player.empire || game.phase !== Phase.Planning}
                   animation={{properties: ['transform', 'z-index'], seconds: animation?.duration ?? 0.2}}>
          <DevelopmentCard development={developmentCards[card]} css={css`height: 100%;`} onClick={() => setFocusedCard(card)}/>
        </Draggable>
      ))}
      {chosenCard !== undefined && <DevelopmentCard development={typeof chosenCard == 'number' ? developmentCards[chosenCard] : undefined}
                                                    css={[getAreaCardTransform(row, player.draftArea.length),
                                                      cardStyle, areaCardStyle, focusedCard === chosenCard && getCardFocusTransform,
                                                      choosingDevelopment && css`opacity: 0;`]}
                                                    onClick={() => typeof chosenCard == 'number' && setFocusedCard(chosenCard)}/>}
    </>
  )
}

const getDraftAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(175, 202, 11, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: #afca0b;
  box-shadow: 0 0 0.7vh #afca0b;
  ${getAreasStyle(row, fullWidth, isValidTarget)}; 
`

const draftAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #879d12;
  font-size: 4vh;
`
const draftActionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: antiquewhite;
  font-size: 6vh;
  text-shadow: 0 0 1vh #333;
`

export const textButtonFontStyle = css`
  font-size: 3vh;
  text-align: right;
  line-height: 6.5vh;
  color: #EEE;
  font-weight: lighter;
  text-shadow: 0 0 1vh #000, 0 0 1vh #000;
  text-transform: uppercase;
`

export const textButton = css`
  position: absolute;
  z-index: 100;
  width: 20%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom center;
  background-color:transparent;
  ${textButtonFontStyle};
  padding: 0.5% 1.5%;
  border:none;
  &:hover, &:focus {
    outline:0;
    color:#FFF;
    transform: translateY(1px) scale(1.05);
    cursor:pointer;
  }
  &:active {
    color:#FFF;
    transform: translateY(1px);
  }
`

const draftConstructionButton = css`
  bottom: 51%;
  right: ${51 + cardWidth * 1.5}%;
  background-image: url(${ConstructBackgroundImage});
  ${textButton};
`

const draftRecyclingButton = css`
  top: 51%;
  right: ${51 + cardWidth * 1.5}%;
  background-image: url(${RecyclingBackgroundImage});
  ${textButton};
`

export default DraftArea