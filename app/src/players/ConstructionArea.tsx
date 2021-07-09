/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {getCardDetails} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import CompleteConstruction, {isCompleteConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import Recycle, {isRecycle} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import SlateForConstruction, {isSlateForConstruction, slateForConstructionMove} from '@gamepark/its-a-wonderful-world/moves/SlateForConstruction'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useAnimation, usePlayerId} from '@gamepark/react-client'
import {useEffect, useRef, useState} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {discardPileCardX, discardPileCardY, discardPileMaxSize, discardPileScale} from '../material/developments/DiscardPile'
import FocusedDevelopmentOptions from '../material/developments/FocusedDevelopmentOptions'
import DragItemType from '../material/DragItemType'
import {
  cardHeight, cardWidth, constructedCardLeftMargin, constructedCardY, getAreaCardX, getAreaCardY, getAreasStyle, getCardFocusTransform, popupBackgroundStyle
} from '../util/Styles'
import ConstructionButtons from './ConstructionButtons'
import DevelopmentCardUnderConstruction from './DevelopmentCardUnderConstruction'

type Props = {
  game: GameView
  gameOver: boolean
  player: Player | PlayerView
}

export default function ConstructionArea({game, gameOver, player}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const [focusedCard, setFocusedCard] = useState<number>()
  const construction = player.constructionArea.find(construction => construction.card === focusedCard)
  const row = game.phase === Phase.Draft ? 2 : 1
  const fullWidth = game.players.length === 2 && game.phase !== Phase.Draft
  const animation = useAnimation<CompleteConstruction | Recycle | SlateForConstruction>(animation =>
    (isCompleteConstruction(animation.move) || isRecycle(animation.move) || isSlateForConstruction(animation.move)) && animation.move.playerId === player.empire
  )
  const completingConstruction = animation && isCompleteConstruction(animation.move) ? animation.move : undefined
  const recycling = animation && isRecycle(animation.move) ? animation.move : undefined
  const undoingSlateForConstruction = animation && animation.action.cancelled && isSlateForConstruction(animation.move) ? animation.move : undefined
  const constructions = useRef(player.constructionArea)
  if (!undoingSlateForConstruction) {
    constructions.current = player.constructionArea
  }
  const removeIndex = player.constructionArea.findIndex(construction => construction.card === completingConstruction?.card)
  useEffect(() => {
    if (!animation && !player.constructionArea.some(construction => construction.card === focusedCard)) {
      setFocusedCard(undefined)
    }
  }, [player, focusedCard, animation])
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragItemType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: { card: number }) => (slateForConstructionMove(player.empire, item.card))
  })

  function getTransform(card: number, index: number) {
    if (card === completingConstruction?.card) {
      return `translate(${constructedCardLeftMargin * 100 / cardWidth}%, ${constructedCardY(player.constructedDevelopments.length) * 100 / cardHeight}%)`
    } else if (card === recycling?.card) {
      const discardIndex = Math.min(game.discard.length, discardPileMaxSize)
      const x = discardPileCardX(discardIndex) * 100 / cardWidth
      const y = discardPileCardY(discardIndex) * 100 / cardHeight
      return `translate(${x}%, ${y}%) scale(${discardPileScale})`
    } else if (card === undoingSlateForConstruction?.card) {
      const x = getAreaCardX(player.draftArea.indexOf(card)) * 100 / cardWidth
      const y = getAreaCardY(row - 1) * 100 / cardHeight
      return `translate(${x}%, ${y}%)`
    } else {
      if (removeIndex !== -1 && removeIndex < index) {
        index--
      }
      return `translate(${getAreaCardX(index, player.constructionArea.length, fullWidth) * 100 / cardWidth}%, ${getAreaCardY(row) * 100 / cardHeight}%)`
    }
  }

  return <>
    {construction && <>
      <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
      {isPlayer(player) && !gameOver && <ConstructionButtons player={player} construction={construction} removeFocus={() => setFocusedCard(undefined)}/>}
      <FocusedDevelopmentOptions development={getCardDetails(construction.card)} onClose={() => setFocusedCard(undefined)}/>
    </>}
    <div ref={ref} css={getConstructionAreaStyle(row, fullWidth, isValidTarget, isOver)}>
      {!player.constructionArea.length && <span css={constructionAreaText}>{t('Construction area')}</span>}
      {isValidTarget && <span css={constructAreaText}>&rarr; {t('Slate for construction')}</span>}
    </div>
    {constructions.current.map((construction, index) => {
        return <DevelopmentCardUnderConstruction key={construction.card} game={game} gameOver={gameOver} player={player} construction={construction}
                                                 animation={{properties: ['transform', 'z-index'], seconds: animation?.duration ?? 0.2}}
                                                 postTransform={getTransform(construction.card, index)}
                                                 setFocus={() => setFocusedCard(construction.card)}
                                                 canRecycle={player.empire === playerId && focusedCard !== construction.card && row !== 2}
                                                 focused={focusedCard === construction.card}
                                                 css={[focusedCard === construction.card && getCardFocusTransform,
                                                   animation && animation.move.card && css`z-index: 10`]}/>
      }
    )}
  </>
}

const getConstructionAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(247, 166, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: #f7a600;
  box-shadow: 0 0 0.7em #f7a600;
  ${getAreasStyle(row, fullWidth, isValidTarget)};
`

const constructionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 0.25em;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 4em;
  color: #f7a600;
`

const constructAreaText = css`
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
