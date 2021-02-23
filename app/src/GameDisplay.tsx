import {css, keyframes} from '@emotion/core'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import ReceiveCharacter, {isReceiveCharacter} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import {isRevealChosenCards, RevealChosenCardsView} from '@gamepark/its-a-wonderful-world/moves/RevealChosenCards'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {getPlayer, isOver} from '@gamepark/its-a-wonderful-world/Rules'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {Letterbox, useActions, useAnimation, useDisplayState, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useEffect, useMemo, useRef, useState} from 'react'
import GlobalActions from './GlobalActions'
import Board from './material/board/Board'
import DraftDirectionIndicator from './material/board/DraftDirectionIndicator'
import PhaseIndicator from './material/board/PhaseIndicator'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from './material/board/ResourceArea'
import RoundTracker from './material/board/RoundTracker'
import CharacterToken from './material/characters/CharacterToken'
import DevelopmentCard from './material/developments/DevelopmentCard'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanel from './players/PlayerPanel'
import ScorePanel from './players/score/ScorePanel'
import TutorialPopup from './TutorialPopup'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardStyle, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY, tokenHeight,
  tokenWidth
} from './util/Styles'
import {useBellAlert} from './util/useBellAlert'
import WelcomePopup from './WelcomePopup'

type Props = {
  game: GameView
  validate: () => void
}

const GameDisplay: FunctionComponent<Props> = ({game, validate}) => {
  const playerId = usePlayerId<EmpireName>()
  const [displayedEmpire, setDisplayedEmpire] = useDisplayState(playerId || game.players[0].empire)
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const displayedPlayerPanelIndex = players.findIndex(player => player.empire === displayedEmpire)
  const displayedPlayer = players[displayedPlayerPanelIndex]!
  const animation = useAnimation<RevealChosenCardsView | ReceiveCharacter>(animation => isRevealChosenCards(animation.move)
    || (isReceiveCharacter(animation.move) && animation.move.playerId !== displayedPlayer.empire))
  const revealingCards = animation && isRevealChosenCards(animation.move) ? animation.move : undefined
  const supremacyBonus = animation && isReceiveCharacter(animation.move) ? animation.move : undefined
  const sortByPanel = (entries: [EmpireName, number][]) => {
    entries.sort((a, b) => players.findIndex(p => p.empire === a[0]) - players.findIndex(p => p.empire === b[0]))
    return entries
  }
  const actions = useActions()
  const gameOver = isOver(game) && !!actions && actions.every(action => !action.pending)
  const gameWasLive = useRef(!gameOver)
  useEffect(() => {
    const onkeydown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') {
        switchPlayer(1)
      } else if (event.code === 'ArrowUp') {
        switchPlayer(-1)
      }
    }
    const switchPlayer = (increment: number) => {
      const displayedPlayerIndex = players.findIndex(player => player.empire === displayedEmpire)
      setDisplayedEmpire(players[(displayedPlayerIndex + players.length + increment) % players.length].empire)
    }
    window.document.addEventListener('keydown', onkeydown)
    return () => window.document.removeEventListener('keydown', onkeydown)
  }, [players, displayedEmpire, setDisplayedEmpire])
  useBellAlert(game)
  const [welcomePopupClosed, setWelcomePopupClosed] = useState(false)
  const showWelcomePopup = game.round === 1 && game.phase === Phase.Draft && !game.tutorial && !welcomePopupClosed
  const revealedCards = revealingCards && sortByPanel(Object.entries(revealingCards.revealedCards) as [EmpireName, number][])
    .filter((_, index) => !playerId || index !== 0).map<number>(entry => entry[1])
  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <Board game={game} player={displayedPlayer} validate={validate}/>
      <RoundTracker round={game.round}/>
      <PhaseIndicator phase={game.phase}/>
      <DrawPile game={game}/>
      <DiscardPile game={game}/>
      <DisplayedEmpire game={game} player={displayedPlayer} panelIndex={displayedPlayerPanelIndex}/>
      {game.players.length > 2 && game.phase === Phase.Draft &&
      <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={players}/>}
      {players.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} position={index} highlight={player.empire === displayedEmpire} showScore={gameOver}
                     onClick={() => (!game.tutorial || game.round > 1) && setDisplayedEmpire(player.empire)}/>
      )}
      {gameOver && <ScorePanel game={game} animation={gameWasLive.current}/>}
      {revealedCards && revealedCards.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]}
                         css={[cardStyle, revealedCardStyle, revealedCardPosition(playerId ? index + 1 : index),
                           revealedCardAnimation(index, animation!.duration / (playerId ? game.players.length - 1 : game.players.length))]}/>)}

      {supremacyBonus && <CharacterToken character={supremacyBonus.character}
                                         css={supremacyBonusAnimation(game.productionStep!, players.findIndex(player => player.empire === supremacyBonus.playerId), animation!.duration)}/>}
      {isPlayer(displayedPlayer) && <GlobalActions game={game} player={displayedPlayer} validate={validate}/>}
      {game.tutorial && <TutorialPopup game={game}/>}
      {showWelcomePopup && playerId && <WelcomePopup player={getPlayer(game, playerId)} close={() => setWelcomePopupClosed(true)}/>}
    </Letterbox>
  )
}

export const getPlayersStartingWith = (game: GameView, playerId?: EmpireName) => {
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.empire === playerId)
    return [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  } else {
    return game.players
  }
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

const revealedCardStyle = css`
  position: absolute;
  z-index: 10;
  right: ${playerPanelWidth + 2}%;
`

const revealedCardPosition = (index: number) => css`
  top: ${playerPanelY(index) + playerPanelHeight / 2 - cardHeight / 2}%;
`

const revealCardKeyframe = keyframes`
  from, to {
    transform: translateX(100%) scale(0);
  }
  30%, 70% {
    transform: none;
  }
`

const revealedCardAnimation = (order: number, duration: number) => {
  return css`animation: ${revealCardKeyframe} ${duration}s ${order * duration * 7 / 10}s ease-in-out both`
}

const supremacyBonusAnimation = (resource: Resource, panelIndex: number, duration: number) => {
  const xFrom = (areasX + (getCircleCharacterLeftPosition(resource) + 1) * boardWidth / 100) * 100 / tokenWidth
  const yFrom = (boardTop + (circleCharacterTopPosition + 2) * boardHeight / 100) * 100 / tokenHeight
  const xTo = (100 - playerPanelRightMargin - playerPanelWidth) * 100 / tokenWidth
  const yTo = (playerPanelY(panelIndex) + playerPanelHeight) * 100 / tokenHeight
  const keyframe = keyframes`
    from {
      transform: translate(${xFrom - 50}%, ${yFrom - 50}%) scale(0.5) translate(50%, 50%);
    }
    to {
      transform: translate(${xTo}%, ${yTo - 100}%) scale(0.55);
    }
  `
  return css`
    position: absolute;
    width: ${tokenWidth}%;
    height: ${tokenHeight}%;
    z-index: 10;
    animation: ${keyframe} ${duration}s ease-in-out forwards;
  `
}

export default GameDisplay