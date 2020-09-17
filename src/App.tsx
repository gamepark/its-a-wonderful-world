import {css, Global} from '@emotion/core'
import {useDisplayState, useFailures, useGame} from '@interlude-games/workshop'
import normalize from 'emotion-normalize'
import {ThemeProvider} from 'emotion-theming'
import fscreen from 'fscreen'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import moment from 'moment'
import 'moment/locale/fr'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import {initReactI18next, useTranslation} from 'react-i18next'
import FailurePopup from './FailurePopup'
import GameDisplay from './GameDisplay'
import Header from './Header'
import EmpireName from './material/empires/EmpireName'
import Images from './material/Images'
import Move from './moves/Move'
import Theme, {DarkTheme, LightTheme} from './Theme'
import translations from './translations.json'
import GameView from './types/GameView'
import Button from './util/Button'
import ImagesLoader from './util/ImageLoader'
import LoadingScreen from './util/LoadingScreen'
import {backgroundColor, empireBackground, textColor} from './util/Styles'

i18next.use(initReactI18next).use(ICU)

const query = new URLSearchParams(window.location.search)
const locale = query.get('locale') || 'en'
const userTheme = 'userTheme'

i18next.init({
  lng: locale,
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  resources: translations
})

moment.locale(locale)

const App: FunctionComponent = () => {
  const {t} = useTranslation()
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem(userTheme) || DarkTheme)
  const game = useGame<GameView>()
  const [failures, clearFailures] = useFailures<Move>()
  const [displayedEmpire] = useDisplayState<EmpireName>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const theme = {
    color: themeColor,
    switchThemeColor: () => {
      let newThemeColor = themeColor === LightTheme ? DarkTheme : LightTheme
      setThemeColor(newThemeColor)
      localStorage.setItem(userTheme, newThemeColor)
    }
  }
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      <ThemeProvider theme={theme}>
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme), backgroundImage(displayedEmpire)]}/>
        <LoadingScreen display={loading}/>
        {!loading && <GameDisplay game={game!}/>}
        <p css={(theme: Theme) => [portraitInfo, textColor(theme)]}>
          {t('La résolution idéale pour jouer est en mode paysage, en 16/9.')}
          <br/>
          <Button onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>{t('Passer en plein écran')}</Button>
        </p>
        <Header game={game} loading={loading}/>
        {failures.length > 0 && <FailurePopup failures={failures} clearFailures={clearFailures}/>}
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}

export default App

const backgroundImage = (empire?: EmpireName) => css`
  #root {
    background-image: url(${empire ? empireBackground[empire] : Images.coverArtwork});
  }
`

const globalStyle = css`
  ${normalize};
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
    *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }
  body {
    margin: 0;
    font-family: 'Oswald', "Roboto Light", serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }
  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
`

const themeStyle = (theme: Theme) => css`
  #root {
    ${backgroundColor(theme)}
  }
`

const portraitInfo = css`
    @media (min-aspect-ratio: 4/3) {
    display: none;
  }
  text-align: center;
  position: absolute;
  line-height: 1.5;
  font-size: 3.5vw;
  top: 55vw;
  left: 10%;
  right: 10%;
  & > svg {
    width: 30%;
    margin-top: 1em;
  }
`
