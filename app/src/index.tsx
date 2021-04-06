import ItsAWonderfulWorldView from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldView'
import {ItsAWonderfulWorldOptionsDescription} from '@gamepark/its-a-wonderful-world/Options'
import Rules from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import ItsAWonderfulAnimations from './Animations'
import App from './App'
import translations from './translations.json'
import ItsAWonderfulTutorial from './tutorial/Tutorial'
import {ai} from './tutorial/TutorialAI.worker'

Object.values = Object.values || ((obj: any) => Object.keys(obj).map(key => obj[key])) // shim for older browsers
require('array.prototype.flatmap').shim()
setupTranslation(translations)

ReactDOM.render(
  <StrictMode>
    <GameProvider game="its-a-wonderful-world" Rules={Rules} RulesView={ItsAWonderfulWorldView}
                  optionsDescription={ItsAWonderfulWorldOptionsDescription}
                  animations={ItsAWonderfulAnimations} tutorial={ItsAWonderfulTutorial} ai={ai}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)

