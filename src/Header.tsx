import {css} from '@emotion/core'
import {useAnimation, usePlay, usePlayerId, usePlayers} from '@interlude-games/workshop'
import Animation from '@interlude-games/workshop/dist/Types/Animation'
import PlayerInfo from '@interlude-games/workshop/dist/Types/Player'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import MainMenu from './MainMenu'
import Character from './material/characters/Character'
import CharacterToken from './material/characters/CharacterToken'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'
import {isCompleteConstruction} from './moves/CompleteConstruction'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import {isReceiveCharacter, receiveCharacter} from './moves/ReceiveCharacter'
import {tellYourAreReady} from './moves/TellYouAreReady'
import {countCharacters, getNextProductionStep, getScore, numberOfRounds} from './Rules'
import Theme, {LightTheme} from './Theme'
import GameView from './types/GameView'
import Phase from './types/Phase'
import Player from './types/Player'
import PlayerView from './types/PlayerView'
import Button from './util/Button'
import {headerHeight, textColor} from './util/Styles'


const headerStyle = (theme: Theme) => css`
  position: absolute;
  display: flex;
  width: 100%;
  height: ${headerHeight}em;
  padding: 0 30em 0 0;
  text-align: center;
  background-color: ${theme.color === LightTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 30, 0.5)'};
  transition: background-color 1s ease-in;
`

const bufferArea = css`
  width: 30em;
  flex-shrink: 1;
`

const textStyle = css`
  flex-grow: 1;
  flex-shrink: 0;
  transition: color 1s ease-in;
  padding: 0.25em;
  margin: 0;
  line-height: 1.25;
  font-size: 4em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

type Props = {
  game?: GameView
  loading: boolean
}

const Header: FunctionComponent<Props> = ({game, loading}) => {
  const empire = usePlayerId<EmpireName>()
  const play = usePlay<Move>()
  const players = usePlayers<EmpireName>()
  const animation = useAnimation<Move>(animation => [MoveType.RevealChosenCards, MoveType.PassCards].includes(animation.move.type))
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  return (
    <header css={headerStyle(theme)}>
      <div css={bufferArea}/>
      <h1 css={[textStyle, textColor(theme)]}>{loading ? t('Chargement de la partie...') : getText(t, play, players, game!, empire, animation)}</h1>
      <MainMenu/>
    </header>
  )
}

function getText(t: TFunction, play: (move: Move) => void, playersInfo: PlayerInfo<EmpireName>[], game: GameView, empire?: EmpireName, animation?: Animation<Move>) {
  const player = game.players.find(player => player.empire === empire)
  const getPlayerName = (empire: EmpireName) => playersInfo.find(p => p.id === empire)?.name || getEmpireName(t, empire)
  switch (game.phase) {
    case Phase.Draft:
      if (animation && animation.move.type === MoveType.RevealChosenCards) {
        return t('Les joueurs révèlent la carte qu’ils ont choisie')
      } else if (animation && animation.move.type === MoveType.PassCards) {
        if (game.round % 2 === 1) {
          return t('Les joueurs passent le reste du paquet à gauche')
        } else {
          return t('Les joueurs passent le reste du paquet à droite')
        }
      } else if (player && player.chosenCard === undefined) {
        return t('Choisissez une carte et placez-la dans votre zone de draft')
      } else {
        const players = game.players.filter(player => player.chosenCard === undefined)
        if (players.length === 0) {
          return t('Envoi du coup au Suprême Dirigeant...')
        } else if (players.length === 1) {
          return t('{player} doit choisir une carte développement', {player: getPlayerName(players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent choisir une carte développement')
        } else {
          return t('Les joueurs doivent choisir une carte développement')
        }
      }
    case Phase.Planning:
      if (player && player.draftArea.length) {
        return t('Vous devez mettre en construction ou recycler chacune des cartes draftées')
      } else if (player && player.availableResources.length) {
        return t('Placez vos ressources sur vos développements en construction ou votre carte Empire')
      } else if (player && !player.ready) {
        return <Trans values={{resource: Resource.Materials}}
                      defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                      components={[<Button onClick={() => play(tellYourAreReady(player.empire))}>Valider</Button>]}/>
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length === 0) {
          return t('Envoi du coup au Suprême Dirigeant...')
        } else if (players.length === 1) {
          return t('{player} doit faire sa planification', {player: getPlayerName(players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent faire leur planification')
        } else {
          return t('Les joueurs doivent faire leur planification')
        }
      }
    case Phase.Production:
      if (animation && isReceiveCharacter(animation.move) && !animation.action.consequences.some(isCompleteConstruction)) {
        if (animation.move.playerId === player?.empire) {
          return t('Vous recevez un {character, select, Financier{Financier} other{Général}} pour votre suprématie en production {resource, select, Materials{de Matériaux} Energy{d’Énergie} Science{de Science} Gold{d’Or} other{d’Exploration}}',
            {character: animation.move.character, resource: game.productionStep})
        } else {
          return t('{player} recoit un {character, select, Financier{Financier} other{Général}} pour sa suprématie en production {resource, select, Materials{de Matériaux} Energy{d’Énergie} Science{de Science} Gold{d’Or} other{d’Exploration}}',
            {player: getPlayerName(animation.move.playerId), character: animation.move.character, resource: game.productionStep})
        }
      }
      if (player && !player.ready) {
        if (player.availableResources.length) {
          return t('Placez les ressources produites sur vos développements en construction ou votre carte Empire')
        } else if (player.bonuses.some(bonus => bonus === 'CHOOSE_CHARACTER')) {
          return <Trans defaults="Recevez un Financier [<0/>] ou une Générale [<1/>] (Bonus de Suprématie en Science)"
                        components={[
                          <CharacterToken character={Character.Financier} onClick={() => play(receiveCharacter(player.empire, Character.Financier))}
                                          css={characterTokenStyle}/>,
                          <CharacterToken character={Character.General} onClick={() => play(receiveCharacter(player.empire, Character.General))}
                                          css={characterTokenStyle}/>
                        ]}/>
        } else if (game.productionStep !== Resource.Exploration) {
          return <Trans values={{resource: getNextProductionStep(game)}}
                        defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                        components={[<Button onClick={() => play(tellYourAreReady(player.empire))}>Valider</Button>]}/>
        } else if (game.round < numberOfRounds) {
          return <Trans defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer au tour suivant"
                        components={[<Button onClick={() => play(tellYourAreReady(player.empire))}>Valider</Button>]}/>
        } else {
          return <Trans defaults="Cliquez sur <0>Valider</0> pour passer au calcul des scores"
                        components={[<Button onClick={() => play(tellYourAreReady(player.empire))}>Valider</Button>]}/>
        }
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length) {
          if (players.length === 0) {
            return t('Envoi du coup au Suprême Dirigeant...')
          } else if (players.length === 1) {
            return t('{player} doit utiliser les ressources produites', {player: getPlayerName(players[0].empire)})
          } else if (player) {
            return t('Les autres joueurs doivent utiliser les ressources produites')
          } else {
            return t('Les joueurs doivent utiliser les ressources produites')
          }
        } else if (game.productionStep === Resource.Exploration && game.round === numberOfRounds) {
          return getEndOfGameText(t, playersInfo, game, player)
        }
      }
  }
  return ''
}

function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<EmpireName>[], game: GameView, player?: Player | PlayerView) {
  const getPlayerName = (empire: EmpireName) => playersInfo.find(p => p.id === empire)?.name || getEmpireName(t, empire)
  let highestScore = -1
  let playersWithHighestScore = []
  for (const player of game.players) {
    const score = getScore(player)
    if (score >= highestScore) {
      if (score > highestScore) {
        playersWithHighestScore = []
        highestScore = score
      }
      playersWithHighestScore.push(player)
    }
  }
  if (playersWithHighestScore.length === 1) {
    if (player === playersWithHighestScore[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points', {score: highestScore})
    } else {
      return t('{player} gagne la partie avec {score} points', {player: getPlayerName(playersWithHighestScore[0].empire), score: highestScore})
    }
  }
  let highestDevelopments = -1
  let playersWithMostDevelopments = []
  for (const player of playersWithHighestScore) {
    if (player.constructedDevelopments.length >= highestDevelopments) {
      if (player.constructedDevelopments.length > highestDevelopments) {
        playersWithMostDevelopments = []
        highestDevelopments = player.constructedDevelopments.length
      }
      playersWithMostDevelopments.push(player)
    }
  }
  if (playersWithMostDevelopments.length === 1) {
    if (player === playersWithMostDevelopments[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points et {developments} développements construits',
        {score: highestScore, developments: highestDevelopments})
    } else {
      return t('{player} gagne la partie avec {score} points et {developments} développements construits',
        {player: getPlayerName(playersWithMostDevelopments[0].empire), score: highestScore, developments: highestDevelopments})
    }
  }
  let highestCharacters = -1
  let playersWithMostCharacters = []
  for (const player of playersWithMostDevelopments) {
    const characters = countCharacters(player)
    if (characters >= highestCharacters) {
      if (characters > highestCharacters) {
        playersWithMostCharacters = []
        highestCharacters = characters
      }
      playersWithMostCharacters.push(player)
    }
  }
  if (playersWithMostCharacters.length === 1) {
    if (player === playersWithMostCharacters[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points, {developments} développements et {characters} personnages',
        {score: highestScore, developments: highestDevelopments, characters: highestCharacters})
    } else {
      return t('{player} gagne la partie avec {score} points, {developments} développements et {characters} personnages',
        {player: getPlayerName(playersWithMostCharacters[0].empire), score: highestScore, developments: highestDevelopments, characters: highestCharacters})
    }
  }
  if (playersWithMostCharacters.length === game.players.length) {
    return t('Égalité parfaite ! Tous les joueurs ont {score} points, {developments} développements et {characters} personnages',
      {score: highestScore, developments: highestDevelopments, characters: highestCharacters})
  } else if (playersWithMostCharacters.length === 2) {
    return t('Égalité parfaite ! {player1} et {player2} ont {score} points, {developments} développements et {characters} personnages',
      {
        player1: getPlayerName(playersWithMostCharacters[0].empire), player2: getPlayerName(playersWithMostCharacters[1].empire),
        score: highestScore, developments: highestDevelopments, characters: highestCharacters
      })
  } else if (playersWithMostCharacters.length === 3) {
    return t('Égalité parfaite ! {player1}, {player2} et {player3} ont {score} points, {developments} développements et {characters} personnages',
      {
        player1: getPlayerName(playersWithMostCharacters[0].empire), player2: getPlayerName(playersWithMostCharacters[1].empire),
        player3: getPlayerName(playersWithMostCharacters[2].empire), score: highestScore, developments: highestDevelopments, characters: highestCharacters
      })
  } else {
    return t('Égalité parfaite ! {player1}, {player2}, {player3} et {player4} ont {score} points, {developments} développements et {characters} personnages',
      {
        player1: getPlayerName(playersWithMostCharacters[0].empire), player2: getPlayerName(playersWithMostCharacters[1].empire),
        player3: getPlayerName(playersWithMostCharacters[2].empire), player4: getPlayerName(playersWithMostCharacters[3].empire),
        score: highestScore, developments: highestDevelopments, characters: highestCharacters
      })
  }
}

const characterTokenStyle = css`
  width: 1.25em;
  height: 1.25em;
  vertical-align: bottom;
  cursor: pointer;
  &:hover, &:active {
    transform: scale(1.1);
  }
`

export default Header