import Rules from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {ItsAWonderfulWorldOptionsSpec} from '@gamepark/its-a-wonderful-world/Options'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import ItsAWonderfulAnimations from './Animations'
import App from './App'
import ItsAWonderfulWorldView from './ItsAWonderfulWorldView'
import ItsAWonderfulTutorial from './tutorial/Tutorial'
import {ai} from './tutorial/TutorialAI.worker'

setupTranslation('its-a-wonderful-world')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider game="its-a-wonderful-world" Rules={Rules} RulesView={ItsAWonderfulWorldView} optionsSpec={ItsAWonderfulWorldOptionsSpec}
                  animations={new ItsAWonderfulAnimations()} tutorial={ItsAWonderfulTutorial} ai={ai}>
      <App/>
    </GameProvider>
  </StrictMode>
)
