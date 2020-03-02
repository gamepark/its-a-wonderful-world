import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, usePlay} from 'tabletop-game-workshop'
import DevelopmentFromHand from '../drag-objects/DevelopmentFromHand'
import DragObjectType from '../drag-objects/DragObjectType'
import Empire from '../material/empires/Empire'
import {recycle} from '../moves/Recycle'
import {numberOfCardsToDraft} from '../rules'
import screenRatio from '../util/screenRatio'
import {areasLeftPosition, cardsShift} from './DraftArea'

const RecyclingDropArea: FunctionComponent<{ empire: Empire }> = ({empire}) => {
  const play = usePlay()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() == DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromHand) => play(recycle(empire, item.index))
  })
  return (
    <div ref={ref} css={getStyle(isValidTarget, isOver)}>
      <span css={text}>Recycle</span>
    </div>
  )
}

const border = 0.3

const getStyle = (isValidTarget: boolean, isOver: boolean) => css`
  position: absolute;
  display: ${isValidTarget ? 'block' : 'none'};
  height: 36%;
  width: ${cardsShift * numberOfCardsToDraft + 1}%;
  left: calc(${areasLeftPosition}% - ${border * 5 / screenRatio}%);
  top: 8%;
  background-color: rgba(0, 0, 0, ${isOver ? 0.5 : 0.3});
  border: 0.3vh dashed grey;
  border-radius: 1vh;
`

const text = css`
position: absolute;
width: 100%;
margin: 0;
padding: 0 1vh;
top: 50%;
transform: translateY(-50%);
text-align: center;
color: antiquewhite;
font-size: 6vh;
`

export default RecyclingDropArea