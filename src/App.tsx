import {css, Global} from '@emotion/core'
import {useGame} from '@interlude-games/workshop'
import normalize from 'emotion-normalize'
import React, {FunctionComponent} from 'react'
import {DndProvider} from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import Game from './Game'
import Header from './Header'
import {ItsAWonderfulWorldView} from './ItsAWonderfulWorld'
import artwork from './material/its-cover-artwork.png'

const App: FunctionComponent = () => {
  const game = useGame<ItsAWonderfulWorldView>()
  return (
    <DndProvider backend={MultiBackend} options={HTML5ToTouch}>
      <Global styles={globalStyle}/>
      {game && <Game game={game}/>}
      <Header/>
    </DndProvider>
  )
}

export default App

const globalStyle = css`
  ${normalize};
  html {
    height: 100%;
    user-select: none;
    background-color: white;
    overflow: hidden;
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
    height: 100%;
    margin: 0;
  }
  #root {
    height: 100%;
    background-image: url(${artwork});
    background-size: cover;
    background-position: center;
  }
`