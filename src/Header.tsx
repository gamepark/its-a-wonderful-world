import {css} from '@emotion/core'
import {useActions, useAnimation, useGame, usePlay, usePlayerId, usePlayers, useUndo} from '@interlude-games/workshop'
import Animation from '@interlude-games/workshop/dist/Types/Animation'
import Player from '@interlude-games/workshop/dist/Types/Player'
import fscreen from 'fscreen'
import {TFunction} from 'i18next'
import NoSleep from 'nosleep.js'
import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import Character from './material/characters/Character'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import Resource from './material/resources/Resource'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {tellYourAreReady} from './moves/TellYouAreReady'
import ItsAWonderfulWorldRules, {getNextProductionStep, getScore, numberOfRounds} from './Rules'
import GameView from './types/GameView'
import Phase from './types/Phase'
import FullScreenExitIcon from './util/FullScreenExitIcon'
import FullScreenIcon from './util/FullScreenIcon'
import IconButton from './util/IconButton'
import LoadingSpinner from './util/LoadingSpinner'
import {headerHeight} from './util/Styles'
import UndoIcon from './util/UndoIcon'

const headerStyle = css`
  position: absolute;
  width: 100%;
  height: ${headerHeight}%;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
`

const textStyle = css`
  @media all and (orientation:portrait) {
    display: none;
  }
  color: #333333;
  padding: 1vh;
  margin: 0 6vh;
  line-height: 1.25;
  font-size: 4vh;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const loadingSpinnerStyle = css`
  position: absolute;
  left: 1vh;
  top: 1vh;
  transform-origin: top left;
  transform: scale(0.6);
`

const undoButtonStyle = css`
  @media all and (orientation:portrait) {
    display: none;
  }
  position: absolute;
  top: 0;
  left: 0;
  font-size: 4vh;
  padding: 0.33em;
`

const fullScreenButtonStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 4vh;
  padding: 0.33em;
`

const noSleep = new NoSleep()

const Header = () => {
  const game = useGame<GameView>()
  const empire = usePlayerId<EmpireName>()
  const play = usePlay<Move>()
  const players = usePlayers<EmpireName>()
  const actions = useActions<Move, EmpireName>()
  const nonGuaranteedUndo = actions?.some(action => action.cancelled && action.cancelPending && !action.animation && !action.delayed)
  const animation = useAnimation<Move>(animation => [MoveType.RevealChosenCards, MoveType.PassCards].includes(animation.move.type))
  const [undo, canUndo] = useUndo(ItsAWonderfulWorldRules)
  const {t} = useTranslation()
  const [fullScreen, setFullScreen] = useState(!fscreen.fullscreenEnabled)
  const onFullScreenChange = () => {
    setFullScreen(fscreen.fullscreenElement != null)
    if (fscreen.fullscreenElement) {
      window.screen.orientation.lock('landscape')
      noSleep.enable()
    } else {
      noSleep.disable()
    }
  }
  useEffect(() => {
    fscreen.addEventListener('fullscreenchange', onFullScreenChange)
    return () => {
      fscreen.removeEventListener('fullscreenchange', onFullScreenChange)
    }
  }, [])
  return (
    <header css={headerStyle}>
      {actions === undefined || nonGuaranteedUndo ?
        <LoadingSpinner css={loadingSpinnerStyle}/> :
        <IconButton css={undoButtonStyle} title={t('Annuler mon dernier coup')} aria-label={t('Annuler mon dernier coup')} onClick={() => undo()}
                    disabled={!canUndo()}><UndoIcon/></IconButton>}
      <h1 css={textStyle}>{getText(t, play, players, game, empire, animation)}</h1>
      <p css={portraitText}>{t('Passer en plein écran') + ' →'}</p>
      {fscreen.fullscreenEnabled && !fullScreen &&
      <IconButton css={fullScreenButtonStyle} title={t('Passer en plein écran')} aria-label={t('Passer en plein écran')}
                  onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>
        <FullScreenIcon/>
      </IconButton>}
      {fullScreen &&
      <IconButton css={fullScreenButtonStyle} title={t('Passer en plein écran')} aria-label={t('Passer en plein écran')}
                  onClick={() => fscreen.exitFullscreen()}>
        <FullScreenExitIcon/>
      </IconButton>}
    </header>
  )
}

function getText(t: TFunction, play: (move: Move) => void, playersInfo: Player<EmpireName>[], game?: GameView, empire?: EmpireName, animation?: Animation<Move>) {
  if (!game) {
    return t('Chargement de la partie...')
  }
  const player = game.players.find(player => player.empire === empire)
  const getPlayerName = (empire: EmpireName) => playersInfo.find(p => p.id === empire)?.name ?? getEmpireName(t, empire)
  switch (game.phase) {
    case Phase.Draft:
      if (animation && animation.move.type === MoveType.RevealChosenCards) {
        return t('Les joueurs révèlent la carte qu’ils ont choisi')
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
        if (players.length === 1) {
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
                      components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}/>
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length === 1) {
          return t('{player} doit faire sa planification', {player: getPlayerName(players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent faire leur planification')
        } else {
          return t('Les joueurs doivent faire leur planification')
        }
      }
    case Phase.Production:
      if (player && !player.ready) {
        if (player.availableResources.length) {
          return t('Placez les ressources produites sur vos développements en construction ou votre carte Empire')
        } else if (player.bonuses.some(bonus => bonus === 'CHOOSE_CHARACTER')) {
          return <Trans defaults="Vous pouvez récupérer un <0>Financier</0> ou un <1>Général</1>"
                        components={[<button onClick={() => play(receiveCharacter(player.empire, Character.Financier))} css={buttonStyle}>Financier</button>,
                          <button onClick={() => play(receiveCharacter(player.empire, Character.General))} css={buttonStyle}>Général</button>]}/>
        } else if (game.productionStep !== Resource.Exploration) {
          return <Trans values={{resource: getNextProductionStep(game)}}
                        defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                        components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}/>
        } else if (game.round < numberOfRounds) {
          return <Trans defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer au tour suivant"
                        components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}/>
        } else {
          return <Trans defaults="Cliquez sur <0>Valider</0> pour passer au calcul des scores"
                        components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}/>
        }
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length) {
          if (players.length === 1) {
            return t('{player} doit utiliser les ressources produites', {player: getPlayerName(players[0].empire)})
          } else if (player) {
            return t('Les autres joueurs doivent utiliser les ressources produites')
          } else {
            return t('Les joueurs doivent utiliser les ressources produites')
          }
        } else if (game.productionStep === Resource.Exploration && game.round === numberOfRounds) {
          let highestScore = -1
          let winners = []
          for (const player of game.players) {
            const score = getScore(player)
            if (score >= highestScore) {
              if (score > highestScore) {
                winners = []
                highestScore = score
              }
              winners.push(player)
            }
          }
          if (winners.length === 1) {
            if (player === winners[0]) {
              return t('Victoire ! Vous gagnez la partie avec {score} points', {score: highestScore})
            } else {
              return t('{player} gagne la partie avec {score} points', {player: getPlayerName(winners[0].empire), score: highestScore})
            }
          } else {
            let highestDevelopments = -1
            let winnersTieBreaker = []
            for (const player of winners) {
              if (player.constructedDevelopments.length >= highestDevelopments) {
                if (player.constructedDevelopments.length > highestDevelopments) {
                  winnersTieBreaker = []
                  highestDevelopments = player.constructedDevelopments.length
                }
                winnersTieBreaker.push(player)
              }
            }
            if (winnersTieBreaker.length === 1) {
              if (player === winnersTieBreaker[0]) {
                return t('Victoire ! Vous gagnez la partie avec {score} points et {developments} développements construits',
                  {score: highestScore, developments: highestDevelopments})
              } else {
                return t('{player} gagne la partie avec {score} points et {developments} développements construits',
                  {player: getPlayerName(winnersTieBreaker[0].empire), score: highestScore, developments: highestDevelopments})
              }
            } else if (winnersTieBreaker.length === game.players.length) {
              return t('Égalité parfaite ! Tous les joueurs ont chacun {score} points et {developments} développements construits',
                {score: highestScore, developments: highestDevelopments})
            } else if (winnersTieBreaker.length === 2) {
              return t('Égalité parfaite ! {player1} et {player2} ont chacun {score} points et {developments} développements construits',
                {
                  player1: getPlayerName(winnersTieBreaker[0].empire), player2: getPlayerName(winnersTieBreaker[1].empire), score: highestScore,
                  developments: highestDevelopments
                })
            } else if (winnersTieBreaker.length === 3) {
              return t('Égalité parfaite ! {player1}, {player2} et {player3} ont chacun {score} points et {developments} développements construits',
                {
                  player1: getPlayerName(winnersTieBreaker[0].empire), player2: getPlayerName(winnersTieBreaker[1].empire),
                  player3: getPlayerName(winnersTieBreaker[2].empire), score: highestScore, developments: highestDevelopments
                })
            } else if (winnersTieBreaker.length === 4) {
              return t('Égalité parfaite ! {player1}, {player2}, {player3} et {player4} ont chacun {score} points et {developments} développements construits',
                {
                  player1: getPlayerName(winnersTieBreaker[0].empire), player2: getPlayerName(winnersTieBreaker[1].empire),
                  player3: getPlayerName(winnersTieBreaker[2].empire), player4: getPlayerName(winnersTieBreaker[3].empire), score: highestScore,
                  developments: highestDevelopments
                })
            }
          }
        }
      }
      return ''
  }
}

const buttonStyle = css`
  display: inline-block;
  position: relative;
  cursor: pointer;
  border: 2px solid darkcyan;
  color: darkcyan;
  font-size: 3.4vh;
  font-weight: bold;
  padding: 0 1vh;
  margin: 0 1vh;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px darkslategrey;
  transition: translate 0.2s ease-in-out;
  background: none;
  &:focus {
    outline:0;
  }
  &:active {
    transform: translateY(1px);
  }
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 2vh cadetblue;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover:after, &:focus:after {
    opacity: 1;
  }
`

const portraitText = css`
  @media all and (orientation:landscape) {
    display: none;
  }
  color: #333333;
  line-height: 1.25;
  font-size: 3vh;
  margin: 0 6vh 0 0;
  padding: 1.5vh 1vh 1.5vh 1vh;
`

export default Header