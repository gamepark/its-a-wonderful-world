/** @jsxImportSource @emotion/react */
import {css, Global, Theme, ThemeProvider} from '@emotion/react'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {canBuild, numberOfRounds} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import Move from '@gamepark/its-a-wonderful-world/moves/Move'
import {tellYouAreReadyMove} from '@gamepark/its-a-wonderful-world/moves/TellYouAreReady'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useDisplayState, useFailures, useGame, usePlay, usePlayerId} from '@gamepark/react-client'
import {LoadingScreen} from '@gamepark/react-components'
import normalize from 'emotion-normalize'
import fscreen from 'fscreen'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import {useTranslation} from 'react-i18next'
import ConfirmPopup from './ConfirmPopup'
import FailurePopup from './FailurePopup'
import GameDisplay from './GameDisplay'
import Header from './Header'
import Images from './material/Images'
import IWWBox from './material/IWW_BOX_3D.png'
import {Color, DarkTheme, LightTheme} from './Theme'
import Button from './util/Button'
import ImagesLoader from './util/ImagesLoader'
import {backgroundColor, empireBackground, textColor} from './util/Styles'

const userTheme = 'userTheme'

export default function App() {
  const {t} = useTranslation()
  const [themeColor, setThemeColor] = useState<Color>(() => (localStorage.getItem(userTheme) || DarkTheme) as Color)
  const game = useGame<GameView>()
  const [failures, clearFailures] = useFailures<Move>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const play = usePlay<Move>()
  const playerId = usePlayerId<EmpireName>()
  const [displayedEmpire] = useDisplayState<EmpireName | undefined>(undefined)
  const theme: Theme = {
    color: themeColor,
    switchThemeColor: () => {
      const newThemeColor: Color = themeColor === LightTheme ? DarkTheme : LightTheme
      setThemeColor(newThemeColor)
      localStorage.setItem(userTheme, newThemeColor)
    }
  }
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  const [confirmPopup, setConfirmPopup] = useState(false)
  const validate = () => {
    if (game && playerId) {
      const willEndGame = game.round === numberOfRounds && game.phase === Phase.Production && game.productionStep === Resource.Exploration
      const player = game.players.find(player => player.empire === playerId)
      if (player && isPlayer(player) && willEndGame && player.constructionArea.some(construction => canBuild(player, construction.card))) {
        setConfirmPopup(true)
      } else {
        play(tellYouAreReadyMove(playerId))
      }
    }
  }
  const confirm = () => {
    if (!playerId) return
    setConfirmPopup(false)
    play(tellYouAreReadyMove(playerId))
  }
  return (
    <DndProvider options={HTML5ToTouch}>
      <ThemeProvider theme={theme}>
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme), backgroundImage(displayedEmpire)]}/>
        <LoadingScreen gameBox={IWWBox} author="Frédéric Guérard" artist="Anthony Wolff" publisher={['La Boite de Jeu', 'Origames']} display={loading}
                       css={[loadingScreenStyle, textColor(theme), backgroundColor(theme)]}/>
        {!loading && <GameDisplay game={game!} validate={validate}/>}
        <p css={(theme: Theme) => [portraitInfo, textColor(theme)]}>
          {t('The ideal resolution for playing is in landscape mode, in 16:9.')}
          <br/>
          <Button onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>{t('Go to full screen')}</Button>
        </p>
        <Header game={game} loading={loading} validate={validate}/>
        {failures.length > 0 && <FailurePopup failures={failures} clearFailures={clearFailures}/>}
        {confirmPopup && <ConfirmPopup cancel={() => setConfirmPopup(false)} confirm={confirm}/>}
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}

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

const loadingScreenStyle = css`
  background-image: url(${Images.coverArtwork});

`