import Rules from '@gamepark/its-a-wonderful-world/Rules'
import {createGameStore} from '@gamepark/workshop'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import {ai} from './TutorialAI.worker'

Object.values = Object.values || ((obj: any) => Object.keys(obj).map(key => obj[key])) // shim for older browsers
require('array.prototype.flatmap').shim()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('its-a-wonderful-world', Rules, ai)}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

