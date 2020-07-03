import {css, Global} from '@emotion/core'
import {useDisplayState, useFailures, useGame} from '@interlude-games/workshop'
import normalize from 'emotion-normalize'
import {ThemeProvider} from 'emotion-theming'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import moment from 'moment'
import 'moment/locale/fr'
import React, {FunctionComponent, useState} from 'react'
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
import ImagesLoader from './util/ImageLoader'
import RotateScreenIcon from './util/RotateScreenIcon'
import {empireBackground} from './util/Styles'
import LoadingScreen from './util/LoadingScreen'

i18next.use(initReactI18next).use(ICU)

const query = new URLSearchParams(window.location.search)
const locale = query.get('locale') || 'en'
const userTheme = 'userTheme'

i18next.init({
  lng: locale,
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  resources: translations
})

moment.locale(locale)

const App: FunctionComponent = () => {
  const {t} = useTranslation()
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem(userTheme) || LightTheme)
  const game = useGame<GameView>()
  const [failures, clearFailures] = useFailures<Move>()
  const [displayedEmpire] = useDisplayState<EmpireName>()
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const theme = {
    color: themeColor,
    switchThemeColor: () => {
      let newThemeColor = themeColor === LightTheme ? DarkTheme : LightTheme
      setThemeColor(newThemeColor)
      localStorage.setItem(userTheme, newThemeColor)
    }
  }
  const onImagesLoad = () => setImagesLoaded(true)
  return (
    <DndProvider options={HTML5ToTouch}>
      <ThemeProvider theme={theme}>
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme), backgroundImage(displayedEmpire)]}/>
        {game && imagesLoaded && <GameDisplay game={game}/>}
        <p css={portraitInfo}>{t('Pour jouer, veuillez incliner votre mobile')}<RotateScreenIcon/></p>
        <Header game={game} imagesLoaded={imagesLoaded}/>
        {failures.length > 0 && <FailurePopup failures={failures} clearFailures={clearFailures}/>}
        {!imagesLoaded && <LoadingScreen />}
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={onImagesLoad}/>
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
  #root:before {
    background-color: ${theme.color === LightTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 30, 0.7)'};
    transition: background-color 1s ease-in;
  }
`

const portraitInfo = css`
  @media all and (orientation:landscape) {
    display: none;
  }
  text-align: center;
  position: absolute;
  line-height: 1.5;
  font-size: 2em;
  top: 30%;
  left: 10%;
  right: 10%;
  & > svg {
    width: 30%;
    margin-top: 1em;
  }
`
