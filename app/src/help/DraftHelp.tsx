/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'

export function DraftHelp() {
  const { t } = useTranslation()

  return (
    <>
      <h2 css={titleCss}>{t('help.rounds.title', 'Game rounds')}</h2>
      <p>
        {t(
          'help.rounds.description',
          'The game takes place over 4 rounds. Each round includes a Draft phase followed by a Planning phase and a Production phase.'
        )}
      </p>
      <p>
        {t('help.rounds.draft.description', 'During the Draft phase, players pass their remaining cards to their neighbor after picking one card each turn.')}
      </p>
      <p>{t('help.rounds.draft.direction', 'Cards are passed to the left in rounds 1 and 3, and to the right in rounds 2 and 4.')}</p>
    </>
  )
}

const titleCss = css`
  margin: 0 !important;
  border-bottom: 0.06em solid #666;
  padding-bottom: 0.2em;
`
