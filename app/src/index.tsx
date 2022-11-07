import Rules from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import ItsAWonderfulAnimations from './Animations'
import App from './App'
import ItsAWonderfulWorldView from './ItsAWonderfulWorldView'
import translations from './translations.json'
import ItsAWonderfulTutorial from './tutorial/Tutorial'
import {ai} from './tutorial/TutorialAI.worker'
import {ItsAWonderfulWorldOptionsSpec} from '@gamepark/its-a-wonderful-world/Options'

Object.values = Object.values || ((obj: any) => Object.keys(obj).map(key => obj[key])) // shim for older browsers
require('array.prototype.flatmap').shim()
setupTranslation(translations)

ReactDOM.render(
  <StrictMode>
    <GameProvider game="its-a-wonderful-world" Rules={Rules} RulesView={ItsAWonderfulWorldView} optionsSpec={ItsAWonderfulWorldOptionsSpec}
                  animations={new ItsAWonderfulAnimations()} tutorial={ItsAWonderfulTutorial} ai={ai}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)

