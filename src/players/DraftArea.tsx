import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Draggable, useDrop, usePlay} from 'tabletop-game-workshop'
import {developmentFromDraftArea} from '../drag-objects/DevelopmentFromDraftArea'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'

const DraftArea: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_HAND,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_HAND,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(chooseDevelopmentCard(empire, item.index))
  })
  return (
    <div ref={ref} css={css`
        position: absolute;
        height: 24.6vh;
        width: ${(player.draftArea.length + (player.chosenCard ? 1 : 0)) * 15.3 + 1.6}vh;
        bottom: 1vh;
        left: 26vh;
        background-color: rgba(0, 255, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
        border: 0.3vh dashed green;
        border-radius: 1vh;
        min-width: 16.9vh;
      `}>
      {!player.draftArea.length && <span css={draftAreaText}>Draft Area</span>}
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
font-size: 3vh;
`

export default DraftArea