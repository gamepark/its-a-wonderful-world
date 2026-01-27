/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { usePlayers } from '@gamepark/react-game'
import { useState } from 'react'
import { PlayerScore } from './PlayerScore'

type Props = {
  animation: boolean
  playerCount: number
}

// Panel dimensions must match PlayerPanels.tsx
const playerPanelHeight = (players: number) => players > 5 ? 5 : 7.3
const playerPanelMargin = 0.65
const playerPanelRightMargin = 0.8
const playerPanelWidth = 15

const playerPanelY = (index: number, players: number) =>
  playerPanelMargin + index * (playerPanelHeight(players) + playerPanelMargin)

export const ScorePanel = ({ animation, playerCount }: Props) => {
  const players = usePlayers<Empire>({ sortFromMe: true })
  const [displayScore, setDisplayScore] = useState(true)
  const isSmall = playerCount > 5

  return (
    <div css={scorePanelStyle}>
      {players.map((player, index) => (
        <PlayerScore
          key={player.id}
          playerId={player.id}
          displayScore={displayScore}
          setDisplayScore={setDisplayScore}
          animation={animation}
          css={playerScorePosition(index, playerCount)}
        />
      ))}
    </div>
  )
}

const scorePanelStyle = css`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  right: ${playerPanelRightMargin + playerPanelWidth}em;
  top: 0;
  min-width: 50em;
  height: 100%;
  transform: translateZ(20em);
  pointer-events: none;
`

const playerScorePosition = (index: number, playerCount: number) => css`
  position: absolute;
  height: ${playerPanelHeight(playerCount)}em;
  top: ${playerPanelY(index, playerCount)}em;
  right: 0;
`
