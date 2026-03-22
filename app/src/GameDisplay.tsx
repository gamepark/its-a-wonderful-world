import { pointerWithin } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { DevToolsHub, GameTable, GameTableNavigation } from '@gamepark/react-game'
import { Board } from './components/Board'
import { PhaseIndicator } from './components/PhaseIndicator'
import { PlanningButtons } from './components/PlanningButtons'
import { RoundTracker } from './components/RoundTracker'
import { ValidateButton } from './components/ValidateButton'
import { PlayerPanels } from './panels/PlayerPanels'

export function GameDisplay() {
  return (
    <>
      <GameTable
        xMin={-37}
        xMax={45}
        yMin={-18.5}
        yMax={22}
        zoom={false}
        css={process.env.NODE_ENV === 'development' && tableBorder}
        collisionAlgorithm={pointerWithin}
      >
        <GameTableNavigation />
        <PlayerPanels />
        <RoundTracker />
        <PhaseIndicator />
        <PlanningButtons />
        <ValidateButton />
        <Board />
        {process.env.NODE_ENV === 'development' && <DevToolsHub fabBottom="calc(1em + 6em * 1.7)" />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 0.03em solid white;
`
