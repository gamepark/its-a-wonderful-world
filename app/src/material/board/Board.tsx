/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {isResource, productionSteps} from '@gamepark/its-a-wonderful-world/material/Resource'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {FunctionComponent} from 'react'
import {areasX, boardHeight, boardTop, boardWidth} from '../../util/Styles'
import ResourceArea from './ResourceArea'

type Props = {
  game: GameView
  player: Player | PlayerView
  validate: () => void
}

const Board: FunctionComponent<Props> = ({game, player, validate}) => {
  const reducedSize = game.phase === Phase.Draft && game.round > 1
  const playerResources = [...player.availableResources, ...player.bonuses.filter(isResource)]
  return (
    <div css={[style, reducedSize && reducedSizeStyle]}>
      {productionSteps.map(resource =>
        <ResourceArea key={resource} game={game} player={player} resource={resource} quantity={playerResources.filter(r => r === resource).length}
                      validate={validate}/>)}
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