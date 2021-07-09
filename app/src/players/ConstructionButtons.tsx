/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {canBuild, getMovesToBuild, getRemainingCost, placeAvailableCubesMoves} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Construction from '@gamepark/its-a-wonderful-world/material/Construction'
import {getCardDetails} from '@gamepark/its-a-wonderful-world/material/Developments'
import Resource, {isResource} from '@gamepark/its-a-wonderful-world/material/Resource'
import PlaceCharacter, {placeCharacterMove} from '@gamepark/its-a-wonderful-world/moves/PlaceCharacter'
import {isPlaceResource, PlaceResourceOnConstruction, placeResourceOnConstructionMove} from '@gamepark/its-a-wonderful-world/moves/PlaceResource'
import {recycleMove} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import Player from '@gamepark/its-a-wonderful-world/Player'
import {usePlay, useUndo} from '@gamepark/react-client'
import {useTranslation} from 'react-i18next'
import CharacterToken from '../material/characters/CharacterToken'
import constructionCost from '../material/developments/ConstructionCost'
import Images from '../material/Images'
import ResourceCube from '../material/resources/ResourceCube'
import {cardWidth} from '../util/Styles'
import {getConstructionSpaceLocation, getDevelopmentColumn2Pattern} from './DevelopmentCardUnderConstruction'
import {recyclingButton, textButton, textButtonFontStyle, textButtonLeft, textButtonRight} from './DraftArea'

type Props = {
  player: Player
  construction: Construction
  removeFocus: () => void
}

export default function ConstructionButtons({player, construction, removeFocus}: Props) {
  const {t} = useTranslation()

  const maxSpendableResources = construction ? maxResourcesToPlace(player, construction) : []
  const play = usePlay()
  const [undo, canUndo] = useUndo()

  const build = (construction: Construction) => {
    getMovesToBuild(player as Player, construction.card).forEach(move => play(move))
  }

  function placeAvailableCubes(construction: Construction) {
    placeAvailableCubesMoves(player, construction).forEach(move => play(move))
    removeFocus()
  }

  return <>
    {getSmartPlaceItemMoves(player, construction).map(move =>
      <button key={move.space} css={[itemButtonStyle, placeItemButton(construction, move.space)]} onClick={() => play(move)}>
        {isPlaceResource(move) ?
          <ResourceCube resource={move.resource} css={buttonItemStyle}/> :
          <CharacterToken character={move.character} css={buttonItemStyle}/>
        }
      </button>
    )}
    {construction.costSpaces.map((item, index) => {
      if (!item) return null
      const move: PlaceResourceOnConstruction | PlaceCharacter = isResource(item) ?
        placeResourceOnConstructionMove(player.empire, item, construction.card, index) :
        placeCharacterMove(player.empire, item, construction.card, index)
      if (!canUndo(move)) return null
      return (
        <button key={index} css={[itemButtonStyle, placeItemButton(construction, index, true)]}
                onClick={() => undo(move)}>
          {isResource(item) ? <ResourceCube resource={item} css={buttonItemStyle}/> : <CharacterToken character={item} css={buttonItemStyle}/>}
        </button>
      )
    })}
    {maxSpendableResources.length > 1 &&
    <button
      css={[itemButtonStyle, rightArrow, leftButtonPosition(getTotalConstructionCost(construction.card) - getDevelopmentColumn2Pattern(construction).length + 0.5)]}
      onClick={() => placeAvailableCubes(construction)}>
      <span css={getPlaceTextStyle}>{t('Place')} </span>
      {maxSpendableResources.map((resource, index) => <ResourceCube key={index} resource={resource} css={buttonItemStyle}/>)}
    </button>}
    {canBuild(player, construction.card) &&
    <button
      css={[textButton, textButtonLeft, getPlaceConstructionButton(getTotalConstructionCost(construction.card) - getDevelopmentColumn2Pattern(construction).length + (maxSpendableResources.length > 1 ? 2 : 1))]}
      onClick={() => build(construction)}>{t('Build')}</button>
    }
    <button css={[textButton, textButtonRight, recyclingButton(getCardDetails(construction.card).recyclingBonus)]}
            onClick={() => play(recycleMove(player.empire, construction.card))}>
      {t('Recycle')}
    </button>
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
    [Character.Financier]: player.characters[Character.Financier],
    [Character.General]: player.characters[Character.General]
  }
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item)) {
      if (availableResource.some(resource => resource === cost.item)) {
        moves.push(placeResourceOnConstructionMove(player.empire, cost.item, construction.card, cost.space))
        availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1)
      } else if (availableKrystalliumPerResource[cost.item] > 0) {
        moves.push(placeResourceOnConstructionMove(player.empire, Resource.Krystallium, construction.card, cost.space))
        availableKrystalliumPerResource[cost.item]--
      }
    } else {
      if (availableCharacters[cost.item] > 0) {
        moves.push(placeCharacterMove(player.empire, cost.item, construction.card, cost.space))
        availableCharacters[cost.item]--
      }
    }
  })
  return moves
}

const getTotalConstructionCost = (card: number) => Object.values(constructionCost(getCardDetails(card).constructionCost)).reduce((value, sum) => sum + value)

const maxResourcesToPlace = (player: Player, construction: Construction) => {
  const resources: Resource[] = []
  const availableResource = JSON.parse(JSON.stringify(player.availableResources)) as Resource[]
  getRemainingCost(construction).forEach(cost => {
    if (isResource(cost.item) && availableResource.some(resource => resource === cost.item)) {
      resources.push(...availableResource.splice(availableResource.findIndex(resource => resource === cost.item), 1))
    }
  })
  return resources
}

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
  margin: 0 0.3em;
`

const itemButtonStyle = css`
  position: absolute;
  z-index: 101;
  display: inline-flex;
  background-color: transparent;
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
  }

  &:active {
    transform: translateY(1px);
  }
`

const rightArrow = css`
  &:after {
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

const leftArrow = css`
  &:before {
    background-image: url(${Images.buttonArrow});
    width: 1em;
    height: 1em;
    content: '';
    left: -1em;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    transform: scaleX(-1);
  }
`

const placeItemButton = (construction: Construction, space: number, undo: Boolean = false) => {
  const {column, index} = getConstructionSpaceLocation(construction, space)
  if (column === 1) {
    return [leftButtonPosition(index), undo ? leftArrow : rightArrow]
  } else {
    return [css`
      left: 48.5%;
      top: ${index * 6.4 + 26}%;
    `, undo ? rightArrow : leftArrow]
  }
}

const leftButtonPosition = (index: number) => css`
  right: ${51 + cardWidth * 1.5}%;
  top: ${index * 6.4 + 16.5}%;
`
