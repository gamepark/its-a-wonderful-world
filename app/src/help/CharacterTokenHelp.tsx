/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'
import { characterIcons } from '../panels/Images'

export function CharacterTokenHelp({ item }: MaterialHelpProps) {
  const { t } = useTranslation()
  const character = item.id as Character
  const isFinancier = character === Character.Financier

  return (
    <>
      <h2 css={titleCss}>
        <Picture src={characterIcons[character]} css={titleIconCss} />
        {isFinancier ? t('Financier token') : t('General token')}
      </h2>

      <h3 css={sectionTitleCss}>{t('help.character.obtain', 'How to obtain')}</h3>
      <p>
        {t('help.character.obtain.supremacy', 'Character tokens are awarded as supremacy bonuses during the Production phase. The player who produces the most of a given resource, alone, receives a token.')}
      </p>
      <p>
        {t('help.character.obtain.construction', 'Some Development cards also give a character token as a construction bonus when built.')}
      </p>

      <h3 css={sectionTitleCss}>{t('help.character.use', 'How to use')}</h3>
      <p>
        {t('help.character.use.description', 'Character tokens can be placed on Development cards that require them as part of their construction cost. They can also be used to directly build a card by paying its full remaining cost at once.')}
      </p>

      <h3 css={sectionTitleCss}>{t('help.character.scoring', 'Scoring')}</h3>
      <p>
        {t('help.character.scoring.description', 'At the end of the game, each character token that is not placed on a card is worth 1 victory point. Some Empire cards and Developments also score bonus points per character token.')}
      </p>
    </>
  )
}

const titleCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  border-bottom: 2px solid #666;
  padding-bottom: 0.2em;
  margin: 0 !important;
`

const titleIconCss = css`
  height: 1.5em;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.4);
`

const sectionTitleCss = css`
  font-size: 1em;
  margin: 0.4em 0 0.1em;
`
