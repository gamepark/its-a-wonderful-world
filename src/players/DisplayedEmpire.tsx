import {css} from '@emotion/core'
import {usePlayers} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from '../material/characters/Character'
import CharacterTokenPile from '../material/characters/CharacterTokenPile'
import EmpireCard, {getEmpireName} from '../material/empires/EmpireCard'
import EmpireName from '../material/empires/EmpireName'
import GameView from '../types/GameView'
import Phase from '../types/Phase'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {charactersPilesY, financiersPileX, generalsPileX, tokenHeight, tokenWidth} from '../util/Styles'
import ConstructedCardsArea from './ConstructedCardsArea'
import ConstructionArea from './ConstructionArea'
import DraftArea from './DraftArea'
import OtherPlayerHand from './OtherPlayerHand'
import PlayerHand from './PlayerHand'
import RecyclingDropArea from './RecyclingDropArea'

type Props = {
  game: GameView
  player: Player | PlayerView
  gameOver: boolean
  panelIndex: number
}

const DisplayedEmpire: FunctionComponent<Props> = ({game, player, gameOver, panelIndex}) => {
  const {t} = useTranslation()
  const players = usePlayers<EmpireName>()
  const getPlayerName = (empire: EmpireName) => players.find(p => p.id === empire)?.name ?? getEmpireName(t, empire)
  return (
    <>
      <EmpireCard player={player} withResourceDrop={isPlayer(player)}/>
      {!gameOver &&
      <>
        <DraftArea game={game} player={player}/>
        {(game.round > 1 || game.phase !== Phase.Draft) && <ConstructionArea game={game} player={player}/>}
        <RecyclingDropArea empire={player.empire}/>
      </>
      }
      <ConstructedCardsArea player={player}/>
      <CharacterTokenPile character={Character.Financier} quantity={player.characters[Character.Financier]} player={player}
                          title={isPlayer(player) ?
                            t('Vous avez {quantity, plural, one{# jeton Financier} other{# jetons Financiers}}',
                              {quantity: player.characters[Character.Financier]}) :
                            t('{player} a {quantity, plural, one{# jeton Financier} other{# jetons Financiers}}',
                              {player: getPlayerName(player.empire), quantity: player.characters[Character.Financier]})}
                          css={financiersPilePosition} draggable={isPlayer(player)}/>
      <CharacterTokenPile character={Character.General} quantity={player.characters[Character.General]} player={player}
                          title={isPlayer(player) ?
                            t('Vous avez {quantity, plural, one{# jeton Général} other{# jetons Généraux}}',
                              {quantity: player.characters[Character.General]}) :
                            t('{player} a {quantity, plural, one{# jeton Général} other{# jetons Généraux}}',
                              {player: getPlayerName(player.empire), quantity: player.characters[Character.General]})}
                          css={generalsPilePosition} draggable={isPlayer(player)}/>
      {isPlayer(player) ?
        <PlayerHand player={player} players={game.players.length} round={game.round}/> :
        <OtherPlayerHand player={player} players={game.players.length} round={game.round} panelIndex={panelIndex}/>
      }
    </>
  )
}

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