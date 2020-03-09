import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, useGame, usePlay, usePlayerId} from 'tabletop-game-workshop'
import CharacterTokenFromEmpire from '../drag-objects/CharacterTokenFromEmpire'
import DragObjectType from '../drag-objects/DragObjectType'
import KrystalliumFromEmpire from '../drag-objects/KrystalliumCube'
import ResourceFromBoard from '../drag-objects/ResourceFromBoard'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction} from '../ItsAWonderfulWorld'
import {glow} from '../material/board/ResourceArea'
import {isCharacter} from '../material/characters/Character'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentCard, {height} from '../material/developments/DevelopmentCard'
import Empire from '../material/empires/Empire'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube from '../material/resources/ResourceCube'
import MoveType from '../moves/MoveType'
import PlaceCharacter, {placeCharacter} from '../moves/PlaceCharacter'
import PlaceResource, {placeResource} from '../moves/PlaceResource'
import ItsAWonderfulWorldRules from '../rules'

type Props = {
  developmentUnderConstruction: DevelopmentUnderConstruction
  constructionIndex: number
} & React.HTMLAttributes<HTMLDivElement>

const DevelopmentCardUnderConstruction: FunctionComponent<Props> = ({developmentUnderConstruction, constructionIndex, ...props}) => {
  const game = useGame<ItsAWonderfulWorld>()
  const empire = usePlayerId<Empire>()
  const play = usePlay()
  const placeResourceMoves: PlaceResource[] = ItsAWonderfulWorldRules.getLegalMoves(game, empire).filter(move => move.type == MoveType.PlaceResource && move.constructionIndex == constructionIndex) as PlaceResource[]
  const placeCharacterMoves: PlaceCharacter[] = ItsAWonderfulWorldRules.getLegalMoves(game, empire).filter(move => move.type == MoveType.PlaceCharacter && move.constructionIndex == constructionIndex) as PlaceCharacter[]
  const [{canDrop, isOver}, ref] = useDrop({
    accept: [DragObjectType.RESOURCE_FROM_BOARD, DragObjectType.KRYSTALLIUM_FROM_EMPIRE, DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE],
    canDrop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          return placeResourceMoves.some(move => move.resource == item.resource)
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          return placeResourceMoves.length > 0
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          return placeCharacterMoves.some(move => move.character == item.character)
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard | KrystalliumFromEmpire | CharacterTokenFromEmpire) => {
      switch (item.type) {
        case DragObjectType.RESOURCE_FROM_BOARD:
          play(placeResource(empire, item.resource, constructionIndex, Math.min(...placeResourceMoves.filter(move => move.resource == item.resource).map(move => move.space))))
          break
        case DragObjectType.KRYSTALLIUM_FROM_EMPIRE:
          play(placeResource(empire, Resource.Krystallium, constructionIndex, Math.min(...placeResourceMoves.map(move => move.space))))
          break
        case DragObjectType.CHARACTER_TOKEN_FROM_EMPIRE:
          play(placeCharacter(empire, item.character, constructionIndex, Math.min(...placeCharacterMoves.map(move => move.space))))
          break
      }
    }
  })
  return (
    <div ref={ref} {...props} css={getStyle(canDrop, isOver)}>
      <DevelopmentCard development={developmentUnderConstruction.development} css={css`height: 100%;`}/>
      {developmentUnderConstruction.costSpaces.map((item, index) => {
        if (isResource(item)) {
          return <ResourceCube key={index} resource={item} css={getResourceStyle(index)}/>
        } else if (isCharacter(item)) {
          return <CharacterToken key={index} character={item} css={getCharacterTokenStyle(index)}/>
        } else {
          return null
        }
      })}
    </div>
  )
}

const getStyle = (canDrop: boolean, isOver: boolean) => css`
  border-radius: 5%;
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

const getResourceStyle = (index: number) => css`
  position: absolute;
  height: 10%;
  left: 3.5%;
  top: ${index * 9 + 1.5}%;
`

const getCharacterTokenStyle = (index: number) => css`
  position: absolute;
  height: 10%;
  left: 2.5%;
  top: ${index * 9 + 3}%;
`

export default DevelopmentCardUnderConstruction