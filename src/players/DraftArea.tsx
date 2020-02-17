import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Draggable, useDrop, usePlay, useAnimation} from 'tabletop-game-workshop'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import ChooseDevelopmentCard, {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'
import MoveType from '../moves/MoveType'

const DraftArea: FunctionComponent<{ player: Player }> = ({player}) => {
  const play = usePlay()
  const choosingDevelopment = useAnimation<ChooseDevelopmentCard>(animation => animation.move.type == MoveType.ChooseDevelopmentCard && animation.move.playerId == player.empire)
  let slots = player.draftArea.length
  if (player.chosenCard || choosingDevelopment) {
    slots++
  }
  slots = Math.max(slots, 1)
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_HAND,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_HAND,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(player.empire, item.index))
  })
  return (
    <div ref={ref} css={css`
        position: absolute;
        height: 24.6vh;
        width: ${slots * 15.3 + 1.6}vh;
        bottom: 1vh;
        left: 26vh;
        background-color: rgba(0, 255, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
        border: 0.3vh dashed green;
        border-radius: 1vh;
        will-change: width;
        transition: width ${choosingDevelopment?.duration || 0}s ease-in-out;
      `}>
      {!player.draftArea.length && <span css={draftAreaText}>Zone de draft</span>}
      {player.draftArea.map((development, index) => (
        <Draggable key={index} item={developmentFromDraftArea(index)} css={css`
          position: absolute;
          top: 1vh;
          left: ${index * 15.3 + 1}vh;
        `}>
          <DevelopmentCard development={development}/>
        </Draggable>
      ))}
      {player.chosenCard && <DevelopmentCard development={player.chosenCard != true ? player.chosenCard : null} position={css`
          position: absolute;
          bottom: 1vh;
          left: ${player.draftArea.length * 15.3 + 1}vh;
        `}/>}
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