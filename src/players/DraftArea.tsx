import {css, SerializedStyles} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Draggable, useDrop, usePlay} from 'tabletop-game-workshop'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'

type Props = {
  player: Player
  getAreaCardPosition: (index: number) => SerializedStyles
} & React.HTMLAttributes<HTMLDivElement>

const DraftArea: FunctionComponent<Props> = ({player, getAreaCardPosition, ...props}) => {
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_HAND,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_HAND,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(player.empire, item.index))
  })
  return (
    <div ref={ref} {...props} css={css`
        background-color: rgba(0, 255, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
        border-color: green;
      `}>
      {!player.draftArea.length && <span css={draftAreaText}>Zone de draft</span>}
      {player.draftArea.map((development, index) => (
        <Draggable key={index} item={developmentFromDraftArea(index)} css={getAreaCardPosition(index)}>
          <DevelopmentCard development={development}/>
        </Draggable>
      ))}
      {player.chosenCard && <DevelopmentCard development={player.chosenCard != true ? player.chosenCard : null}
                                             css={getAreaCardPosition(player.draftArea.length)}/>}
    </div>
  )
}

const draftAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: darkgreen;
  font-size: 4vh;
`

export default DraftArea