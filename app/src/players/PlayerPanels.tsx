/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {isOver} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import ReceiveCharacter, {isReceiveCharacter} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import {isRevealChosenCards, RevealChosenCardsView} from '@gamepark/its-a-wonderful-world/moves/RevealChosenCards'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {useActions, useAnimation, useDisplayState, usePlayerId} from '@gamepark/react-client'
import {useEffect, useMemo, useRef} from 'react'
import DraftDirectionIndicator from '../material/board/DraftDirectionIndicator'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from '../material/board/ResourceArea'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardStyle, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY, tokenHeight,
  tokenWidth
} from '../util/Styles'
import PlayerPanel from './PlayerPanel'
import ScorePanel from './score/ScorePanel'

type Props = {
  game: GameView
}

export default function PlayerPanels({game}: Props) {
  const playerId = usePlayerId<EmpireName>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayedEmpire, setDisplayedEmpire] = useDisplayState<EmpireName | undefined>(undefined)
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
  const animation = useAnimation<RevealChosenCardsView | ReceiveCharacter>(animation => isRevealChosenCards(animation.move)
    || (isReceiveCharacter(animation.move) && animation.move.playerId !== displayedEmpire))
  const revealingCards = animation && isRevealChosenCards(animation.move) ? animation.move : undefined
  const supremacyBonus = animation && isReceiveCharacter(animation.move) ? animation.move : undefined
  const sortByPanel = (entries: [EmpireName, number][]) => {
    entries.sort((a, b) => players.findIndex(p => p.empire === a[0]) - players.findIndex(p => p.empire === b[0]))
    return entries
  }
  const actions = useActions()
  const gameOver = isOver(game) && !!actions && actions.every(action => !action.pending)
  const gameWasLive = useRef(!gameOver)
  const revealedCards = revealingCards && sortByPanel(Object.entries(revealingCards.revealedCards) as [EmpireName, number][])
    .filter((_, index) => !playerId || index !== 0).map<number>(entry => entry[1])
  return (
    <>
      {game.players.length > 2 && game.phase === Phase.Draft && <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={players.length}/>}
      {players.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} position={index} highlight={player.empire === displayedEmpire}
                     onClick={() => (!game.tutorial || game.round > 1) && setDisplayedEmpire(player.empire)}/>
      )}
      {gameOver && <ScorePanel game={game} animation={gameWasLive.current}/>}
      {revealedCards && revealedCards.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]}
                         css={[cardStyle, revealedCardStyle, revealedCardPosition(playerId ? index + 1 : index),
                           revealedCardAnimation(index, animation!.duration / (playerId ? game.players.length - 1 : game.players.length))]}/>)}

      {supremacyBonus && <CharacterToken character={supremacyBonus.character}
                                         css={supremacyBonusAnimation(game.productionStep!, players.findIndex(player => player.empire === supremacyBonus.playerId), animation!.duration)}/>}
    </>
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