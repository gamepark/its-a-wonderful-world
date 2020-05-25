import {css} from '@emotion/core'
import {useGame, usePlay, usePlayerId, useUndo} from '@interlude-games/workshop'
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
import {receiveCharacter} from './moves/ReceiveCharacter'
import {tellYourAreReady} from './moves/TellYouAreReady'
import ItsAWonderfulWorldRules, {getNextProductionStep, getScore, numberOfRounds} from './Rules'
import GameView from './types/GameView'
import Phase from './types/Phase'
import FullScreenExitIcon from './util/FullScreenExitIcon'
import FullScreenIcon from './util/FullScreenIcon'
import IconButton from './util/IconButton'
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
      <IconButton css={undoButtonStyle} title={t('Annuler mon dernier coup')} aria-label={t('Annuler mon dernier coup')} onClick={undo}
                  disabled={!canUndo}><UndoIcon/></IconButton>
      <h1 css={textStyle}>{getText(t, play, game, empire)}</h1>
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

function getText(t: TFunction, play: (move: Move) => void, game?: GameView, empire?: EmpireName) {
  if (!game) {
    return t('Chargement de la partie...')
  }
  const player = game.players.find(player => player.empire === empire)
  switch (game.phase) {
    case Phase.Draft:
      if (player && player.chosenCard === undefined) {
        return t('Choisissez une carte et placez-la dans votre zone de draft')
      } else {
        const players = game.players.filter(player => player.chosenCard === undefined)
        if (players.length === 1) {
          return t('{player} doit choisir une carte développement', {player: getEmpireName(t, players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent choisir une carte développement')
        } else {
          return t('Les joueurs doivent choisir une carte développement')
        }
      }
    case Phase.Planning:
      if (!player) {
        return t('Les joueurs doivent faire leur planification')
      }
      if (player.draftArea.length) {
        return t('Vous devez mettre en construction ou recycler chacune des cartes draftées')
      } else if (player.availableResources.length) {
        return t('Placez vos ressources sur vos développements en construction ou votre carte Empire')
      } else if (!player.ready) {
        return <Trans values={{resource: Resource.Materials}}
                      defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                      components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}>
          Cliquez sur <button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button> pour continuer
        </Trans>
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length === 1) {
          return t('{player} doit faire sa planification', {player: getEmpireName(t, players[0].empire)})
        } else {
          return t('Les autres joueurs doivent faire leur planification')
        }
      }
    case Phase.Production:
      if (player && !player.ready) {
        if (player.availableResources.length) {
          return t('Placez les ressources produites sur vos développements en construction ou votre carte Empire')
        } else if (player.bonuses.some(bonus => bonus === 'CHOOSE_CHARACTER')) {
          return <Trans>Vous pouvez récupérer un <button onClick={() => play(receiveCharacter(player.empire, Character.Financier))}
                                                         css={buttonStyle}>Financier</button> ou un <button
            onClick={() => play(receiveCharacter(player.empire, Character.General))} css={buttonStyle}>Général</button></Trans>
        } else if (game.productionStep !== Resource.Exploration) {
          return <Trans values={{resource: getNextProductionStep(game)}}
                        defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                        components={[<button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button>]}>
            Cliquez sur <button onClick={() => play(tellYourAreReady(player.empire))} css={buttonStyle}>Valider</button> pour continuer
          </Trans>
        } else if (game.round < numberOfRounds) {
          return <Trans>Cliquez sur <button onClick={() => play(tellYourAreReady(player.empire))}
                                            css={buttonStyle}>Valider</button> si vous êtes prêt à passer au tour suivant</Trans>
        } else {
          return <Trans>Cliquez sur <button onClick={() => play(tellYourAreReady(player.empire))}
                                            css={buttonStyle}>Valider</button> pour passer au calcul des scores</Trans>
        }
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length) {
          if (players.length === 1) {
            return t('{player} doit utiliser les ressources produites', {player: getEmpireName(t, players[0].empire)})
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
              return t('{player} gagne la partie avec {score} points', {player: getEmpireName(t, winners[0].empire), score: highestScore})
            }
          }
          return t('Égalité ! Les joueurs ont chacun {score} points', {score: highestScore})
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