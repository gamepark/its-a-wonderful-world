import {css} from '@emotion/core'
import {useAnimation, usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import Character from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import Construction from '../material/developments/Construction'
import constructionCost from '../material/developments/ConstructionCost'
import {developmentCards} from '../material/developments/Developments'
import {discardPileCardX, discardPileCardY, discardPileMaxSize, discardPileScale} from '../material/developments/DiscardPile'
import EmpireName from '../material/empires/EmpireName'
import Images from '../material/Images'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube from '../material/resources/ResourceCube'
import CompleteConstruction, {isCompleteConstruction} from '../moves/CompleteConstruction'
import PlaceCharacter, {placeCharacter} from '../moves/PlaceCharacter'
import {isPlaceResource, placeResource, PlaceResourceOnConstruction} from '../moves/PlaceResource'
import Recycle, {isRecycle, recycle} from '../moves/Recycle'
import SlateForConstruction, {isSlateForConstruction, slateForConstruction} from '../moves/SlateForConstruction'
import {canBuild, getMovesToBuild, getRemainingCost, placeAvailableCubesMoves} from '../Rules'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {
  cardHeight, cardWidth, constructedCardLeftMargin, constructedCardY, getAreaCardX, getAreaCardY, getAreasStyle, getCardFocusTransform, popupBackgroundStyle
} from '../util/Styles'
import DevelopmentCardUnderConstruction from './DevelopmentCardUnderConstruction'
import {recyclingButton, textButton, textButtonFontStyle, textButtonLeft, textButtonRight} from './DraftArea'

const ConstructionArea: FunctionComponent<{ game: GameView, gameOver: boolean, player: Player | PlayerView }> = ({game, gameOver, player}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const [focusedCard, setFocusedCard] = useState<number>()
  const construction = player.constructionArea.find(construction => construction.card === focusedCard)
  const maxSpendableResources = isPlayer(player) && construction ? maxResourcesToPlace(player, construction) : []
  const row = game.phase === Phase.Draft ? 2 : 1
  const fullWidth = game.players.length === 2 && game.phase !== Phase.Draft
  const play = usePlay()
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
  const build = (construction: Construction) => {
    getMovesToBuild(player as Player, construction.card).forEach(move => play(move))
  }
  useEffect(() => {
    if (!animation && !player.constructionArea.some(construction => construction.card === focusedCard)) {
      setFocusedCard(undefined)
    }
  }, [player, focusedCard, animation])
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromDraftArea) => slateForConstruction(player.empire, item.card)
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
      {isPlayer(player) && !gameOver && getSmartPlaceItemMoves(player, construction).map(move =>
        <button key={move.space} css={getPlaceItemButtonStyle(move.space)} onClick={() => play(move)}>
          {isPlaceResource(move) ?
            <ResourceCube resource={move.resource} css={buttonItemStyle}/> :
            <CharacterToken character={move.character} css={buttonItemStyle}/>
          }
        </button>
      )}
      {maxSpendableResources.length > 1 && <button css={getPlaceItemButtonStyle(getTotalConstructionCost(construction.card) + 0.5)}
                                                   onClick={() => placeAvailableCubesMoves(player, construction).forEach(move => play(move))}>
        <span css={getPlaceTextStyle}>{t('Placer')} </span>
        {maxSpendableResources.map((resource, index) => <ResourceCube key={index} resource={resource} css={buttonItemStyle}/>)}
      </button>}
      {isPlayer(player) && !gameOver && <>
        {canBuild(player, construction.card) &&
        <button
          css={[textButton, textButtonLeft, getPlaceConstructionButton(getTotalConstructionCost(construction.card) + (maxSpendableResources.length > 1 ? 2 : 2))]}
          onClick={() => build(construction)}>{t('Construire')}</button>
        }
        <button css={[textButton, textButtonRight, recyclingButton(developmentCards[construction.card].recyclingBonus)]}
                onClick={() => play(recycle(player.empire, construction.card))}>
          {t('Recycler')}
        </button>
      </>}
    </>}
    <div ref={ref} css={getConstructionAreaStyle(row, fullWidth, isValidTarget, isOver)}>
      {!player.constructionArea.length && <span css={constructionAreaText}>{t('Zone de construction')}</span>}
      {isValidTarget && <span css={constructAreaText}>&rarr; {t('Mettre en Construction')}</span>}
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

function getSmartPlaceItemMoves(player: Player, construction: Construction): (PlaceResourceOnConstruction | PlaceCharacter)[] {
  const moves: (PlaceResourceOnConstruction | PlaceCharacter)[] = []
  const availableResource = JSON.parse(JSON.stringify(player.availableResources)) as Resource[]
  const krystalliumAvailable = player.empireCardResources.filter(resource => resource === Resource.Krystallium).length
  const availableKrystalliumPerResource: Record<Resource, number> = {
    [Resource.Materials]: krystalliumAvailable,
    [Resource.Energy]: krystalliumAvailable,
    [Resource.Science]: krystalliumAvailable,
    [Resource.Gold]: krystalliumAvailable,
    [Resource.Exploration]: krystalliumAvailable,
    [Resource.Krystallium]: krystalliumAvailable
  }
  const availableCharacters: Record<Character, number> = {
    [Character.Financier]: player.characters.Financier,
    [Character.General]: player.characters.General
  }
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item)) {
      if (availableResource.some(resource => resource === cost.item)) {
        moves.push(placeResource(player.empire, cost.item, construction.card, cost.space))
        availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1)
      } else if (availableKrystalliumPerResource[cost.item] > 0) {
        moves.push(placeResource(player.empire, Resource.Krystallium, construction.card, cost.space))
        availableKrystalliumPerResource[cost.item]--
      }
    } else {
      if (availableCharacters[cost.item] > 0) {
        moves.push(placeCharacter(player.empire, cost.item, construction.card, cost.space))
        availableCharacters[cost.item]--
      }
    }
  })
  return moves
}

const getTotalConstructionCost = (card: number) => Object.values(constructionCost(developmentCards[card].constructionCost)).reduce((value, sum) => sum + value)

export const maxResourcesToPlace = (player: Player, construction: Construction) => {
  const resources: Resource[] = []
  const availableResource = JSON.parse(JSON.stringify(player.availableResources)) as Resource[]
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item) && availableResource.some(resource => resource === cost.item)) {
      resources.push(...availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1))
    }
  })
  return resources
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

const getPlaceConstructionButton = (index: number) => css`
  top: ${index * 6.5 + 16.5}%;
  right: ${51 + cardWidth * 1.5}%;
  &:before {
    background-image: url(${Images.titleOrange});
  }
`

const buttonItemStyle = css`
  display: inline;
  height: 1.8em;
`

const getPlaceTextStyle = css`
  margin:0 0.3em;
`

const getPlaceItemButtonStyle = (index: number) => css`
  position: absolute;
  z-index: 100;
  top: ${index * 6.4 + 16.5}%;
  right: ${51 + cardWidth * 1.5}%;
  display: inline-flex;
  background-color:transparent;
  border: 0;
  padding: 0.5%;
  margin-right: 0.5em;
  align-items: center;
  filter: drop-shadow(0.1em 0.1em 0.5em black);
  ${textButtonFontStyle};
  &:hover, &:focus {
    outline: 0;
    transform: translateY(1px) scale(1.1);
    cursor: pointer;
    z-index: 101;
  }
  &:active {
    transform: translateY(1px);
  }
  &:after{
    background-image: url(${Images.buttonArrow});
    width: 1em;
    height: 1em;
    content: '';
    right: -1em;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
  }
`

export default ConstructionArea