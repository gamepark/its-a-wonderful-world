import {css, keyframes} from '@emotion/core'
import {Letterbox, useAnimation, useDisplayState, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import Board from './material/board/Board'
import DraftDirectionIndicator from './material/board/DraftDirectionIndicator'
import DevelopmentCard from './material/developments/DevelopmentCard'
import {developmentCards} from './material/developments/Developments'
import DiscardPile from './material/developments/DiscardPile'
import DrawPile from './material/developments/DrawPile'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'
import {isRevealChosenCards, RevealChosenCardsView} from './moves/RevealChosenCards'
import DisplayedEmpire from './players/DisplayedEmpire'
import PlayerPanel from './players/PlayerPanel'
import {numberOfRounds} from './Rules'
import GameView from './types/GameView'
import Phase from './types/Phase'
import {cardHeight, cardStyle, playerPanelHeight, playerPanelWidth, playerPanelY} from './util/Styles'
import RoundTracker from './material/board/RoundTracker'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const gameOver = game.round === numberOfRounds && game.phase === Phase.Production && game.productionStep === Resource.Exploration && game.players.every(player => player.ready)
  const playerId = usePlayerId<EmpireName>()
  const [displayedEmpire, setDisplayedEmpire] = useDisplayState(playerId || game.players[0].empire)
  let playersStartingWithMyself = game.players
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.empire === playerId)
    playersStartingWithMyself = [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  }
  const displayedPlayerPanelIndex = playersStartingWithMyself.findIndex(player => player.empire === displayedEmpire)
  const displayedPlayer = playersStartingWithMyself[displayedPlayerPanelIndex]!
  const revealingCards = useAnimation<RevealChosenCardsView>(animation => isRevealChosenCards(animation.move))
  const sortByPanel = (entries: [EmpireName, number][]) => {
    entries.sort((a, b) => playersStartingWithMyself.findIndex(p => p.empire === a[0]) - playersStartingWithMyself.findIndex(p => p.empire === b[0]))
    return entries
  }
  const revealedCards = revealingCards && sortByPanel(Object.entries(revealingCards.move.revealedCards) as [EmpireName, number][])
    .filter((_, index) => !playerId || index !== 0).map<number>(entry => entry[1])
  return (
    <Letterbox css={hiddenOnPortrait}>
      {!gameOver && <Board game={game} player={displayedPlayer}/>}
      <RoundTracker round={game.round}/>
      {!gameOver && <DrawPile game={game}/>}
      {!gameOver && <DiscardPile game={game}/>}
      <DisplayedEmpire game={game} player={displayedPlayer} showAreas={!gameOver} panelIndex={displayedPlayerPanelIndex}/>
      {game.players.length > 2 && game.phase === Phase.Draft &&
      <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={playersStartingWithMyself}/>}
      {playersStartingWithMyself.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} position={index} onClick={() => setDisplayedEmpire(player.empire)}
                     highlight={player.empire === displayedEmpire} showScore={gameOver}/>
      )}
      {revealedCards && revealedCards.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]}
                         css={[cardStyle, revealedCardStyle, revealedCardPosition(playerId ? index + 1 : index),
                           revealedCardAnimation(index, revealingCards!.duration / (playerId ? game.players.length - 1 : game.players.length))]}/>)}
    </Letterbox>
  )
}

const hiddenOnPortrait = css`
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

export default GameDisplay