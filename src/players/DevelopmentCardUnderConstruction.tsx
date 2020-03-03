import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, useGame, usePlay, usePlayerId} from 'tabletop-game-workshop'
import DragObjectType from '../drag-objects/DragObjectType'
import ResourceFromBoard from '../drag-objects/ResourceFromBoard'
import ItsAWonderfulWorld, {DevelopmentUnderConstruction} from '../ItsAWonderfulWorld'
import {glow} from '../material/board/ResourceArea'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import Empire from '../material/empires/Empire'
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
    accept: DragObjectType.RESOURCE,
    canDrop: (item: ResourceFromBoard) => legalMoves.some(move => move.resource == item.resource),
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ResourceFromBoard) => play(placeResource(empire, item.resource, constructionIndex, Math.min(...legalMoves.filter(move => move.resource == item.resource).map(move => move.space))))
  })
  return <DevelopmentCard ref={ref} development={developmentUnderConstruction.development} css={getStyle(canDrop, isOver)} {...props}/>
}

const getStyle = (canDrop: boolean, isOver: boolean) => css`
  border-radius: 5%;
  ${canDrop && canDropStyle};
  ${canDrop && isOver && overStyle};
`

const canDropStyle = css`
  z-index: 1;
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

export default DevelopmentCardUnderConstruction