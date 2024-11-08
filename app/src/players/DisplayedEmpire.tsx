/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {isOver} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {usePlayers} from '@gamepark/react-client'
import {useTranslation} from 'react-i18next'
import CharacterTokenPile from '../material/characters/CharacterTokenPile'
import EmpireCard from '../material/empires/EmpireCard'
import {
  charactersPilesY, empireCardBottomMargin, empireCardHeight, empireCardLeftMargin, empireCardWidth, financiersPileX, generalsPileX, tokenHeight, tokenWidth
} from '../util/Styles'
import ConstructedCardsArea from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import OtherPlayerHand from './OtherPlayerHand'
import PlayerHand from './PlayerHand'
import RecyclingDropArea from './RecyclingDropArea'

type Props = {
  game: GameView
  player: Player | PlayerView
}

export default function DisplayedEmpire({game, player}: Props) {
  const {t} = useTranslation()
  const players = usePlayers<EmpireName>()
  const getName = (empire: EmpireName) => players.find(p => p.id === empire)?.name || getPlayerName(empire, t)
  const gameOver = isOver(game)
  const moveUpEmpire = isPlayer(player) && game.ascensionDeck !== undefined && game.phase === Phase.Draft && (players.length === 2 || players.length === 4)
  return (
    <>
      <EmpireCard css={[empirePosition, moveUpEmpire && moveUpCss]} player={player} gameOver={gameOver} withResourceDrop={isPlayer(player)}/>
      <DraftArea game={game} player={player}/>
      {(game.round > 1 || game.phase !== Phase.Draft) && <ConstructionArea game={game} gameOver={gameOver} player={player}/>}
      {!gameOver && <RecyclingDropArea empire={player.empire}/>}
      <ConstructedCardsArea player={player} moveUp={moveUpEmpire}/>
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} player={player} gameOver={gameOver}
                          title={isPlayer(player) ?
                            t('You have {quantity, plural, one{# Financier token} other{# Financier tokens}}',
                              {quantity: player.characters[Character.Financier]}) :
                            t('{player} has {quantity, plural, one{# Financier token} other{# Financier tokens}}',
                              {player: getName(player.empire), quantity: player.characters[Character.Financier]})}
                          css={[financiersPilePosition, isPlayer(player) && pointerCursor, moveUpEmpire && moveUpCss]} draggable={isPlayer(player)}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} player={player} gameOver={gameOver}
                          title={isPlayer(player) ?
                            t('You have {quantity, plural, one{# General token} other{# General tokens}}',
                              {quantity: player.characters[Character.General]}) :
                            t('{player} has {quantity, plural, one{# General token} other{# General tokens}}',
                              {player: getName(player.empire), quantity: player.characters[Character.General]})}
                          css={[generalsPilePosition, isPlayer(player) && pointerCursor, moveUpEmpire && moveUpCss]} draggable={isPlayer(player)}/>
      {isPlayer(player) ? <PlayerHand player={player} game={game}/> : <OtherPlayerHand player={player} game={game}/>}
    </>
  )
}

const empirePosition = css`
  position: absolute;
  left: ${empireCardLeftMargin}%;
  bottom: ${empireCardBottomMargin}%;
  height: ${empireCardHeight}%;
  width: ${empireCardWidth}%;
`

const financiersPilePosition = css`
  position: absolute;
  transition: transform 0.2s ease-in-out;
  left: ${financiersPileX}%;
  top: ${charactersPilesY}%;
  width: ${tokenWidth}%;
  height: ${tokenHeight}%;
`

const generalsPilePosition = css`
  position: absolute;
  transition: transform 0.2s ease-in-out;
  left: ${generalsPileX}%;
  top: ${charactersPilesY}%;
  width: ${tokenWidth}%;
  height: ${tokenHeight}%;
`

const pointerCursor = css`
  cursor: pointer;
`

const moveUpCss = css`
  transform: translateY(-27em)
`
