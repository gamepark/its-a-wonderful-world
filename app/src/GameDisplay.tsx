/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useDisplayState, usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import {useState} from 'react'
import GlobalActions from './GlobalActions'
import Board from './material/board/Board'
import PhaseIndicator from './material/board/PhaseIndicator'
import RoundTracker from './material/board/RoundTracker'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanels from './players/PlayerPanels'
import TutorialPopup from './tutorial/TutorialPopup'
import {useBellAlert} from './util/useBellAlert'
import WelcomePopup from './WelcomePopup'

type Props = {
  game: GameView
  validate: () => void
}

export default function GameDisplay({game, validate}: Props) {
  const playerId = usePlayerId<EmpireName>()
  const [displayedEmpire] = useDisplayState(playerId || game.players[0].empire)
  const player = game.players.find(player => player.empire === playerId)
  const displayedPlayer = game.players.find(player => player.empire === displayedEmpire)
  const tutorial = useTutorial()
  useBellAlert(game)
  const [welcomePopupClosed, setWelcomePopupClosed] = useState(false)
  const showWelcomePopup = game.round === 1 && game.phase === Phase.Draft && !game.tutorial && !welcomePopupClosed
  if (!displayedPlayer) return null
  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <Board game={game} player={displayedPlayer} validate={validate}/>
      <RoundTracker round={game.round}/>
      <PhaseIndicator phase={game.phase}/>
      <DrawPile game={game}/>
      <DiscardPile game={game}/>
      <DisplayedEmpire game={game} player={displayedPlayer}/>
      <PlayerPanels game={game}/>
      {isPlayer(displayedPlayer) && <GlobalActions game={game} player={displayedPlayer} validate={validate}/>}
      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}
      {showWelcomePopup && player && <WelcomePopup player={player} close={() => setWelcomePopupClosed(true)}/>}
    </Letterbox>
  )
}

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`