/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {usePlayerId} from '@gamepark/react-client'
import {FunctionComponent, useMemo, useState} from 'react'
import {getPlayersStartingWith} from '../../GameDisplay'
import PlayerScore from './PlayerScore'

type Props = { game: GameView, animation: boolean } & React.HTMLAttributes<HTMLDivElement>

const ScorePanel: FunctionComponent<Props> = ({game, animation}) => {
  const playerId = usePlayerId<EmpireName>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayScore, setDisplayScore] = useState(true)
  return (
    <div css={scorePanelStyle}>
      {players.map((player, index) =>
        <PlayerScore key={player.empire} position={index} player={player} displayScore={displayScore} setDisplayScore={setDisplayScore} animation={animation}/>
      )}
    </div>
  )
}

const scorePanelStyle = css`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 8.5%;
  right: 20.6%;
  min-width: 69%;
  height: 90%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
`

export default ScorePanel