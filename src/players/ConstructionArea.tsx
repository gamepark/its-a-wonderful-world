import {css, SerializedStyles} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, usePlay} from 'tabletop-game-workshop'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {slateForConstruction} from '../moves/SlateForConstruction'

type Props = {
  player: Player
  getAreaCardPosition: (index: number) => SerializedStyles
} & React.HTMLAttributes<HTMLDivElement>

const ConstructionArea: FunctionComponent<Props> = ({player, getAreaCardPosition, ...props}) => {
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromDraftArea) => play(slateForConstruction(player.empire, item.index))
  })
  return (
    <div ref={ref} {...props} css={css`
        background-color: rgba(255, 0, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
        border-color: crimson;
      `}>
      {!player.constructionArea.length && <span css={constructionAreaText}>Zone de construction</span>}
      {player.constructionArea.map((construction, index) => <DevelopmentCard key={index} development={construction.development}
                                                                             css={getAreaCardPosition(index)}/>)}
    </div>
  )
}

const constructionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 4vh;
  color: crimson;`

export default ConstructionArea