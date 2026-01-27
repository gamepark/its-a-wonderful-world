import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { useGame, usePlay, usePlayers, useRules } from '@gamepark/react-game'
import { LocalMoveType, MaterialGame, MaterialRules, MoveKind } from '@gamepark/rules-api'
import { useRef } from 'react'
import { DraftDirectionIndicator } from '../components/DraftDirectionIndicator'
import { PlayerPanel } from './PlayerPanel'
import { ScorePanel } from './score/ScorePanel'

// Panel dimensions in em (converted from v2 percentages: height% * 0.435, width% * 0.773)
const playerPanelWidth = 15
const playerPanelHeight = (players: number) => players > 5 ? 5 : 7.3
const playerPanelMargin = 0.65
const playerPanelRightMargin = 0.8

// Calculate panel Y position based on index and total players
const playerPanelY = (index: number, players: number) =>
  playerPanelMargin + index * (playerPanelHeight(players) + playerPanelMargin)

// Draft phase rule IDs
const draftRuleIds = [
  RuleId.ChooseDevelopmentCard,
  RuleId.RevealChosenCards,
  RuleId.PassCards
]

export const PlayerPanels = () => {
  const players = usePlayers<Empire>({ sortFromMe: true })
  const rules = useRules<MaterialRules>()
  const play = usePlay()

  const game = useGame<MaterialGame>()

  const defaultView = players[0]?.id
  const currentView = rules?.game.view ?? defaultView
  const isSmall = players.length > 5

  // Determine if we're in draft phase and the draft direction
  const currentRuleId = rules?.game.rule?.id
  const isDraftPhase = currentRuleId !== undefined && draftRuleIds.includes(currentRuleId)
  const round = rules?.remind(Memory.Round) ?? 1

  // Disable opponent panel navigation during tutorial round 1 (like v2)
  const canDisplayOtherPlayers = !game?.tutorial || round > 1
  const isClockwise = round % 2 === 1

  // Detect game over: no active rule but players exist
  const gameOver = rules?.game.rule === undefined && !!rules?.game.players?.length
  // Track if game was live (not game over when component first mounted) to control animation
  const wasLive = useRef(!gameOver)
  const animate = gameOver && wasLive.current

  return (
    <>
      {players.map((player, index) => {
        const isActive = player.id === currentView
        return (
          <PlayerPanel
            key={player.id}
            playerId={player.id}
            small={isSmall}
            gameOver={gameOver}
            css={[
              panelPosition(index, players.length),
              isActive ? activePanel : (canDisplayOtherPlayers && clickablePanel)
            ]}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (canDisplayOtherPlayers) {
                play(
                  { kind: MoveKind.LocalMove, type: LocalMoveType.ChangeView, view: player.id },
                  { transient: true }
                )
              }
            }}
          />
        )
      })}
      {/* Draft direction indicators between panels - only show for 3+ players during draft */}
      {isDraftPhase && players.length > 2 && players.slice(0, -1).map((_, index) => (
        <DraftDirectionIndicator
          key={`arrow-${index}`}
          clockwise={isClockwise}
          css={arrowPosition(index, players.length)}
        />
      ))}
      {gameOver && <ScorePanel animation={animate} playerCount={players.length} />}
    </>
  )
}

const panelPosition = (index: number, playerCount: number) => css`
  top: ${playerPanelY(index, playerCount)}em;
  right: ${playerPanelRightMargin}em;
  width: ${playerPanelWidth}em;
  height: ${playerPanelHeight(playerCount)}em;
`

const activePanel = css`
  border: 0.1em solid gold;
  box-shadow: 0.1em 0.1em 0.5em gold;
  cursor: pointer;
`

const clickablePanel = css`
  border: 0.1em solid lightslategrey;
  box-shadow: 0.1em 0.1em 0.5em black;
  cursor: pointer;

  &:hover {
    border: 0.1em solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 0.25em gold;
  }
`

// Position arrows between panels, centered horizontally with the panel
const arrowPosition = (index: number, playerCount: number) => css`
  top: ${playerPanelY(index, playerCount) + playerPanelHeight(playerCount) + (playerPanelMargin - 1.8) / 2}em;
  right: ${playerPanelRightMargin + playerPanelWidth / 2 - 1.2}em;
`
