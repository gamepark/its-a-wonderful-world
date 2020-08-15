import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer} from '../../types/typeguards'
import {areasX, boardHeight, boardTop, boardWidth} from '../../util/Styles'
import {isResource, productionSteps} from '../resources/Resource'
import ResourceArea from './ResourceArea'

const Board: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const reducedSize = game.phase === Phase.Draft && game.round > 1
  const playerResources = [...player.availableResources, ...player.bonuses.filter(isResource)]
  return (
    <div css={[style, reducedSize && reducedSizeStyle]}>
      {productionSteps.map(resource =>
        <ResourceArea key={resource} game={game} player={player} resource={resource} canDrag={isPlayer(player)}
                      quantity={playerResources.filter(r => r === resource).length}/>)}
    </div>
  )
}

const style = css`
  position: absolute;
  width: ${boardWidth}%;
  height: ${boardHeight}%;
  left: ${areasX}%;
  top: ${boardTop}%;
  transition: transform 0.5s ease-in-out;
`

const reducedSizeStyle = css`
  transform: translate(15%, -81%) scale(0.5);
`

export default Board