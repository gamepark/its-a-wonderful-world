import {css, Global} from '@emotion/core'
import {useGame} from '@interlude-games/workshop'
import normalize from 'emotion-normalize'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import React, {FunctionComponent} from 'react'
import {DndProvider} from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import {initReactI18next, useTranslation} from 'react-i18next'
import Game from './Game'
import Header from './Header'
import {ItsAWonderfulWorldView} from './ItsAWonderfulWorld'
import artwork from './material/its-cover-artwork.png'
import RotateScreenIcon from './util/RotateScreenIcon'

i18next.use(initReactI18next).use(ICU)

i18next.init({
  lng: 'fr',
  fallbackLng: 'en',
  keySeparator: '>',
  nsSeparator: '|',
  resources: {
    en: {
      website: {}
    },
    fr: {
      website: {}
    }
  }
})

const App: FunctionComponent = () => {
  const {t} = useTranslation()
  const game = useGame<ItsAWonderfulWorldView>()
  return (
    <DndProvider backend={MultiBackend} options={HTML5ToTouch}>
      <Global styles={globalStyle}/>
      {game && <Game game={game}/>}
      <p css={portraitInfo}>{t('Pour jouer, veuillez incliner votre mobile')}<RotateScreenIcon/></p>
      <Header/>
    </DndProvider>
  )
}

export default App

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
  }
  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-image: url(${artwork});
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
