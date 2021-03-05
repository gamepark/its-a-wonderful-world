import Rules from '@gamepark/its-a-wonderful-world/Rules'
import {createGameStore} from '@gamepark/react-client'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import ItsAWonderfulAnimations from './Animations'
import App from './App'
import ItsAWonderfulTutorial from './tutorial/Tutorial'
import {ai} from './tutorial/TutorialAI.worker'

Object.values = Object.values || ((obj: any) => Object.keys(obj).map(key => obj[key])) // shim for older browsers
require('array.prototype.flatmap').shim()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('its-a-wonderful-world', Rules, {
      animations: ItsAWonderfulAnimations, tutorial: ItsAWonderfulTutorial, ai
    })}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

