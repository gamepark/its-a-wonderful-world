import {css, keyframes} from '@emotion/core'
import {faChess, faChevronDown, faChevronUp, faCompress, faExpand, faHome, faMoon, faSun, faUndoAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions, useGame, usePlayerId, useRematch, useUndo} from '@interlude-games/workshop'
import fscreen from 'fscreen'
import NoSleep from 'nosleep.js'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import EmpireName from './material/empires/EmpireName'
import Move from './moves/Move'
import RematchPopup from './RematchPopup'
import ItsAWonderfulWorldRules, {isOver} from './Rules'
import GameView from './types/GameView'
import IconButton from './util/IconButton'
import LoadingSpinner from './util/LoadingSpinner'
import BlackMenuBackground from './util/menu-black.png'
import GreyMenuBackground from './util/menu-grey.png'
import GoldMenuBackground from './util/menu-gold.png'
import RedMenuBackground from './util/menu-red.png'
import BlueMenuBackground from './util/menu-blue.png'
import GreenMenuBackground from './util/menu-green.png'
import MenuBackgroundImage from './util/texture-grey.jpg'
import {useTheme} from 'emotion-theming'
import Theme, {LightTheme} from './Theme'

const noSleep = new NoSleep()

const MainMenu = () => {
  const game = useGame<GameView>()
  const actions = useActions<Move, EmpireName>()
  const nonGuaranteedUndoPending = actions?.some(action => action.cancelled && action.cancelPending && !action.animation && !action.delayed)
  const [undo, canUndo] = useUndo(ItsAWonderfulWorldRules)
  const isPlaying = !!usePlayerId<EmpireName>()
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const [fullScreen, setFullScreen] = useState(!fscreen.fullscreenEnabled)
  const [displayMenu, setDisplayMenu] = useState(false)
  const gameOverRef = useRef<boolean | undefined>()
  const [displayRematchTooltip, setDisplayRematchTooltip] = useState(false)
  const {rematch, rematchOffer, ignoreRematch} = useRematch<EmpireName>()
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
  const platformUri = process.env.REACT_APP_PLATFORM_URI || 'http://localhost:3000'
  return (
    <>
      <div css={[menuStyle, displayMenu && hidden]}>
        {game && isPlaying && (isOver(game) ?
            <IconButton css={[menuButtonStyle, rematchButtonStyle]} title={t('Proposer une revanche')} onClick={() => rematch()}>
              <FontAwesomeIcon icon={faChess}/>
              {displayRematchTooltip && <span css={tooltipStyle}>{t('Proposer une revanche')}</span>}
            </IconButton> :
            <IconButton css={[menuButtonStyle, undoButtonStyle]} title={t('Annuler mon dernier coup')} aria-label={t('Annuler mon dernier coup')}
                        onClick={() => undo()} disabled={!canUndo()}>
              {!actions || nonGuaranteedUndoPending ? <LoadingSpinner css={loadingSpinnerStyle}/> : <FontAwesomeIcon icon={faUndoAlt}/>}
            </IconButton>
        )
        }
        {fscreen.fullscreenEnabled && (fullScreen ?
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]} title={t('Sortir du plein écran')} aria-label={t('Sortir du plein écran')}
                        onClick={() => fscreen.exitFullscreen()}>
              <FontAwesomeIcon icon={faCompress}/>
            </IconButton>
            :
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]} title={t('Passer en plein écran')} aria-label={t('Passer en plein écran')}
                        onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>
              <FontAwesomeIcon icon={faExpand}/>
            </IconButton>
        )}
        <IconButton css={[menuButtonStyle, mainMenuButtonStyle]} title={t('Menu principal')} aria-label={t('Menu principal')}
                    onClick={() => setDisplayMenu(true)}>
          <FontAwesomeIcon icon={faChevronDown}/>
        </IconButton>
      </div>
      <div css={[menuStyle, openMenuStyle, !displayMenu && hidden]}>
        <IconButton css={[menuButtonStyle, mainMenuButtonStyle]} onClick={() => setDisplayMenu(false)}>
          <span css={subMenuTitle}>{t('Cacher le Menu')}</span>
          <FontAwesomeIcon icon={faChevronUp}/>
        </IconButton>
        {fscreen.fullscreenEnabled && (fullScreen ?
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]}
                        onClick={() => fscreen.exitFullscreen()}>
              <span css={subMenuTitle}>{t('Quitter le plein écran')}</span>
              <FontAwesomeIcon icon={faCompress}/>
            </IconButton> :
            <IconButton css={[menuButtonStyle, fullScreenButtonStyle]}
                        onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>
              <span css={subMenuTitle}>{t('Passer en plein écran')}</span>
              <FontAwesomeIcon icon={faExpand}/>
            </IconButton>
        )}
        {game && isPlaying && (isOver(game) ?
            <IconButton css={[menuButtonStyle, rematchButtonStyle]} title={t('Proposer une revanche')}>
              <span css={subMenuTitle}>{t('Proposer une revanche')}</span>
              <FontAwesomeIcon icon={faChess}/>
            </IconButton>
            :
            <IconButton css={[menuButtonStyle, undoButtonStyle]}
                        onClick={() => undo()} disabled={!canUndo()}>
              <span css={subMenuTitle}>{t('Annuler mon dernier coup')}</span>
              {!actions || nonGuaranteedUndoPending ? <LoadingSpinner css={loadingSpinnerStyle}/> : <FontAwesomeIcon icon={faUndoAlt}/>}
            </IconButton>
        )
        }
        <IconButton css={[menuButtonStyle, homeButtonStyle]} onClick={() => window.location.href = platformUri}>
          <span css={subMenuTitle}>{t('Retour à l’accueil')}</span>
          <FontAwesomeIcon icon={faHome}/>
        </IconButton>
        <IconButton css={[menuButtonStyle, themeButtonStyle]} onClick={theme.switchThemeColor}>
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

      </div>
      <RematchPopup rematchOffer={rematchOffer} onClose={ignoreRematch}/>
    </>
  )
}

const menuStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.5s ease-in-out;
  background-image: url(${MenuBackgroundImage});
  background-position: top right;
  padding: 0.1em;
  border-radius: 0 0 0 1em;
  border: solid 0.1em #ccc;
  border-top: solid 0 #ccc;
  box-shadow: 0 0 6px #000;
`

const openMenuStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #EEE;
  text-align: right;
  font-size: 2.5vh;
  font-weight: lighter;
  text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
  text-transform: uppercase;
  & a {
    color:#EEE;
    font-size: 2.5vh;
    font-weight: lighter;
    text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
    text-transform:uppercase;
    text-decoration:none;
  }
  & a:hover{
    text-decoration:underline;
  }
`

const hidden = css`
  opacity: 0;
  pointer-events: none;
`

const subMenuTitle = css`
  font-size: 2.5vh;
  font-weight: lighter;
  text-shadow: 0 0 0.5vh #000, 0 0 0.5vh #000, 0 0 0.5vh #000, 0 0 0.5vh #000;
  text-transform: uppercase;
    margin-right: 3vh;
`

const menuButtonStyle = css`
  width: fit-content;
  min-width: 8vh;
  font-size: 4vh;
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
  padding-right: 0.4em;
  background-image: url(${GreenMenuBackground});
`

const themeButtonStyle = css`
  padding-right: 0.5em;
  background-image: url(${BlueMenuBackground});
`
const mainMenuButtonStyle = css`
  background-image: url(${GoldMenuBackground});
`
const undoButtonStyle = css`
  background-image: url(${RedMenuBackground});
  &:disabled {
    background-image: url(${GreyMenuBackground});
    pointer-events: none;
  }
  @media all and (orientation:portrait) {
    display: none;
  }
`
const fullScreenButtonStyle = css`
  background-image: url(${BlackMenuBackground});
`
const loadingSpinnerStyle = css`
  margin: 0.5vh;
  transform: scale(1.3);
`
const rematchButtonStyle = css`
  background-image: url(${RedMenuBackground});
`

const displayForAMoment = keyframes`
  from, to, 50% {opacity: 0}
  60%, 90% {opacity: 1}
`

const tooltipStyle = css`
  position: absolute;
  padding: 0.5vh;
  bottom: -7vh;
  border-radius: 1vh;
  left: 50%;
  transform: translateX(-50%);
  margin: auto;
  background: black;
  animation: ${displayForAMoment} 20s forwards;
  &:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    border-left: 1vh solid transparent;
    border-right: 1vh solid transparent;
    top: -1vh;
    left: 50%;
    margin-left: -1vh;
    border-bottom: 1vh solid black;
  }
`

export default MainMenu