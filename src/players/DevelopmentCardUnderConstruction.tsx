import {css} from '@emotion/core'
import {Draggable, usePlay, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import CharacterTokenFromEmpire from '../drag-objects/CharacterTokenFromEmpire'
import {developmentFromConstructionArea} from '../drag-objects/DevelopmentFromConstructionArea'
import DragObjectType from '../drag-objects/DragObjectType'
import KrystalliumFromEmpire from '../drag-objects/KrystalliumCube'
import ResourceFromBoard from '../drag-objects/ResourceFromBoard'
import {DevelopmentUnderConstruction, isPlayerView, ItsAWonderfulWorldView, Player, PlayerView} from '../ItsAWonderfulWorld'
import {isCharacter} from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentCard, {height as cardHeight, width as cardWidth} from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import EmpireName from '../material/empires/EmpireName'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube, {cubeHeight, cubeWidth} from '../material/resources/ResourceCube'
import PlaceCharacter, {isPlaceCharacter, placeCharacter} from '../moves/PlaceCharacter'
import {isPlaceResource, isPlaceResourceOnConstruction, placeResource, PlaceResourceOnConstruction} from '../moves/PlaceResource'
import {getLegalMoves, getRemainingCost} from '../Rules'
import {glow} from '../util/Styles'

type Props = {
  game: ItsAWonderfulWorldView
  player: Player | PlayerView
  developmentUnderConstruction: DevelopmentUnderConstruction
  canRecycle: boolean
  focused: boolean
  setFocus: () => void
} & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCardUnderConstruction: FunctionComponent<Props> = ({game, player, developmentUnderConstruction, canRecycle, focused, setFocus, ...props}) => {
  const playerId = usePlayerId<EmpireName>()
  const play = usePlay()
  const legalMoves = isPlayerView(player) ? [] : getLegalMoves(player, game.phase)
  const placeResourceMoves: PlaceResourceOnConstruction[] = legalMoves.filter(isPlaceResource).filter(isPlaceResourceOnConstruction)
    .filter(move => move.card === developmentUnderConstruction.card)
  const placeCharacterMoves: PlaceCharacter[] = legalMoves.filter(isPlaceCharacter).filter(move => move.card === developmentUnderConstruction.card)
  const [{canDrop, isOver}, ref] = useDrop({
    accept: [DragObjectType.RESOURCE_FROM_BOARD, DragObjectType.KRYSTALLIUM_FROM_EMPIRE, DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE],
    canDrop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          return placeResourceMoves.some(move => move.resource === item.resource)
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          return placeResourceMoves.length > 0
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          return placeCharacterMoves.some(move => move.character === item.character)
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          play(placeResource(playerId!, item.resource, developmentUnderConstruction.card, Math.min(...placeResourceMoves.filter(move => move.resource === item.resource).map(move => move.space))))
          break
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          const remainingCost = getRemainingCost(developmentUnderConstruction)
          const krystalliumCost = remainingCost.find(cost => cost.item === Resource.Krystallium)
          if (krystalliumCost) {
            play(placeResource(playerId!, Resource.Krystallium, developmentUnderConstruction.card, krystalliumCost.space))
          } else {
            const remainingResourcesRequired = new Set(remainingCost.filter(cost => isResource(cost.item)).map(cost => cost.item))
            if (remainingResourcesRequired.size === 1) {
              play(placeResource(playerId!, Resource.Krystallium, developmentUnderConstruction.card, Math.min(...placeResourceMoves.map(move => move.space))))
            } else {
              setFocus()
            }
          }
          break
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          play(placeCharacter(playerId!, item.character, developmentUnderConstruction.card, Math.min(...placeCharacterMoves.map(move => move.space))))
          break
      }
    }
  })
  return (
    <Draggable item={developmentFromConstructionArea(developmentUnderConstruction.card)} disabled={!canRecycle || canDrop || focused} {...props}>
      <div ref={ref} css={getStyle(canDrop, isOver)}>
        <DevelopmentCard development={developmentCards[developmentUnderConstruction.card]} css={css`height: 100%;`}/>
        {[...developmentUnderConstruction.costSpaces].reverse().map((item, index) => {
          if (isResource(item)) {
            return <ResourceCube key={index} resource={item} css={getResourceStyle(developmentUnderConstruction.costSpaces.length - index - 1)}/>
          } else if (isCharacter(item)) {
            return <CharacterToken key={index} character={item} css={getCharacterTokenStyle(developmentUnderConstruction.costSpaces.length - index - 1)}/>
          } else {
            return null
          }
        })}
      </div>
    </Draggable>
  )
}

const getStyle = (canDrop: boolean, isOver: boolean) => css`
  border-radius: 5%;
  height: 100%;
  ${canDrop && canDropStyle};
  ${canDrop && isOver && overStyle};
`

const canDropStyle = css`
  transition: transform 0.2s ease-in-out !important;
  animation: ${glow('green')} 1s ease-in-out infinite alternate;
  transform: scale(1.05);
`

const overStyle = css`
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 128, 0, 0.3);
  }
`

export const costSpaceDeltaX = 0.25
export const costSpaceDeltaY = (index: number) =>  index * 2.1 + 0.3

const getResourceStyle = (index: number) => css`
  position: absolute;
  width: ${cubeWidth * 100 / cardWidth};
  height: ${cubeHeight * 100 / cardHeight}%;
  left: ${costSpaceDeltaX * 100 / cardWidth}%;
  top: ${costSpaceDeltaY(index) * 100 / cardHeight}%;
`

const getCharacterTokenStyle = (index: number) => css`
  position: absolute;
  height: 10%;
  left: 2.5%;
  top: ${index * 9 + 3}%;
`

export default DevelopmentCardUnderConstruction