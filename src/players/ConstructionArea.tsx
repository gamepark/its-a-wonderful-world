import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {useDrop, useGame, usePlay} from 'tabletop-game-workshop'
import DevelopmentFromDraftArea from '../drag-objects/DevelopmentFromDraftArea'
import DragObjectType from '../drag-objects/DragObjectType'
import ItsAWonderfulWorld, {Phase, Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {slateForConstruction} from '../moves/SlateForConstruction'
import {getAreaCardStyle, getAreasStyle} from './DraftArea'

const ConstructionArea: FunctionComponent<{ player: Player }> = ({player}) => {
  const game = useGame<ItsAWonderfulWorld>()
  const row = game.phase == Phase.Draft ? 2 : 1
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
    <Fragment>
      <div ref={ref} css={getConstructionAreaStyle(row, game.players.length == 2 && game.phase != Phase.Draft, isValidTarget, isOver)}>
        {!player.constructionArea.length && <span css={constructionAreaText}>Zone de construction</span>}
      </div>
      {player.constructionArea.map((construction, index) => (
        <DevelopmentCard key={index} development={construction.development} css={getAreaCardStyle(row, index)}/>)
      )}
    </Fragment>
  )
}

const getConstructionAreaStyle = (row: number, fullWidth: boolean, isValidTarget: boolean, isOver: boolean) => css`
  background-color: rgba(255, 0, 0, ${isValidTarget ? isOver ? 0.5 : 0.3 : 0.1});
  border-color: crimson;
  ${getAreasStyle(row, fullWidth)};
`

const constructionAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 4vh;
  color: crimson;
`

export default ConstructionArea