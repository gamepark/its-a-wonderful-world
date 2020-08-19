import {createGameStore} from '@interlude-games/workshop'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import EmpireName from './material/empires/EmpireName'
import ItsAWonderfulWorldRules from './Rules'
import TutorialAI from './TutorialAI'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('its-a-wonderful-world', ItsAWonderfulWorldRules, (playerId: EmpireName) => new TutorialAI(playerId))}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

