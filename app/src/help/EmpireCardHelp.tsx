/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { getPlayerName } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { CustomMoveType } from '@gamepark/its-a-wonderful-world/material/CustomMoveType'
import { Empires } from '@gamepark/its-a-wonderful-world/material/Empires'
import { EmpireSide } from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import { isResource, Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { isProductionFactor, Production } from '@gamepark/its-a-wonderful-world/Production'
import { ComboVictoryPoints } from '@gamepark/its-a-wonderful-world/Scoring'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMoves, usePlayerId } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { characterIcons, corruptionIcon, developmentTypeIcons, resourceIcons } from '../panels/Images'
import { getDevelopmentTypeName, getResourceName } from './helpUtils'

type EmpireCardId = { empire: Empire; side: EmpireSide }

export function EmpireCardHelp({ item, closeDialog }: MaterialHelpProps) {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const legalMoves = useLegalMoves()

  const id = item.id as EmpireCardId | undefined
  if (!id) return null

  const empire = id.empire
  const side = id.side
  const details = Empires[empire]?.[side]
  if (!details) return null

  const letter = String.fromCharCode(64 + side)

  const placeAllMove = legalMoves.find(
    move => isCustomMoveType(CustomMoveType.PlaceAllOnEmpire)(move) && move.data === playerId
  )

  return (
    <>
      <h2 css={titleCss}>
        ({letter}) {getPlayerName(empire, t)}
      </h2>

      <p css={explanationCss}>
        {t('help.empire.description', 'Each player starts with an Empire card that provides a base production.')}
      </p>
      <p css={explanationCss}>
        {t('help.empire.conversion', 'Every 5 resource cubes placed on the Empire card are converted into 1 Krystallium.')}
      </p>

      {placeAllMove && (
        <div css={actionsCss}>
          <PlayMoveButton move={placeAllMove} onPlay={closeDialog}>
            {t('help.empire.placeAll', 'Place all resources on empire')}
          </PlayMoveButton>
        </div>
      )}

      <h3 css={sectionTitleCss}>{t('Production')}</h3>
      <div css={iconRowCss}>
        <EmpireProductionIcons production={details.production} />
      </div>
      <EmpireProductionDescription production={details.production} />

      {details.krystallium !== undefined && details.krystallium > 0 && (
        <>
          <h3 css={sectionTitleCss}>{t('Krystallium')}</h3>
          <div css={iconRowCss}>
            {[...Array(details.krystallium)].map((_, i) => (
              <Picture key={i} src={resourceIcons[Resource.Krystallium]} css={inlineIconCss} />
            ))}
          </div>
          <p css={explanationCss}>{t('help.empire.krystallium', 'Krystallium received at the start of each round.')}</p>
        </>
      )}

      {details.victoryPoints && (
        <>
          <h3 css={sectionTitleCss}>{t('help.development.victoryPoints', 'Victory points')}</h3>
          <EmpireVictoryPointsDisplay victoryPoints={details.victoryPoints} />
        </>
      )}
    </>
  )
}

function EmpireProductionIcons({ production }: { production: Production }) {
  if (isResource(production)) {
    return <Picture src={resourceIcons[production]} css={inlineIconCss} />
  }
  if (isProductionFactor(production)) {
    return (
      <>
        <Picture src={resourceIcons[production.resource]} css={inlineIconCss} />
        <span css={factorCss}>x</span>
        <Picture src={developmentTypeIcons[production.factor]} css={typeIconSmallCss} />
      </>
    )
  }
  const icons: ReactElement[] = []
  const resourceOrder: Resource[] = [
    Resource.Materials, Resource.Energy, Resource.Science,
    Resource.Gold, Resource.Exploration, Resource.Krystallium
  ]
  for (const key of resourceOrder) {
    const count = (production as any)[key] ?? 0
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        icons.push(<Picture key={`${key}-${i}`} src={resourceIcons[key]} css={inlineIconCss} />)
      }
    } else if (count < 0) {
      for (let i = 0; i < -count; i++) {
        icons.push(
          <span key={`${key}-corrupt-${i}`} css={corruptionWrapperCss}>
            <Picture src={resourceIcons[key]} css={inlineIconCss} />
            <Picture src={corruptionIcon} css={corruptionOverlayCss} />
          </span>
        )
      }
    }
  }
  return <>{icons}</>
}

function EmpireProductionDescription({ production }: { production: Production }) {
  const { t } = useTranslation()
  const hasCorruption = !isResource(production) && !isProductionFactor(production)
    && Object.entries(production as { [key in Resource | Character]?: number }).some(([, v]) => v !== undefined && v < 0)
  return (
    <>
      {isProductionFactor(production) && (
        <p css={explanationCss}>
          {t('help.development.production.factor', 'Produces 1 {resource} per {type} built.', {
            resource: getResourceName(t, production.resource),
            type: getDevelopmentTypeName(t, production.factor)
          })}
        </p>
      )}
      {hasCorruption && (
        <p css={explanationCss}>
          {t('help.development.production.corruption', 'Certain Corruption & Ascension cards produce Corruption. If you have any of these in your Empire, subtract the corrupted resources from your total production.')}
        </p>
      )}
    </>
  )
}

function EmpireVictoryPointsDisplay({ victoryPoints }: { victoryPoints: ComboVictoryPoints }) {
  const { t } = useTranslation()
  const items = Array.isArray(victoryPoints.per) ? victoryPoints.per : [victoryPoints.per]
  return (
    <div css={iconRowCss}>
      <strong>{victoryPoints.quantity}</strong>
      <span css={factorCss}>x</span>
      {items.map(item =>
        isCharacter(item)
          ? <Picture key={item} src={characterIcons[item]} css={roundIconCss} />
          : <Picture key={item} src={developmentTypeIcons[item]} css={typeIconSmallCss} />
      )}
      <span css={factorLabelCss}>
        {items.map(item =>
          isCharacter(item)
            ? (item === Character.Financier ? t('Financier token') : t('General token'))
            : getDevelopmentTypeName(t, item)
        ).join(' + ')}
      </span>
    </div>
  )
}

const titleCss = css`
  margin: 0 !important;
  border-bottom: 0.06em solid #666;
  padding-bottom: 0.2em;
`

const sectionTitleCss = css`
  font-size: 1em;
  margin: 0.4em 0 0.1em;
`

const iconRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.1em;
  flex-wrap: wrap;
`

const inlineIconCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
`

const roundIconCss = css`
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  object-fit: cover;
  aspect-ratio: 1;
`

const typeIconSmallCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
`

const factorCss = css`
  font-weight: bold;
`

const factorLabelCss = css`
  font-style: italic;
  margin-left: 0.2em;
`

const explanationCss = css`
  font-size: 0.9em;
  color: #555;
  margin-top: 0.1em;
`

const actionsCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin: 0.5em 0;
`

const corruptionWrapperCss = css`
  position: relative;
  display: inline-flex;
  width: 1.5em;
  height: 1.5em;
`

const corruptionOverlayCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  opacity: 0.8;
`
