/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {recycleMove} from '@gamepark/its-a-wonderful-world/moves/Recycle'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DragItemType from '../material/DragItemType'
import {areasX, areaWidth} from '../util/Styles'

type Props = { empire: EmpireName }

export default function RecyclingDropArea({empire}: Props) {
  const {t} = useTranslation()
  const [{isValidTarget, isOver}, ref] = useDrop({
    accept: [DragItemType.DEVELOPMENT_FROM_DRAFT_AREA, DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA],
    collect: (monitor) => ({
      isValidTarget: monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_DRAFT_AREA || monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
      isOver: monitor.isOver()
    }),
    drop: ({card}: { card: number }) => recycleMove(empire, card)
  })
  return (
    <div ref={ref} css={getStyle(isValidTarget, isOver)}>
      <span css={text}>&rarr; {t('Recycle')}</span>
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
  border: 0.3em dashed grey;
  border-radius: 1em;
  z-index: 10;
`

const text = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 0.2em;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: antiquewhite;
  font-size: 6em;
`