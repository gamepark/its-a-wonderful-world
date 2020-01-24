import React from 'react'
import {render} from 'react-dom'
import ItsAWonderfulWorld from '../src/game'

const App = () => (
  <ItsAWonderfulWorld/>
)
render(<App/>, document.getElementById('root'))