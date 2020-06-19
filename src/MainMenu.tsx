import {css} from '@emotion/core'
import {useActions, useUndo} from '@interlude-games/workshop'
import fscreen from 'fscreen'
import NoSleep from 'nosleep.js'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import EmpireName from './material/empires/EmpireName'
import Move from './moves/Move'
import ItsAWonderfulWorldRules from './Rules'
import FullScreenExitIcon from './util/FullScreenExitIcon'
import FullScreenIcon from './util/FullScreenIcon'
import IconButton from './util/IconButton'
import LoadingSpinner from './util/LoadingSpinner'
import UndoIcon from './util/UndoIcon'
import MenuBackgroundImage from './util/texture-grey.jpg'
import FullScreenBackgroundImage from './util/menu-black.png'
import UndoBackgroundImage from './util/menu-red.png'
import mainMenuBackgroundImage from './util/menu-grey.png'
import homeBackgroundImage from './util/menu-gold.png'
import MainMenuIcon from './util/mainMenuIcon'
import HomeIcon from './util/homeIcon'


const iconeHeight = 10
const iconeNumber = 4
const iconeShift = 3
const fullMenuHeight = (iconeHeight * iconeNumber) - iconeShift
const noSleep = new NoSleep()

const MainMenu = () => {

  const actions = useActions<Move, EmpireName>()
  const nonGuaranteedUndo = actions?.some(action => action.cancelled && action.cancelPending && !action.animation && !action.delayed)
  const [undo, canUndo] = useUndo(ItsAWonderfulWorldRules)
  const {t} = useTranslation()
  const [fullScreen, setFullScreen] = useState(!fscreen.fullscreenEnabled)
  const [displayMenu, setDisplayMenu] = useState(false)

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
  // @ts-ignore
  return (


      <div css={[mainMenu,displayMenu && displayMainMenuStyle]}>
        <div css={[topMenu,displayMenu && reverseTopMenuStyle]}>
          {actions === undefined || nonGuaranteedUndo ?
            <LoadingSpinner css={loadingSpinnerStyle}/> :
            <IconButton css={[menuButtonStyle,undoButtonStyle]} title={t('Annuler mon dernier coup')} aria-label={t('Annuler mon dernier coup')} onClick={() => undo()}
                        disabled={!canUndo()}>
              {displayMenu && <span css={subMenuTitle}>{t('Annuler mon dernier coup')}</span>}
              <UndoIcon/>
            </IconButton>
          }
          {fscreen.fullscreenEnabled && !fullScreen &&
          <IconButton css={[menuButtonStyle,fullScreenButtonStyle]} title={t('Passer en plein écran')} aria-label={t('Passer en plein écran')}
                      onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>
            {displayMenu && <span css={subMenuTitle}>{t('Passer en plein écran')}</span>}
            <FullScreenIcon/>
          </IconButton>
          }
          {fullScreen &&
            <IconButton css={[menuButtonStyle,fullScreenButtonStyle]} title={t('Sortir du plein écran')} aria-label={t('Sortir du plein écran')}
                        onClick={() => fscreen.exitFullscreen()}>
              {displayMenu && <span css={subMenuTitle}>{t('Sortir du plein écran')}</span>}
              <FullScreenExitIcon/>
          </IconButton>
            }
            <IconButton css={[menuButtonStyle,mainMenuButtonStyle]} title={t('Menu principal')} aria-label={t('Menu principal')}
                        onClick={() => displayMenu?setDisplayMenu(false):setDisplayMenu(true)}>
              {displayMenu && <span css={subMenuTitle}>{t('Cacher le Menu')}</span>}
              <MainMenuIcon up={!displayMenu}/>
            </IconButton>
        </div>

        <SubMenu display={displayMenu}/>

      </div>
  )
}

type Props = React.HTMLAttributes<HTMLButtonElement> & { display: boolean }

const SubMenu: FunctionComponent<Props> = ({display}) => {
  const {t} = useTranslation()
  const platformUri = process.env.REACT_APP_PLATFORM_URI || 'https://interlude.games'
    return(
      <div css={[subMenuContent,display && displaySubMenuStyle ]}>
        <IconButton css={[menuButtonStyle,homeButtonStyle]} title={t('Retour à l’accueil')} aria-label={t('Retour à l’accueil')}
                    onClick={() => window.location.href = platformUri}>
          <span css={subMenuTitle}>{t('Retour à l’accueil')}</span>
          <HomeIcon/>
        </IconButton>
      </div>
    )
}

const loadingSpinnerStyle = css`
  position: absolute;
  left: 1vh;
  top: 1vh;
  transform-origin: top left;
  transform: scale(0.6);
  padding:1em;
  @media all and (orientation:portrait) {
    display: none;
  }
`


const mainMenu = css`
  transition: height 0.1s ease-in;
  height:${iconeHeight}vh;
  position: absolute;
  top: 0;
  right: 0;
  text-align:right;
  background-image: url(${MenuBackgroundImage});
  background-position:bottom left;
  background-repeat:no-repeat;
  padding:0.1em;
  border-radius:0 0 0 1em;
  border:solid 0.1em #ccc;
  border-top:solid 0 #ccc;
  box-shadow: 0 0 6px #000;
  color:#EEE;
  font-size: 2.5vh;
  font-weight: lighter;
  text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
  text-transform:uppercase;
  & a{
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
const displayMainMenuStyle = css`
  padding-left:0.7em;
  height:${fullMenuHeight}vh;
  transition: height 0.1s ease-out;
`

const topMenu = css`
  display: flex;
  justify-content:flex-end;
  flex-direction: row;
`
const reverseTopMenuStyle = css`
  flex-direction: column-reverse;
`
const subMenuContent = css`
  height:0;
  width:0;
  opacity:0;
  transition: opacity 0.3s ease-in;
`
const displaySubMenuStyle = css`
  height:auto;
  width:auto;
  opacity:1;
`
const subMenuTitle = css`
  color:#EEE;
  font-size: 2.5vh;
  font-weight: lighter;
  text-shadow: 0 0 0.3vh #000, 0 0 0.3vh #000;
  text-transform:uppercase;
  margin:1% 10%;
`
const menuButtonStyle = css`
  font-size: 5vh;
  color:#EEE;
  margin: 0.1em;
  padding: 0.3em;
  background-size: contain;
  background-position:right;
  background-repeat:no-repeat;
  background-color:transparent;
  border-radius:0;
  opacity:0.8;
  white-space: nowrap;
  justify-content: right;
  &:hover, &:active, &:focus, &:visited, &:before {
    opacity:1;
    background-color:transparent;
  }
`
const homeButtonStyle = css`
  background-image: url(${homeBackgroundImage});
`
const mainMenuButtonStyle = css`
  background-image: url(${mainMenuBackgroundImage});
`
const undoButtonStyle = css`
  background-image: url(${UndoBackgroundImage});
  @media all and (orientation:portrait) {
    display: none;
  }
`
const fullScreenButtonStyle = css`
  background-image: url(${FullScreenBackgroundImage});
`

export default MainMenu