import {createGameStore} from '@interlude-games/workshop'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import ItsAWonderfulWorldRules from './Rules'
import {ai} from './TutorialAI.worker'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('its-a-wonderful-world', ItsAWonderfulWorldRules, ai)}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

