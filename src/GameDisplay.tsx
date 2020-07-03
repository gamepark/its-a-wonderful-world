import {css, keyframes} from '@emotion/core'
import {Letterbox, useAnimation, useDisplayState, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useEffect, useMemo, useRef, useState} from 'react'
import bellSound from './material/bell-sound.wav'
import Board from './material/board/Board'
import DraftDirectionIndicator from './material/board/DraftDirectionIndicator'
import PhaseIndicator from './material/board/PhaseIndicator'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from './material/board/ResourceArea'
import RoundTracker from './material/board/RoundTracker'
import CharacterToken from './material/characters/CharacterToken'
import DevelopmentCard from './material/developments/DevelopmentCard'
import {developmentCards} from './material/developments/Developments'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'
import ReceiveCharacter, {isReceiveCharacter} from './moves/ReceiveCharacter'
import {isRevealChosenCards, RevealChosenCardsView} from './moves/RevealChosenCards'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanel from './players/PlayerPanel'
import ScorePanel from './players/score/ScorePanel'
import {isActive, isOver} from './Rules'
import GameView from './types/GameView'
import Phase from './types/Phase'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardStyle, fadeIn, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY,
  tokenHeight,
  tokenWidth
} from './util/Styles'

const SOUND_ALERT_INACTIVITY_THRESHOLD = 20000 // ms

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
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
  const playerInactiveUntil = useRef<number | undefined>(Date.now())
  const [bellAlert] = useState(new Audio(bellSound))
  useEffect(() => {
    const isPlayerActive = playerId ? isActive(game, playerId) : false
    if (isPlayerActive) {
      if (playerInactiveUntil.current) {
        if (Date.now() - playerInactiveUntil.current > SOUND_ALERT_INACTIVITY_THRESHOLD) {
          bellAlert.play()
        }
        playerInactiveUntil.current = undefined
      }
    } else if (!playerInactiveUntil.current) {
      playerInactiveUntil.current = Date.now()
    }
  }, [game, playerId, bellAlert])
  const revealedCards = revealingCards && sortByPanel(Object.entries(revealingCards.revealedCards) as [EmpireName, number][])
    .filter((_, index) => !playerId || index !== 0).map<number>(entry => entry[1])
  return (
    <Letterbox css={hiddenOnPortrait}>
      <Board game={game} player={displayedPlayer}/>
      <RoundTracker round={game.round}/>
      <PhaseIndicator phase={game.phase}/>
      <DrawPile game={game} />
      <DiscardPile game={game}/>
      <DisplayedEmpire game={game} player={displayedPlayer} panelIndex={displayedPlayerPanelIndex}/>
      {game.players.length > 2 && game.phase === Phase.Draft &&
      <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={players}/>}
      {players.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} position={index} onClick={() => setDisplayedEmpire(player.empire)}
                     highlight={player.empire === displayedEmpire} showScore={isOver(game)}/>
      )}
      {isOver(game) && <ScorePanel game={game}/>}
      {revealedCards && revealedCards.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]}
                         css={[cardStyle, revealedCardStyle, revealedCardPosition(playerId ? index + 1 : index),
                           revealedCardAnimation(index, animation!.duration / (playerId ? game.players.length - 1 : game.players.length))]}/>)}

      {supremacyBonus && <CharacterToken character={supremacyBonus.character}
                                         css={supremacyBonusAnimation(game.productionStep!, players.findIndex(player => player.empire === supremacyBonus.playerId), animation!.duration)}/>}
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

const hiddenOnPortrait = css`
  animation: ${fadeIn} 2s ease-in forwards;
  @media all and (orientation:portrait) {
    display: none !important;
  }
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
  const xFrom = (areasX + getCircleCharacterLeftPosition(resource) * boardWidth / 100) * 100 / tokenWidth
  const yFrom = (boardTop + circleCharacterTopPosition * boardHeight / 100) * 100 / tokenHeight
  const xTo = (100 - playerPanelRightMargin - playerPanelWidth / 2) * 100 / tokenWidth
  const yTo = (playerPanelY(panelIndex) + playerPanelHeight / 2) * 100 / tokenHeight
  const keyframe = keyframes`
    from { transform: translate(${xFrom - 50}%, ${yFrom - 50}%) scale(0.4) translate(50%, 50%); }
    to { transform: translate(${xTo - 50}%, ${yTo - 50}%); }
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