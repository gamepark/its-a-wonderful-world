import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop, usePlay} from 'tabletop-game-workshop'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {slateForConstruction} from '../moves/SlateForConstruction'

const ConstructionArea: FunctionComponent<{ player: Player }> = ({player}) => {
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
    <div ref={ref} css={css`
        position: absolute;
        height: 24.6vh;
        bottom: 26.6vh;
        left: 26vh;
        right: 1vh;
        background-color: rgba(255, 0, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
        border: 0.3vh dashed crimson;
        border-radius: 1vh;
      `}>
      {!player.constructionArea.length && <span css={constructionAreaText}>Zone de construction</span>}
      {player.constructionArea.map((construction, index) => <DevelopmentCard key={index} development={construction.development} position={css`
          position:absolute;
          top: 1vh;
          left: ${index * 15.3 + 1}vh;
        `}/>)}
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