/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { Picture, useGame, usePlayerName, useRules } from '@gamepark/react-game'
import { MaterialGame, MaterialRules } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import Financier from '../images/characters/financier.jpg'
import General from '../images/characters/general.jpg'
import EnergyIcon from '../images/resources/energy.png'
import ExplorationIcon from '../images/resources/exploration.png'
import GoldIcon from '../images/resources/gold.png'
import KrystalliumIcon from '../images/resources/krytallium.png'
import MaterialsIcon from '../images/resources/materials.png'
import ScienceIcon from '../images/resources/science.png'
import { getSupremacyWinners } from '../utils/getSupremacyWinners'

const resourceImages: Record<Resource, string> = {
  [Resource.Materials]: MaterialsIcon,
  [Resource.Energy]: EnergyIcon,
  [Resource.Science]: ScienceIcon,
  [Resource.Gold]: GoldIcon,
  [Resource.Exploration]: ExplorationIcon,
  [Resource.Krystallium]: KrystalliumIcon
}

const resourceColors: Record<Resource, string> = {
  [Resource.Materials]: '#888',
  [Resource.Energy]: '#222',
  [Resource.Science]: '#2d8a2d',
  [Resource.Gold]: '#c9a800',
  [Resource.Exploration]: '#2b6cb0',
  [Resource.Krystallium]: '#9b2d9b'
}

type ProductionHelpConfig = {
  resource: Resource
  titleKey: string
  titleDefault: string
  resourceName: string
  order: number
  character: 'financier' | 'general' | 'choice'
}

const productionConfigs: Record<number, ProductionHelpConfig> = {
  [Resource.Materials]: { resource: Resource.Materials, titleKey: 'help.production.Materials.title', titleDefault: 'Materials Production', resourceName: 'Materials', order: 1, character: 'financier' },
  [Resource.Energy]: { resource: Resource.Energy, titleKey: 'help.production.Energy.title', titleDefault: 'Energy Production', resourceName: 'Energy', order: 2, character: 'general' },
  [Resource.Science]: { resource: Resource.Science, titleKey: 'help.production.Science.title', titleDefault: 'Science Production', resourceName: 'Science', order: 3, character: 'choice' },
  [Resource.Gold]: { resource: Resource.Gold, titleKey: 'help.production.Gold.title', titleDefault: 'Gold Production', resourceName: 'Gold', order: 4, character: 'financier' },
  [Resource.Exploration]: { resource: Resource.Exploration, titleKey: 'help.production.Exploration.title', titleDefault: 'Exploration Production', resourceName: 'Exploration', order: 5, character: 'general' }
}

function SupremacyStatus({ resource }: { resource: Resource }) {
  const { t } = useTranslation()
  const game = useGame<MaterialGame>()
  const rules = useRules<MaterialRules>()
  const winners = game ? getSupremacyWinners(game, resource) : []
  const name0 = usePlayerName(winners[0])
  const name1 = usePlayerName(winners[1])
  if (!game || !rules) return null

  if (winners.length === 0) {
    return <p css={statusCss}>{t('help.production.status.nobody', 'Currently, nobody would win the bonus (no production or tie).')}</p>
  }

  if (winners.length === 1) {
    return <p css={statusCss}><strong>{t('help.production.status.winner', '{player} would win the bonus.', { player: name0 })}</strong></p>
  }

  return (
    <p css={statusCss}>
      <strong>{t('help.production.status.winners', '{player1} and {player2} would win the bonus.', { player1: name0, player2: name1 })}</strong>
    </p>
  )
}

export function ProductionHelp({ resource }: { resource: Resource }) {
  const { t } = useTranslation()
  const game = useGame<MaterialGame>()
  const config = productionConfigs[resource]
  if (!config) return null

  const resourceName = config.resourceName
  const is6Plus = (game?.players.length ?? 0) >= 6

  return (
    <>
      <h2 css={titleCss(resourceColors[resource])}>
        <Picture src={resourceImages[resource]} css={titleIconCss} />
        {t(config.titleKey, config.titleDefault)}
      </h2>

      <p css={stepCss}>{t('help.production.step', 'Step {step} of 5', { step: config.order })}</p>

      <h3>{t('help.production.how', 'How does it work?')}</h3>
      <p>
        {t(
          'help.production.description',
          'Each player simultaneously produces {resource} cubes. Count the {resource} symbols on your Empire card and all your built Developments. You receive that many {resource} cubes.',
          { resource: resourceName }
        )}
      </p>

      <h3 css={bonusTitleCss}>{t('help.production.bonus', 'Supremacy bonus')}</h3>
      <div css={bonusContainerCss}>
        {config.character === 'financier' && (
          <div css={characterCss}>
            <Picture src={Financier} css={characterImgCss} />
            <span>
              {is6Plus
                ? t(
                    'help.production.bonus.financier.6p',
                    'The 2 players who produce the most {resource} each receive a Financier token. In case of a tie that prevents ranking, no token is awarded for the tied places.',
                    { resource: resourceName }
                  )
                : t('help.production.bonus.financier', 'The player who produces the most {resource}, alone, receives a Financier token.', {
                    resource: resourceName
                  })}
            </span>
          </div>
        )}
        {config.character === 'general' && (
          <div css={characterCss}>
            <Picture src={General} css={characterImgCss} />
            <span>
              {is6Plus
                ? t(
                    'help.production.bonus.general.6p',
                    'The 2 players who produce the most {resource} each receive a General token. In case of a tie that prevents ranking, no token is awarded for the tied places.',
                    { resource: resourceName }
                  )
                : t('help.production.bonus.general', 'The player who produces the most {resource}, alone, receives a General token.', { resource: resourceName })}
            </span>
          </div>
        )}
        {config.character === 'choice' && (
          <div css={characterCss}>
            <div css={choiceImgCss}>
              <Picture src={Financier} css={characterImgCss} />
              <Picture src={General} css={characterImgCss} />
            </div>
            <span>
              {is6Plus
                ? t(
                    'help.production.bonus.choice.6p',
                    'The 2 players who produce the most {resource} each receive a Financier or General token (their choice). In case of a tie that prevents ranking, no token is awarded for the tied places.',
                    { resource: resourceName }
                  )
                : t('help.production.bonus.choice', 'The player who produces the most {resource}, alone, receives a Financier or General token (their choice).', {
                    resource: resourceName
                  })}
            </span>
          </div>
        )}
        <SupremacyStatus resource={resource} />
      </div>

      <h3>{t('help.production.placement', 'Resource placement')}</h3>
      <p>
        {t(
          'help.production.placement.description',
          'Each produced resource must immediately be placed on a Development under construction (on an empty cost slot of the matching type) or on your Empire card. Every 5 resources on your Empire card are immediately converted into 1 Krystallium.'
        )}
      </p>
      <p>
        <Picture src={KrystalliumIcon} css={inlineIconCss} />{' '}
        {t(
          'help.krystallium',
          "You can use 1 Krystallium to replace any Resource. However, you cannot use it to replace a Character."
        )}
      </p>
    </>
  )
}

// --- Styles ---

const titleCss = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  border-bottom: 3px solid ${color};
  padding-bottom: 0.3em;
  margin: 0 !important;
`

const titleIconCss = css`
  width: 2em;
  height: 2em;
  object-fit: contain;
`

const stepCss = css`
  font-style: italic;
  color: #666;
  margin-top: 0.2em;
`

const bonusTitleCss = css`
  margin-top: 1em;
`

const bonusContainerCss = css`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5em;
  padding: 0.8em;
`

const characterCss = css`
  display: flex;
  align-items: center;
  gap: 0.8em;
`

const characterImgCss = css`
  width: 3em;
  height: 3em;
  border-radius: 50%;
  flex-shrink: 0;
`

const choiceImgCss = css`
  display: flex;
  gap: 0.3em;
  flex-shrink: 0;
`

const inlineIconCss = css`
  width: 1.2em;
  height: 1.2em;
  object-fit: contain;
  vertical-align: middle;
`

const statusCss = css`
  margin-top: 0.6em;
  font-style: italic;
`
