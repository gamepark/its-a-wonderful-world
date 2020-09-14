import {css, keyframes} from '@emotion/core'
import {
  faChess, faChevronDown, faChevronUp, faClock, faCompress, faExpand, faFastBackward, faHome, faMoon, faSun, faUndoAlt, faUserSlash, faVolumeMute, faVolumeUp
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {GameSpeed, useActions, useGame, useNow, useOptions, usePlayerId, usePlayers, useRematch, useSound, useUndo} from '@interlude-games/workshop'
import {useTheme} from 'emotion-theming'
import fscreen from 'fscreen'
import NoSleep from 'nosleep.js'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import EjectPopup from './EjectPopup'
import EmpireName from './material/empires/EmpireName'
import Images from './material/Images'
import Move from './moves/Move'
import RematchPopup from './RematchPopup'
import ItsAWonderfulWorldRules, {isOver} from './Rules'
import toggleSound from './sounds/toggle.ogg'
import Theme, {LightTheme} from './Theme'
import TimePopup from './TimePopup'
import {resetTutorial} from './Tutorial'
import GameView from './types/GameView'
import IconButton from './util/IconButton'
import LoadingSpinner from './util/LoadingSpinner'
import {platformUri} from './util/Styles'

const noSleep = new NoSleep()

const MainMenu = () => {
  const game = useGame<GameView>()
  const actions = useActions<Move, EmpireName>()
  const nonGuaranteedUndoPending = actions?.some(action => action.cancelled && action.cancelPending && !action.animation && !action.delayed)
  const [undo, canUndo] = useUndo(ItsAWonderfulWorldRules)
  const playerId = usePlayerId<EmpireName>()
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const players = usePlayers<EmpireName>()
  const isPlaying = players.find(player => player.id === playerId)?.time?.playing
  const now = useNow()
  const options = useOptions()
  const playerTimeout = options?.speed === GameSpeed.RealTime && players.some(player => player.time?.playing && player.time.availableTime < now - Date.parse(player.time.lastChange))
  const [fullScreen, setFullScreen] = useState(!fscreen.fullscreenEnabled)
  const [ejectPopupOpen, setEjectPopupOpen] = useState(false)
  const [displayMenu, setDisplayMenu] = useState(false)
  const gameOverRef = useRef<boolean | undefined>()
  const [displayRematchTooltip, setDisplayRematchTooltip] = useState(false)
  const [timePopupOpen, setTimePopupOpen] = useState(false)
  const {rematch, rematchOffer, ignoreRematch} = useRematch<EmpireName>()
  const [toggle, {mute, unmute, muted}] = useSound(toggleSound)

  function toggleSounds() {
    if (muted) {
      unmute()
      toggle.play()
    } else {
      toggle.play()
      mute()
    }
  }

  useEffect(() => {
    if (game) {
      if (isOver(game)) {
        if (gameOverRef.current === false) {
          setDisplayRematchTooltip(true)
          gameOverRef.current = true
        }
      } else {
        gameOverRef.current = false
      }
    }
  }, [game, gameOverRef])

  const onFullScreenChange = () => {
    setFullScreen(fscreen.fullscreenElement != null)
    if (fscreen.fullscreenElement) {
      window.screen.orientation.lock('landscape')
        .then(() => noSleep.enable())
        .catch(() => console.info('screen orientation cannot be locked on this device'))
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
    <>
      <div css={[menuStyle, displayMenu && hidden]}>
        {playerTimeout && !!playerId && !isPlaying &&
        <IconButton css={[menuButtonStyle, ejectButtonStyle]} title={t('Expulser un joueur')} aria-label={t('Expulser un joueur')}
                    onClick={() => toggle.play() && setEjectPopupOpen(true)}>
          <FontAwesomeIcon icon={faUserSlash}/>
        </IconButton>
        }
        {game && !!playerId && (isOver(game) && !game.tutorial ?
            <IconButton css={[menuButtonStyle, rematchButtonStyle]} title={t('Proposer une revanche')} onClick={() => rematch()}>
              <FontAwesomeIcon icon={faChess}/>
              {displayRematchTooltip && <span css={tooltipStyle}>{t('Proposer une revanche')}</span>}
            </IconButton> :
            <IconButton css={[menuButtonStyle, undoButtonStyle]} title={t('Annuler mon dernier coup')} aria-label={t('Annuler mon dernier coup')}
                        onClick={() => toggle.play() && undo()} disabled={!canUndo()}>
              {!actions || nonGuaranteedUndoPending ? <LoadingSpinner css={loadingSpinnerStyle}/> : <FontAwesomeIcon icon={faUndoAlt}/>}
            </IconButton>
        )
        }
        {fscreen.fullscreenEnabled && (fullScreen ?
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]} title={t('Sortir du plein écran')} aria-label={t('Sortir du plein écran')}
                        onClick={() => toggle.play() && fscreen.exitFullscreen()}>
              <FontAwesomeIcon icon={faCompress}/>
            </IconButton>
            :
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]} title={t('Passer en plein écran')} aria-label={t('Passer en plein écran')}
                        onClick={() => toggle.play() && fscreen.requestFullscreen(document.getElementById('root')!)}>
              <FontAwesomeIcon icon={faExpand}/>
            </IconButton>
        )}
        <IconButton css={[menuButtonStyle, mainMenuButtonStyle]} title={t('Menu principal')} aria-label={t('Menu principal')}
                    onClick={() => toggle.play() && setDisplayMenu(true)}>
          <FontAwesomeIcon icon={faChevronDown}/>
        </IconButton>
      </div>
      <div css={[menuStyle, openMenuStyle, !displayMenu && hidden]}>
        <IconButton css={[menuButtonStyle, mainMenuButtonStyle]} onClick={() => toggle.play() && setDisplayMenu(false)}>
          <span css={subMenuTitle}>{t('Cacher le Menu')}</span>
          <FontAwesomeIcon icon={faChevronUp}/>
        </IconButton>
        {fscreen.fullscreenEnabled && (fullScreen ?
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]}
                        onClick={() => toggle.play() && fscreen.exitFullscreen()}>
              <span css={subMenuTitle}>{t('Quitter le plein écran')}</span>
              <FontAwesomeIcon icon={faCompress}/>
            </IconButton> :
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]}
                        onClick={() => toggle.play() && fscreen.requestFullscreen(document.getElementById('root')!)}>
              <span css={subMenuTitle}>{t('Passer en plein écran')}</span>
              <FontAwesomeIcon icon={faExpand}/>
            </IconButton>
        )}
        {game && !!playerId && isOver(game) && !game.tutorial &&
        <IconButton css={[menuButtonStyle, rematchButtonStyle]} title={t('Proposer une revanche')}>
          <span css={subMenuTitle}>{t('Proposer une revanche')}</span>
          <FontAwesomeIcon icon={faChess}/>
        </IconButton>
        }
        {game && !!playerId && !isOver(game) &&
        <IconButton css={[menuButtonStyle, undoButtonStyle]}
                    onClick={() => toggle.play() && undo()} disabled={!canUndo()}>
          <span css={subMenuTitle}>{t('Annuler mon dernier coup')}</span>
          {!actions || nonGuaranteedUndoPending ? <LoadingSpinner css={loadingSpinnerStyle}/> : <FontAwesomeIcon icon={faUndoAlt}/>}
        </IconButton>
        }
        <IconButton css={[menuButtonStyle, homeButtonStyle]} onClick={() => toggle.play().then(() => window.location.href = platformUri)}>
          <span css={subMenuTitle}>{t('Retour à l’accueil')}</span>
          <FontAwesomeIcon icon={faHome}/>
        </IconButton>
        <IconButton css={[menuButtonStyle, themeButtonStyle]} onClick={toggleSounds}>
          <span css={subMenuTitle}>{muted ? t('Activer le son') : t('Couper le son')}</span>
          <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp}/>
        </IconButton>
        <IconButton css={[menuButtonStyle, themeButtonStyle]} onClick={() => toggle.play() && theme.switchThemeColor()}>
          {theme.color === LightTheme ?
            <>
              <span css={subMenuTitle}>{t('Activer le mode nuit')}</span>
              <FontAwesomeIcon icon={faMoon}/>
            </>
            :
            <>
              <span css={subMenuTitle}>{t('Activer le mode jour')}</span>
              <FontAwesomeIcon icon={faSun}/>
            </>
          }
        </IconButton>
        {game && !game.tutorial &&
        <IconButton css={[menuButtonStyle, clockButtonStyle]} onClick={() => toggle.play() && setTimePopupOpen(true)}>
          <span css={subMenuTitle}>{t('Temps de réflexion')}</span>
          <FontAwesomeIcon icon={faClock}/>
        </IconButton>
        }
        {playerTimeout && !!playerId && !isPlaying &&
        <IconButton css={[menuButtonStyle, ejectButtonStyle]} onClick={() => toggle.play() && setEjectPopupOpen(true)}>
          <span css={subMenuTitle}>{t('Expulser un joueur')}</span>
          <FontAwesomeIcon icon={faUserSlash}/>
        </IconButton>
        }
        {game && game.tutorial &&
        <IconButton css={[menuButtonStyle, tutorialButtonStyle]} onClick={() => resetTutorial()}>
          <span css={subMenuTitle}>{t('Recommencer le Tutoriel')}</span>
          <FontAwesomeIcon icon={faFastBackward}/>
        </IconButton>
        }
      </div>
      <RematchPopup rematchOffer={rematchOffer} onClose={ignoreRematch}/>
      {timePopupOpen && <TimePopup onClose={() => setTimePopupOpen(false)}/>}
      {ejectPopupOpen && <EjectPopup playerId={playerId!} players={players} now={now} onClose={() => setEjectPopupOpen(false)}/>}
    </>
  )
}

const menuStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.5s ease-in-out;
  background-image: url(${Images.textureGrey});
  background-position: top right;
  padding: 0.1em;
  border-radius: 0 0 0 1em;
  border: solid 0.1em #ccc;
  border-top: solid 0 #ccc;
  box-shadow: 0 0 1em #000;
`

const openMenuStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #EEE;
  text-align: right;
  font-weight: lighter;
  text-shadow: 0 0 0.3em #000, 0 0 0.3em #000;
  text-transform: uppercase;
`

const hidden = css`
  opacity: 0;
  pointer-events: none;
`

const subMenuTitle = css`
  font-size: 0.9em;
  font-weight: lighter;
  text-shadow: 0 0 0.2em #000, 0 0 0.2em #000, 0 0 0.2em #000, 0 0 0.2em #000;
  text-transform: uppercase;
  margin-right: 1em;
`

const menuButtonStyle = css`
  width: fit-content;
  min-width: 2em;
  font-size: 4em;
  color: #EEE;
  margin: 0.1em;
  padding: 0.5em 0.55em;
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
  background-color: transparent;
  border-radius: 0;
  opacity: 0.8;
  white-space: nowrap;
  justify-content: right;
  &:hover, &:active, &:focus, &:visited, &:before {
    opacity: 1;
    background-color: transparent;
  }
  &:active {
    transform: translateY(1px);
  }
`
const homeButtonStyle = css`
  padding-right: 0.5em;
  background-image: url(${Images.buttonGreen});
`

const themeButtonStyle = css`
  padding-right: 0.5em;
  background-image: url(${Images.buttonBlue});
`

const clockButtonStyle = css`
  background-image: url(${Images.buttonGrey});
`

const mainMenuButtonStyle = css`
  background-image: url(${Images.buttonYellow});
`
const undoButtonStyle = css`
  padding-right: 0.5em;
  background-image: url(${Images.buttonRed});
  &:disabled {
    background-image: url(${Images.buttonGrey});
    pointer-events: none;
  }
  @media all and (orientation:portrait) {
    display: none;
  }
`
const fullScreenButtonStyle = css`
  background-image: url(${Images.buttonBlack});
`
const loadingSpinnerStyle = css`
  font-size: 0.25em;
  margin: 0.125em;
  transform: scale(1.25);
`
const rematchButtonStyle = css`
  background-image: url(${Images.buttonRed});
`
const ejectButtonStyle = css`
  background-image: url(${Images.buttonRed});
  padding-left: 0.35em;
  padding-right: 0.35em;
`

const tutorialButtonStyle = css`
  background-image: url(${Images.buttonRed});
  padding-left: 0.35em;
  padding-right: 0.5em;
`

const displayForAMoment = keyframes`
  from, to, 50% {opacity: 0}
  60%, 90% {opacity: 1}
`

const tooltipStyle = css`
  position: absolute;
  padding: 0.25em;
  bottom: -2em;
  border-radius: 0.25em;
  left: 50%;
  transform: translateX(-50%);
  margin: auto;
  background: black;
  animation: ${displayForAMoment} 20s forwards;
  pointer-events: none;
  &:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
    top: -0.5em;
    left: 50%;
    margin-left: -0.5em;
    border-bottom: 0.5em solid black;
  }
`

export default MainMenu