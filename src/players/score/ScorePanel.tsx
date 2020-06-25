import React, {FunctionComponent, useMemo, useState} from 'react'
import PlayerScore from './PlayerScore'
import GameView from '../../types/GameView'
import EmpireName from '../../material/empires/EmpireName'
import {usePlayerId} from '@interlude-games/workshop'
import {getPlayersStartingWith} from '../../GameDisplay'
import {css} from '@emotion/core'

type Props = { game:GameView
} & React.HTMLAttributes<HTMLDivElement>

const ScorePanel: FunctionComponent<Props> = ({game}) => {
  const playerId = usePlayerId<EmpireName>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayScore, setDisplayScore] = useState(true)
  return (
     <div  css={scorePanelStyle}>
      {players.map((player, index) =>
          <>
          <PlayerScore position={index} player={player} displayScore={displayScore} setDisplayScore={setDisplayScore}/>
          </>
        )}
      </div>
  )
}

const scorePanelStyle = css`
    position:absolute;
    display:flex;
    justify-content:flex-end;
    top:8.5%;
    right:20.6%;
    width:75%;
    height:90%;
    z-index:5;   
    overflow:hidden;
`

export default ScorePanel