import '@fontsource/oswald'
import { ItsAWonderfulWorldOptionsSpec } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'
import { ItsAWonderfulWorldRules } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldRules'
import { ItsAWonderfulWorldSetup } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material, materialI18n } from './material/Material'
import { Tutorial } from './tutorial/Tutorial'
import { ai } from './tutorial/TutorialAI'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="its-a-wonderful-world"
      Rules={ItsAWonderfulWorldRules}
      optionsSpec={ItsAWonderfulWorldOptionsSpec}
      GameSetup={ItsAWonderfulWorldSetup}
      material={Material}
      materialI18n={materialI18n}
      locators={Locators}
      animations={gameAnimations}
      tutorial={new Tutorial()}
      ai={ai}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
