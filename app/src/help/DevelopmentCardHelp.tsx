/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { Development, getDevelopmentDetails } from '@gamepark/its-a-wonderful-world/material/Development'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { isResource, Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { isProductionFactor, Production } from '@gamepark/its-a-wonderful-world/Production'
import { ComboVictoryPoints, VictoryPoints } from '@gamepark/its-a-wonderful-world/Scoring'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMoves, usePlay, usePlayerId, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { characterIcons, developmentTypeIcons, resourceIcons } from '../panels/Images'

const developmentTypeColors: Record<DevelopmentType, string> = {
  [DevelopmentType.Structure]: '#888',
  [DevelopmentType.Vehicle]: '#222',
  [DevelopmentType.Research]: '#2d8a2d',
  [DevelopmentType.Project]: '#c9a800',
  [DevelopmentType.Discovery]: '#2b6cb0',
  [DevelopmentType.Memorial]: '#6b3fa0'
}

export function DevelopmentCardHelp({ item, itemIndex, closeDialog }: MaterialHelpProps) {
  const { t } = useTranslation()
  const id = item.id as { front?: Development; back?: number } | undefined
  if (!id?.front) {
    return <p>{t('help.development.hidden', 'Face-down Development card')}</p>
  }

  const development = id.front
  const details = getDevelopmentDetails(development)

  const typeName = getDevelopmentTypeName(t, details.type)
  const color = developmentTypeColors[details.type]
  const copies = details.numberOfCopies ?? 1

  return (
    <>
      <h2 css={titleCss(color)}>
        {developmentTypeIcons[details.type] &&
          <Picture src={developmentTypeIcons[details.type]} css={typeIconCss} />
        }
        {t(`card.${development}`)}
      </h2>
      <p css={subtitleCss}>
        {typeName}
        {copies > 1 && <> — {t('help.development.copies', '{count} copies', { count: copies })}</>}
      </p>

      <CardActions itemIndex={itemIndex} closeDialog={closeDialog} />

      <h3 css={sectionTitleCss}>{t('help.development.cost', 'Construction cost')}</h3>
      <div css={iconRowCss}>
        <CostIcons cost={details.constructionCost} />
      </div>

      {details.constructionBonus && details.constructionBonus.length > 0 && <>
        <h3 css={sectionTitleCss}>{t('help.development.constructionBonus', 'Construction bonus')}</h3>
        <div css={iconRowCss}>
          {details.constructionBonus.map((bonus, i) =>
            bonus === Resource.Krystallium
              ? <Picture key={i} src={resourceIcons[Resource.Krystallium]} css={inlineIconCss} />
              : <Picture key={i} src={characterIcons[bonus as Character]} css={roundIconCss} />
          )}
        </div>
        <p css={explanationCss}>
          {t('help.development.constructionBonus.description', 'Received immediately when the Development is built.')}
        </p>
      </>}

      {details.production && <>
        <h3 css={sectionTitleCss}>{t('help.development.production', 'Production')}</h3>
        <div css={iconRowCss}>
          <ProductionIcons production={details.production} />
        </div>
        <ProductionDescription production={details.production} />
      </>}

      {details.victoryPoints !== undefined && <>
        <h3 css={sectionTitleCss}>{t('help.development.victoryPoints', 'Victory points')}</h3>
        <VictoryPointsDisplay victoryPoints={details.victoryPoints} />
      </>}

      <h3 css={sectionTitleCss}>{t('help.development.recyclingBonus', 'Recycling bonus')}</h3>
      <div css={iconRowCss}>
        <Picture src={resourceIcons[details.recyclingBonus]} css={inlineIconCss} />
      </div>
      <p css={explanationCss}>
        {t('help.development.recyclingBonus.description', 'Received when discarding this card during the Planning phase.')}
      </p>
    </>
  )
}

function CardActions({ itemIndex, closeDialog }: { itemIndex?: number; closeDialog: () => void }) {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const rules = useRules<MaterialRules>()!
  const legalMoves = useLegalMoves()
  const play = usePlay()

  if (itemIndex === undefined || playerId === undefined) return null

  const cardMoves = legalMoves.filter(
    (move): move is MaterialMove =>
      isMoveItemType(MaterialType.DevelopmentCard)(move) && move.itemIndex === itemIndex
  )

  const selectMove = cardMoves.find(
    (move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.DraftArea
  )
  const buildMove = cardMoves.find(
    (move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.ConstructionArea
  )
  const recycleMove = cardMoves.find(
    (move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.Discard
  )
  const constructMove = cardMoves.find(
    (move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.ConstructedDevelopments
  )

  // Find placeable cubes on this card (same logic as getLongClickMoves)
  const placeCubeMoves = getPlaceableCubeMoves(legalMoves, itemIndex, rules)

  const hasActions = selectMove || buildMove || recycleMove || constructMove || placeCubeMoves.length > 0
  if (!hasActions) return null

  return (
    <div css={actionsCss}>
      {selectMove && (
        <PlayMoveButton move={selectMove} onPlay={closeDialog}>
          {t('help.action.select', 'Select')}
        </PlayMoveButton>
      )}
      {buildMove && (
        <PlayMoveButton move={buildMove} onPlay={closeDialog}>
          {t('help.action.build', 'Slate for construction')}
        </PlayMoveButton>
      )}
      {constructMove && (
        <PlayMoveButton move={constructMove} onPlay={closeDialog}>
          {t('help.action.construct', 'Build')}
        </PlayMoveButton>
      )}
      {!constructMove && placeCubeMoves.length > 0 && (
        <PlayMoveButton css={placeButtonCss} move={placeCubeMoves[0]} onPlay={() => {
          for (let i = 1; i < placeCubeMoves.length; i++) play(placeCubeMoves[i])
          closeDialog()
        }}>
          {t('help.action.place', 'Place')}{' '}
          {placeCubeMoves.map((move, i) => (
            <Picture key={i} src={resourceIcons[rules.material(MaterialType.ResourceCube).getItem((move as MoveItem).itemIndex).id as Resource]} css={buttonIconCss} />
          ))}
        </PlayMoveButton>
      )}
      {recycleMove && (
        <PlayMoveButton move={recycleMove} onPlay={closeDialog}>
          {t('help.action.recycle', 'Recycle')}
        </PlayMoveButton>
      )}
    </div>
  )
}

function getPlaceableCubeMoves(legalMoves: MaterialMove[], cardIndex: number, rules: MaterialRules): MaterialMove[] {
  const moves = legalMoves.filter(
    (move): move is MoveItem =>
      isMoveItemType(MaterialType.ResourceCube)(move) &&
      move.location.type === LocationType.ConstructionCardCost &&
      move.location.parent === cardIndex &&
      rules.material(MaterialType.ResourceCube).getItem(move.itemIndex).id !== Resource.Krystallium
  )
  const itemUsage = new Map<number, number>()
  const usedSpaces = new Set<number>()
  const result: MaterialMove[] = []
  const sorted = [...moves].sort((a, b) => (a.location.x ?? 0) - (b.location.x ?? 0))
  for (const move of sorted) {
    const space = move.location.x ?? 0
    if (usedSpaces.has(space)) continue
    const used = itemUsage.get(move.itemIndex) ?? 0
    const available = rules.material(MaterialType.ResourceCube).getItem(move.itemIndex).quantity ?? 1
    if (used >= available) continue
    itemUsage.set(move.itemIndex, used + 1)
    usedSpaces.add(space)
    result.push(move)
  }
  return result
}

function CostIcons({ cost }: { cost: { [key in Resource | Character]?: number } }) {
  const items: { icon: string; round: boolean }[] = []
  const costOrder: (Resource | Character)[] = [
    Resource.Materials,
    Resource.Energy,
    Resource.Science,
    Resource.Gold,
    Resource.Exploration,
    Resource.Krystallium,
    Character.Financier,
    Character.General
  ]
  for (const key of costOrder) {
    const count = cost[key] ?? 0
    for (let i = 0; i < count; i++) {
      if (isCharacter(key)) {
        items.push({ icon: characterIcons[key], round: true })
      } else {
        items.push({ icon: resourceIcons[key], round: false })
      }
    }
  }
  return (
    <>
      {items.map((item, i) => (
        <Picture key={i} src={item.icon} css={item.round ? roundIconCss : inlineIconCss} />
      ))}
    </>
  )
}

function ProductionIcons({ production }: { production: Production }) {
  const { t } = useTranslation()
  if (isResource(production)) {
    return <Picture src={resourceIcons[production]} css={inlineIconCss} />
  }
  if (isProductionFactor(production)) {
    return (
      <>
        <Picture src={resourceIcons[production.resource]} css={inlineIconCss} />
        <span css={factorCss}>x</span>
        <Picture src={developmentTypeIcons[production.factor]} css={typeIconSmallCss} />
        <span css={factorLabelCss}>{getDevelopmentTypeName(t, production.factor)}</span>
      </>
    )
  }
  // Object mapping
  const icons: ReactElement[] = []
  const resourceOrder: (Resource | Character)[] = [
    Resource.Materials,
    Resource.Energy,
    Resource.Science,
    Resource.Gold,
    Resource.Exploration,
    Resource.Krystallium,
    Character.Financier,
    Character.General
  ]
  for (const key of resourceOrder) {
    const count = (production as any)[key] ?? 0
    for (let i = 0; i < count; i++) {
      if (isCharacter(key)) {
        icons.push(<Picture key={`${key}-${i}`} src={characterIcons[key]} css={roundIconCss} />)
      } else {
        icons.push(<Picture key={`${key}-${i}`} src={resourceIcons[key]} css={inlineIconCss} />)
      }
    }
  }
  return <>{icons}</>
}

function ProductionDescription({ production }: { production: Production }) {
  const { t } = useTranslation()
  if (isProductionFactor(production)) {
    const typeName = getDevelopmentTypeName(t, production.factor)
    return (
      <p css={explanationCss}>
        {t('help.development.production.factor', 'Produces 1 {resource} per {type} built.', {
          resource: getResourceName(t, production.resource),
          type: typeName
        })}
      </p>
    )
  }
  return null
}

function VictoryPointsDisplay({ victoryPoints }: { victoryPoints: VictoryPoints }) {
  const { t } = useTranslation()
  if (typeof victoryPoints === 'number') {
    return <div><strong>{victoryPoints}</strong> {t('help.development.vp', 'VP')}</div>
  }
  const combo = victoryPoints as ComboVictoryPoints
  const items = Array.isArray(combo.per) ? combo.per : [combo.per]
  return (
    <div css={iconRowCss}>
      <strong>{combo.quantity}</strong>
      <span css={factorCss}>x</span>
      {items.map((item) =>
        isCharacter(item)
          ? <Picture key={item} src={characterIcons[item]} css={roundIconCss} />
          : <Picture key={item} src={developmentTypeIcons[item]} css={typeIconSmallCss} />
      )}
      <span css={factorLabelCss}>
        {items.map((item) =>
          isCharacter(item)
            ? (item === Character.Financier ? t('help.character.financier', 'Financier') : t('help.character.general', 'General'))
            : getDevelopmentTypeName(t, item)
        ).join(' + ')}
      </span>
    </div>
  )
}

function getDevelopmentTypeName(t: (key: string, defaultValue: string) => string, type: DevelopmentType): string {
  switch (type) {
    case DevelopmentType.Structure:
      return t('help.type.structure', 'Structure')
    case DevelopmentType.Vehicle:
      return t('help.type.vehicle', 'Vehicle')
    case DevelopmentType.Research:
      return t('help.type.research', 'Research')
    case DevelopmentType.Project:
      return t('help.type.project', 'Project')
    case DevelopmentType.Discovery:
      return t('help.type.discovery', 'Discovery')
    case DevelopmentType.Memorial:
      return t('help.type.memorial', 'Memorial')
  }
}

function getResourceName(t: (key: string, defaultValue: string) => string, resource: Resource): string {
  switch (resource) {
    case Resource.Materials:
      return t('help.resource.materials', 'Materials')
    case Resource.Energy:
      return t('help.resource.energy', 'Energy')
    case Resource.Science:
      return t('help.resource.science', 'Science')
    case Resource.Gold:
      return t('help.resource.gold', 'Gold')
    case Resource.Exploration:
      return t('help.resource.exploration', 'Exploration')
    case Resource.Krystallium:
      return t('help.resource.krystallium', 'Krystallium')
  }
}

// --- Styles ---

const titleCss = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  border-bottom: 2px solid ${color};
  padding-bottom: 0.2em;
  margin: 0 !important;
`

const typeIconCss = css`
  height: 1.5em;
  width: auto;
  border-radius: 0.2em;
  display: block;
`

const subtitleCss = css`
  font-style: italic;
  color: #666;
  margin-top: 0.1em;
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

const sectionTitleCss = css`
  font-size: 1em;
  margin: 0.4em 0 0.1em;
`

const actionsCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin: 0.5em 0;
`

const placeButtonCss = css`
  display: inline-flex !important;
  align-items: center;
  gap: 0.15em;
`

const buttonIconCss = css`
  width: 1.2em;
  height: 1.2em;
  object-fit: contain;
  vertical-align: middle;
`
