import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromConstructionArea from '../drag-objects/DevelopmentFromConstructionArea'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import EmpireName from '../material/empires/EmpireName'
import {recycle} from '../moves/Recycle'
import {areasX, areaWidth} from '../util/Styles'

const RecyclingDropArea: FunctionComponent<{ empire: EmpireName }> = ({empire}) => {
  const {t} = useTranslation()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: [DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA, DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA],
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_DRAFT_AREA || monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromDraftArea | DevelopmentFromConstructionArea) => recycle(empire, item.card)
  })
  return (
    <div ref={ref} css={getStyle(isValidTarget, isOver)}>
      <span css={text}>&rarr; {t('Recycler')}</span>
    </div>
  )
}

const getStyle = (isValidTarget: boolean, isOver: boolean) => css`
  position: absolute;
  display: ${isValidTarget ? 'block' : 'none'};
  height: 36%;
  width: ${areaWidth}%;
  left: ${areasX}%;
  top: 8%;
  background-color: rgba(0, 0, 0, ${isOver ? 0.5 : 0.3});
  border: 0.3vh dashed grey;
  border-radius: 1vh;
  z-index: 10;
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