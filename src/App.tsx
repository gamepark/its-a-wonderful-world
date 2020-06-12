import {css, Global} from '@emotion/core'
import {useDisplayState, useFailures, useGame} from '@interlude-games/workshop'
import normalize from 'emotion-normalize'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import React, {FunctionComponent} from 'react'
import {DndProvider} from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import {initReactI18next, useTranslation} from 'react-i18next'
import FailurePopup from './FailurePopup'
import GameDisplay from './GameDisplay'
import Header from './Header'
import EmpireName from './material/empires/EmpireName'
import artwork from './material/its-cover-artwork.jpg'
import Move from './moves/Move'
import translations from './translations.json'
import GameView from './types/GameView'
import RotateScreenIcon from './util/RotateScreenIcon'
import {empireBackground} from './util/Styles'

i18next.use(initReactI18next).use(ICU)

const query = new URLSearchParams(window.location.search)
const locale = query.get('locale') || 'en'

i18next.init({
  lng: locale,
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  resources: translations
})

const App: FunctionComponent = () => {
  const {t} = useTranslation()
  const game = useGame<GameView>()
  const [failures, clearFailures] = useFailures<Move>()
  const [displayedEmpire] = useDisplayState<EmpireName>()
  return (
    <DndProvider backend={MultiBackend} options={HTML5ToTouch}>
      <Global styles={[globalStyle, backgroundImage(displayedEmpire)]}/>
      {game && <GameDisplay game={game}/>}
      <p css={portraitInfo}>{t('Pour jouer, veuillez incliner votre mobile')}<RotateScreenIcon/></p>
      <Header/>
      {failures.length > 0 && <FailurePopup failures={failures} clearFailures={clearFailures}/>}
    </DndProvider>
  )
}

export default App

const backgroundImage = (empire?: EmpireName) => css`
  #root {
    background-color: rgba(255, 255, 255, 0.7);
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-image: url(${empire ? empireBackground[empire] : artwork});
    }
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
