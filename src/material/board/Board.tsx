import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../../types/GameView'
import Phase from '../../types/Phase'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import {isPlayer} from '../../types/typeguards'
import Resource, {isResource} from '../resources/Resource'
import ResourceArea from './ResourceArea'

const Board: FunctionComponent<{ game: GameView, player: Player | PlayerView }> = ({game, player}) => {
  const reducedSize = game.phase === Phase.Draft && game.round > 1
  const resources = [...player.availableResources, ...player.bonuses.filter(isResource)]
  const allresources = [Resource.Materials,Resource.Energy,Resource.Science,Resource.Gold,Resource.Exploration]
  return (
    <div css={boardCircles(reducedSize)}>
        {[...allresources].map(resource =>
          <ResourceArea key={resource} game={game} player={player} resource={resource} canDrag={isPlayer(player)}
                      quantity={resources.filter(r => r === resource).length}/>)}
    </div>
  )
}

const boardCircles = (reducedSize = false) => css`
  position: absolute;
  width: 68%;
  height: 34%;
  top: 21%;
  left: 45%;
  transform: translateX(-50%);
  transition: transform 0.5s ease-in-out;
  ${reducedSize && css`transform: translate(-60%, -64%) scale(0.5); `}
`

export default Board