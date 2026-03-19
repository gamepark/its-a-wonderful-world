/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'

export function PlanningHelp() {
  const { t } = useTranslation()

  return (
    <>
      <h2 css={titleCss}>{t('help.planning.title', 'Planning phase')}</h2>
      <p>
        {t('help.planning.description', 'You must make a decision for each Development card in your Draft area. For each card, you have 2 options:')}
      </p>
      <ul>
        <li>
          <strong>{t('help.planning.slate', 'Slate it for Construction:')}</strong>{' '}
          {t('help.planning.slate.description', 'Move the card into your Construction area (the card is considered "Under Construction").')}
        </li>
        <li>
          <strong>{t('help.planning.recycle', 'Recycle it:')}</strong>{' '}
          {t('help.planning.recycle.description', 'Discard the card and collect the card\'s Recycling Bonus. Place the resource either directly on a card Under Construction, or on your Empire card.')}
        </li>
      </ul>
    </>
  )
}

const titleCss = css`
  margin: 0 !important;
  border-bottom: 0.06em solid #666;
  padding-bottom: 0.2em;
`
