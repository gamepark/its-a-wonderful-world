import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

export const PassCardsHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const round = rules?.remind(Memory.Round) ?? 1

  if (round % 2 === 1) {
    return <>{t('header.draft.left', 'The players pass the rest of the cards to the left')}</>
  } else {
    return <>{t('header.draft.right', 'The players pass the rest of the cards to the right')}</>
  }
}
