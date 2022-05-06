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
import {FailuresDialog, FullscreenDialog, Menu, useContrastTheme, useGame, usePlay, usePlayerId} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import normalize from 'emotion-normalize'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import ConfirmPopup from './ConfirmPopup'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Images from './material/Images'
import {backgroundColor, empireBackground, textColor} from './util/Styles'

export default function App() {
  const theme = useContrastTheme()
  const game = useGame<GameView>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const play = usePlay<Move>()
  const playerId = usePlayerId<EmpireName>()
  const displayedPlayer = game?.displayedPlayer ?? playerId ?? game?.players[0].empire
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
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme), backgroundImage(displayedPlayer)]}/>
        <LoadingScreen author="Frédéric Guérard" artist="Anthony Wolff" publisher={['La Boite de Jeu', 'Origames']} developer="Game Park"
                       display={loading} css={[loadingScreenStyle, textColor(theme), backgroundColor(theme)]}/>
        {!loading && <GameDisplay game={game!} validate={validate}/>}
        <Header css={[headerStyle, theme.light && lightHeader]}><HeaderText game={game} loading={loading} validate={validate}/></Header>
        <Menu/>
        <FailuresDialog/>
        <FullscreenDialog/>
        {confirmPopup && <ConfirmPopup cancel={() => setConfirmPopup(false)} confirm={confirm}/>}
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}

const backgroundImage = (empire?: EmpireName) => css`
  #root {
    background-image: url(${empire ? empireBackground[empire] : process.env.PUBLIC_URL + '/cover-1920.jpg'});
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

const loadingScreenStyle = css`
  background-image: url(${process.env.PUBLIC_URL + '/cover-1920.jpg'});
`

const headerStyle = css`
  > h1 > button {
    font-size: 0.8em;
  }
`

const lightHeader = css`
  background-color: rgba(255, 255, 255, 0.5);
  h1 {
    color: #333;
  }
`