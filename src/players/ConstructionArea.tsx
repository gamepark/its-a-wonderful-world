import {css} from '@emotion/core'
import {usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import Character from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import Construction from '../material/developments/Construction'
import constructionCost from '../material/developments/ConstructionCost'
import {developmentCards} from '../material/developments/Developments'
import EmpireName from '../material/empires/EmpireName'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube from '../material/resources/ResourceCube'
import PlaceCharacter, {placeCharacter} from '../moves/PlaceCharacter'
import {isPlaceResource, placeResource, PlaceResourceOnConstruction} from '../moves/PlaceResource'
import {slateForConstruction} from '../moves/SlateForConstruction'
import {canBuild, getMovesToBuild, getRemainingCost} from '../Rules'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {cardHeight, cardWidth, getAreaCardX, getAreaCardY, getAreasStyle, getCardFocusTransform, popupBackgroundStyle} from '../util/Styles'
import DevelopmentCardUnderConstruction from './DevelopmentCardUnderConstruction'

const ConstructionArea: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const [focusedCard, setFocusedCard] = useState<number>()
  const construction = player.constructionArea.find(construction => construction.card === focusedCard)
  const maxSpendableResources = isPlayer(player) && game.productionStep && construction ? maxResourcesToPlace(player, construction, game.productionStep) : 0
  const row = game.phase === Phase.Draft ? 2 : 1
  const fullWidth = game.players.length === 2 && game.phase !== Phase.Draft
  const play = usePlay()
  const placeResources = (construction: Construction, resource: Resource, quantity: number) => {
    getRemainingCost(construction).filter(cost => cost.item === resource).slice(0, quantity).forEach(cost =>
      play(placeResource(player.empire, resource, construction.card, cost.space))
    )
  }
  const build = (construction: Construction) => {
    getMovesToBuild(player as Player, construction.card).forEach(move => play(move))
  }
  useEffect(() => {
    if (!player.constructionArea.some(construction => construction.card === focusedCard)) {
      setFocusedCard(undefined)
    }
  }, [player, focusedCard])
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromDraftArea) => play(slateForConstruction(player.empire, item.card))
  })
  return <>
    {construction && <>
      <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
      {isPlayer(player) && getSmartPlaceItemMoves(player, construction).map(move =>
        <button key={move.space} css={getPlaceItemButtonStyle(move.space)} onClick={() => play(move)}>
          {isPlaceResource(move) ?
            <ResourceCube resource={move.resource} css={buttonItemStyle}/> :
            <CharacterToken character={move.character} css={buttonItemStyle}/>
          }
          <span>⇒</span>
        </button>
      )}
      {maxSpendableResources > 1 && <button css={getPlaceItemButtonStyle(getTotalConstructionCost(construction.card))}
                                            onClick={() => placeResources(construction, game.productionStep!, maxSpendableResources)}>
        <span>{t('Placer')}</span>
        {[...Array(maxSpendableResources)].map((_, index) => <ResourceCube key={index} resource={game.productionStep!} css={buttonItemStyle}/>)}
      </button>}
      {isPlayer(player) && canBuild(player, construction.card) &&
      <button css={getPlaceItemButtonStyle(getTotalConstructionCost(construction.card) + (maxSpendableResources > 1 ? 1 : 0))}
              onClick={() => build(construction)}>{t('Construire')}</button>
      }
    </>}
    <div ref={ref} css={getConstructionAreaStyle(row, fullWidth, isValidTarget, isOver)}>
      {!player.constructionArea.length && <span css={constructionAreaText}>Zone de construction</span>}
    </div>
    {player.constructionArea.map((construction, index) => {
        return <DevelopmentCardUnderConstruction key={construction.card} game={game} player={player} construction={construction}
                                                 origin={{
                                                   x: `${getAreaCardX(index, player.constructionArea.length, fullWidth) * 100 / cardWidth}%`,
                                                   y: `${getAreaCardY(row) * 100 / cardHeight}%`
                                                 }}
                                                 setFocus={() => setFocusedCard(construction.card)}
                                                 canRecycle={player.empire === playerId && focusedCard !== construction.card && row !== 2}
                                                 onClick={() => setFocusedCard(construction.card)}
                                                 focused={focusedCard === construction.card}
                                                 css={focusedCard === construction.card && getCardFocusTransform}/>
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

const maxResourcesToPlace = (player: Player, construction: Construction, resource: Resource) => {
  const availableResources = player.availableResources.filter(r => r === resource).length
  const requiredResources = getRemainingCost(construction).filter(cost => cost.item === resource).length
  return Math.min(availableResources, requiredResources)
}

const getConstructionAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(255, 0, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: crimson;
  ${getAreasStyle(row, fullWidth, isValidTarget)};
`

const constructionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 4vh;
  color: crimson;
`

const getPlaceItemButtonStyle = (index: number) => css`
  position: absolute;
  z-index: 100;
  top: ${index * 6.5 + 16.5}%;
  right: ${51 + cardWidth * 1.5}%;
  display: inline-flex;
  box-shadow: inset 0 0.1vh 0 0 #ffffff;
  background: #ededed linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
  border-radius: 2vh;
  border: 0.1vh solid #dcdcdc;
  color: #333333;
  padding: 0 2vh 0 1vh;
  align-items: center;
  font-size: 4.8vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black);
  &:hover, &:focus {
    outline:0;
    background: #dfdfdf linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
  }
  &:active {
    transform: translateY(1px);
  }
  & > * {
    margin-left: 1vh;
  }
`

const buttonItemStyle = css`
  display: inline;
  height: 3.5vh;
`

export default ConstructionArea