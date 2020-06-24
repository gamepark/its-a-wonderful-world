import React, {FunctionComponent, useMemo, useState} from 'react'
import PlayerScore from './PlayerScore'
import GameView from '../../types/GameView'
import EmpireName from '../../material/empires/EmpireName'
import {usePlayerId} from '@interlude-games/workshop'
import {getPlayersStartingWith} from '../../GameDisplay'
import {css} from '@emotion/core'
import boardArrow from '../../material/board/arrow-white-2.png'
import {useTranslation} from 'react-i18next'

type Props = { game:GameView
} & React.HTMLAttributes<HTMLDivElement>

const ScorePanel: FunctionComponent<Props> = ({game}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayScorePanel, setDisplayScorePanel] = useState(true)
  return (
     <div  css={[scorePanelStyle, !displayScorePanel && hideScorePanelStyle]}>
      {players.map((player, index) =>
          <>
          <button css={[arrowStyle(index), !displayScorePanel && arrowReverseStyle(index)]} onClick={() => setDisplayScorePanel(!displayScorePanel)} title={displayScorePanel?t('Réduire les Scores'):t('Afficher les Scores')}/>
          <PlayerScore player={player} displayScore={displayScorePanel}/>
          </>
        )}
      </div>
  )
}

const scorePanelStyle = css`
    position:absolute;
    top:8%;
    right:20.6%;
    width:auto;
    height:90%;
    display: flex;
    flex-direction: column;
    z-index:5;
    max-width:100%;
    transition:max-width 0.3s ease-in-out;
    overflow:hidden;
`

const hideScorePanelStyle = css`
    max-width:10%;
    transition:max-width 0.3s ease-in-out;
`

const arrowStyle = (index: number) => css`
  position:absolute;
  width: 8vh;
  height: 10vh;
  top:${(4.5 + index*20)}%;
  background-image: url(${boardArrow});
  background-size: cover;
  background-repeat:no-repeat;
  background-color:transparent;
  border:none;
  z-index:6;
`

const arrowReverseStyle = (index: number) => css`
  transform: scaleX(-1);
  width: 4vh;
  height: 5vh;
  top:${(7.5 + index*20)}%;
`

export default ScorePanel