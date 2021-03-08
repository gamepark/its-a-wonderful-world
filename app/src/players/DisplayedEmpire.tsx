/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {getPlayerName, isOver} from '@gamepark/its-a-wonderful-world/Rules'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {usePlayers} from '@gamepark/react-client'
import {FunctionComponent} from 'react'
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
  panelIndex: number
}

const DisplayedEmpire: FunctionComponent<Props> = ({game, player, panelIndex}) => {
  const {t} = useTranslation()
  const players = usePlayers<EmpireName>()
  const getName = (empire: EmpireName) => players.find(p => p.id === empire)?.name || getPlayerName(empire, t)
  const gameOver = isOver(game)
  return (
    <>
      <EmpireCard css={empirePosition} player={player} gameOver={gameOver} withResourceDrop={isPlayer(player)}/>
      <DraftArea game={game} player={player}/>
      {(game.round > 1 || game.phase !== Phase.Draft) && <ConstructionArea game={game} gameOver={gameOver} player={player}/>}
      {!gameOver && <RecyclingDropArea empire={player.empire}/>}
      <ConstructedCardsArea player={player}/>
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} player={player} gameOver={gameOver}
                          title={isPlayer(player) ?
                            t('You have {quantity, plural, one{# Financier token} other{# Financier tokens}}',
                              {quantity: player.characters[Character.Financier]}) :
                            t('{player} has {quantity, plural, one{# Financier token} other{# Financier tokens}}',
                              {player: getName(player.empire), quantity: player.characters[Character.Financier]})}
                          css={financiersPilePosition} draggable={isPlayer(player)}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} player={player} gameOver={gameOver}
                          title={isPlayer(player) ?
                            t('You have {quantity, plural, one{# General token} other{# General tokens}}',
                              {quantity: player.characters[Character.General]}) :
                            t('{player} has {quantity, plural, one{# General token} other{# General tokens}}',
                              {player: getName(player.empire), quantity: player.characters[Character.General]})}
                          css={generalsPilePosition} draggable={isPlayer(player)}/>
      {isPlayer(player) ?
        <PlayerHand player={player} players={game.players.length} round={game.round}/> :
        <OtherPlayerHand player={player} players={game.players.length} round={game.round} panelIndex={panelIndex}/>
      }
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
  left: ${financiersPileX}%;
  top: ${charactersPilesY}%;
  width: ${tokenWidth}%;
  height: ${tokenHeight}%;
`

const generalsPilePosition = css`
  position: absolute;
  left: ${generalsPileX}%;
  top: ${charactersPilesY}%;
  width: ${tokenWidth}%;
  height: ${tokenHeight}%;
`

export default DisplayedEmpire