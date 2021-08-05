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
import {useActions, useAnimation, usePlay, usePlayerId, useTutorial} from '@gamepark/react-client'
import {useCallback, useMemo, useRef} from 'react'
import DraftDirectionIndicator from '../material/board/DraftDirectionIndicator'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from '../material/board/ResourceArea'
import CharacterToken from '../material/characters/CharacterToken'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {displayPlayerMove} from '../moves/DisplayPlayer'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardStyle, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY, tokenHeight,
  tokenWidth
} from '../util/Styles'
import useKeyDown from '../util/useKeyDown'
import PlayerPanel from './PlayerPanel'
import ScorePanel from './score/ScorePanel'
import usePlayersStartingWithMe from './usePlayersStartingWithMe'

type Props = {
  game: GameView
}

export default function PlayerPanels({game}: Props) {
  const tutorial = useTutorial()
  const canDisplayOtherPlayers = !tutorial || game.round > 1
  const play = usePlay()
  const playerId = usePlayerId<EmpireName>()
  const players = usePlayersStartingWithMe(game)
  const displayedPlayerId = game.displayedPlayer ?? playerId ?? game.players[0].empire

  const displayPlayer = useCallback((player: EmpireName) => {
    if (canDisplayOtherPlayers) {
      play(displayPlayerMove(player), {local: true})
    }
  }, [canDisplayOtherPlayers, play])

  const displayNextPlayer = useCallback(() => {
    const displayedPlayerIndex = players.findIndex(player => player.empire === displayedPlayerId)
    displayPlayer(players[(displayedPlayerIndex + 1) % players.length].empire)
  }, [displayPlayer, players])
  useKeyDown('ArrowDown', displayNextPlayer)

  const displayPreviousPlayer = useCallback(() => {
    const displayedPlayerIndex = players.findIndex(player => player.empire === displayedPlayerId)
    displayPlayer(players[(displayedPlayerIndex + players.length - 1) % players.length].empire)
  }, [displayPlayer, players])
  useKeyDown('ArrowUp', displayPreviousPlayer)

  const animation = useAnimation<RevealChosenCardsView | ReceiveCharacter>(animation => isRevealChosenCards(animation.move)
    || (isReceiveCharacter(animation.move) && animation.move.playerId !== displayedPlayerId))
  const revealingCards = animation && isRevealChosenCards(animation.move) ? animation.move : undefined
  const supremacyBonus = animation && isReceiveCharacter(animation.move) ? animation.move : undefined
  const actions = useActions()
  const gameOver = isOver(game) && !!actions && actions.every(action => !action.pending)
  const gameWasLive = useRef(!gameOver)
  const revealedCards = useMemo(() => revealingCards && players.filter(player => player.empire !== playerId)
      .map(player => ({empireName: player.empire, card: revealingCards.revealedCards[player.empire]?.card})),
    [revealingCards, players, playerId])
  return (
    <>
      {game.players.length > 2 && game.phase === Phase.Draft && <DraftDirectionIndicator clockwise={game.round % 2 === 1} players={players.length}/>}
      {players.map((player, index) =>
        <PlayerPanel key={player.empire} player={player} onClick={() => displayPlayer(player.empire)} small={players.length > 5}
                     css={[panelPosition(index, players.length), player.empire === displayedPlayerId ? activePanel : (canDisplayOtherPlayers && clickablePanel)]}/>
      )}
      {gameOver && <ScorePanel game={game} animation={gameWasLive.current}/>}
      {revealedCards && revealedCards.map((revealedCard, index) => {
        if (revealedCard.empireName === displayedPlayerId || revealedCard.card === undefined) return null
        return <DevelopmentCard key={revealedCard.card} development={developmentCards[revealedCard.card]}
                                css={[cardStyle, revealedCardStyle, revealedCardPosition(playerId ? index + 1 : index, players.length),
                                  revealedCardAnimation(index, animation!.duration / (playerId ? game.players.length - 1 : game.players.length))]}/>
      })}
      {supremacyBonus && <CharacterToken character={supremacyBonus.character}
                                         css={supremacyBonusAnimation(game.productionStep!, players.findIndex(player => player.empire === supremacyBonus.playerId), animation!.duration, players.length)}/>}
    </>
  )
}

const panelPosition = (position: number, players: number) => css`
  top: ${playerPanelY(position, players)}%;
  right: ${playerPanelRightMargin}%;
  width: ${playerPanelWidth}%;
  height: ${playerPanelHeight(players)}%;
`

const activePanel = css`
  border: 0.2em solid gold;
  box-shadow: 0.2em 0.2em 1em gold;
`

const clickablePanel = css`
  border: 0.2em solid lightslategrey;
  box-shadow: 0.2em 0.2em 1em black;
  cursor: pointer;

  &:hover {
    border: 0.2em solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 0.5em gold;
  }
`

const revealedCardStyle = css`
  position: absolute;
  z-index: 10;
  right: ${playerPanelWidth + 2}%;
`

const revealedCardPosition = (index: number, player: number) => css`
  top: ${playerPanelY(index, player) + playerPanelHeight(player) / 2 - cardHeight / 2}%;
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

const supremacyBonusAnimation = (resource: Resource, panelIndex: number, duration: number, players: number) => {
  const xFrom = (areasX + (getCircleCharacterLeftPosition(resource) + 1) * boardWidth / 100) * 100 / tokenWidth
  const yFrom = (boardTop + (circleCharacterTopPosition + 2) * boardHeight / 100) * 100 / tokenHeight
  const xTo = (100 - playerPanelRightMargin - playerPanelWidth) * 100 / tokenWidth
  const yTo = (playerPanelY(panelIndex, players) + playerPanelHeight(players)) * 100 / tokenHeight
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