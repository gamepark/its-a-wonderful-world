import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, useGame, usePlay, usePlayerId} from 'tabletop-game-workshop'
import DragObjectType from '../drag-objects/DragObjectType'
import KrystalliumFromEmpire from '../drag-objects/KrystalliumCube'
import ResourceFromBoard from '../drag-objects/ResourceFromBoard'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction} from '../ItsAWonderfulWorld'
import {glow} from '../material/board/ResourceArea'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import Empire from '../material/empires/Empire'
import Resource, {isResource} from '../material/resources/Resource'
import ResourceCube from '../material/resources/ResourceCube'
import MoveType from '../moves/MoveType'
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
  const legalMoves: PlaceResource[] = ItsAWonderfulWorldRules.getLegalMoves(game, empire).filter(move => move.type == MoveType.PlaceResource && move.constructionIndex == constructionIndex) as PlaceResource[]
  const [{canDrop, isOver}, ref] = useDrop({
    accept: [DragObjectType.RESOURCE_FROM_BOARD, DragObjectType.KRYSTALLIUM_FROM_EMPIRE],
    canDrop: (item: ResourceFromBoard | KrystalliumFromEmpire) => legalMoves.some(move => item.type == DragObjectType.KRYSTALLIUM_FROM_EMPIRE || move.resource == item.resource),
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard | KrystalliumFromEmpire) => {
      const resource = item.type == DragObjectType.KRYSTALLIUM_FROM_EMPIRE ? Resource.Krystallium : item.resource
      const validMoves = item.type == DragObjectType.KRYSTALLIUM_FROM_EMPIRE ? legalMoves : legalMoves.filter(move => move.resource == resource)
      play(placeResource(empire, resource, constructionIndex, Math.min(...validMoves.map(move => move.space))))
    }
  })
  return (
    <div ref={ref} {...props} css={getStyle(canDrop, isOver)}>
      <DevelopmentCard development={developmentUnderConstruction.development}/>
      {developmentUnderConstruction.costSpaces.map((resource, index) => {
        if (!isResource(resource)) {
          return null
        }
        return <ResourceCube key={index} resource={resource} css={getResourceStyle(index)}/>
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

export default DevelopmentCardUnderConstruction