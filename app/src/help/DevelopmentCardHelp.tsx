/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Character, isCharacter } from '@gamepark/its-a-wonderful-world/material/Character'
import { CustomMoveType } from '@gamepark/its-a-wonderful-world/material/CustomMoveType'
import { DeckType } from '@gamepark/its-a-wonderful-world/material/DeckType'
import { Development, getDevelopmentDetails, warAndPeaceDevelopmentCardIds } from '@gamepark/its-a-wonderful-world/material/Development'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { isResource, Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { isProductionFactor, Production } from '@gamepark/its-a-wonderful-world/Production'
import { ConstructionRule } from '@gamepark/its-a-wonderful-world/rules/ConstructionRule'
import { ComboVictoryPoints, VictoryPoints } from '@gamepark/its-a-wonderful-world/Scoring'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialMove, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { characterIcons, corruptionIcon, developmentTypeIcons, resourceIcons } from '../panels/Images'
import { getDevelopmentTypeName, getResourceName } from './helpUtils'

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
    return <HiddenCardHelp item={item} />
  }

  const development = id.front
  const details = getDevelopmentDetails(development)

  const typeName = getDevelopmentTypeName(t, details.type)
  const color = developmentTypeColors[details.type]
  const copies = details.numberOfCopies ?? 1

  return (
    <>
      <h2 css={titleCss(color)}>
        {developmentTypeIcons[details.type] && <Picture src={developmentTypeIcons[details.type]} css={typeIconCss} />}
        {t(`card.${development}`)}
      </h2>
      <p css={subtitleCss}>
        {typeName}
        {copies > 1 && <> — {t('help.development.copies', '{copies, plural, one {# copy} other {# copies}}', { copies })}</>}
      </p>

      <CardActions itemIndex={itemIndex} closeDialog={closeDialog} />

      <h3 css={sectionTitleCss}>{t('help.development.cost', 'Construction cost')}</h3>
      <div css={iconRowCss}>
        <CostIcons cost={details.constructionCost} />
      </div>

      {details.constructionBonus && details.constructionBonus.length > 0 && (
        <>
          <h3 css={sectionTitleCss}>{t('help.development.constructionBonus', 'Construction bonus')}</h3>
          <div css={iconRowCss}>
            {details.constructionBonus.map((bonus, i) =>
              bonus === Resource.Krystallium ? (
                <Picture key={i} src={resourceIcons[Resource.Krystallium]} css={inlineIconCss} />
              ) : (
                <Picture key={i} src={characterIcons[bonus as Character]} css={roundIconCss} />
              )
            )}
          </div>
          <p css={explanationCss}>{t('help.development.constructionBonus.description', 'Received immediately when the Development is built.')}</p>
        </>
      )}

      {details.production && (
        <>
          <h3 css={sectionTitleCss}>{t('phase.production')}</h3>
          <div css={iconRowCss}>
            <ProductionIcons production={details.production} />
          </div>
          <ProductionDescription production={details.production} development={development} />
        </>
      )}

      {details.victoryPoints !== undefined && (
        <>
          <h3 css={sectionTitleCss}>{t('help.development.victoryPoints', 'Victory points')}</h3>
          <VictoryPointsDisplay victoryPoints={details.victoryPoints} />
        </>
      )}

      <h3 css={sectionTitleCss}>{t('help.development.recyclingBonus', 'Recycling bonus')}</h3>
      <div css={iconRowCss}>
        <Picture src={resourceIcons[details.recyclingBonus]} css={inlineIconCss} />
      </div>
      <p css={explanationCss}>{t('help.development.recyclingBonus.description', 'Received when discarding this card during the Planning phase.')}</p>
    </>
  )
}

function HiddenCardHelp({ item }: { item: MaterialHelpProps['item'] }) {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const locationType = item.location?.type
  const player = item.location?.player
  const playerName = usePlayerName(player)
  const back = (item.id as { back?: number } | undefined)?.back
  const playerCount = rules?.players.length ?? 2
  const hasAscension = (rules?.material(MaterialType.DevelopmentCard).location(LocationType.AscensionDeck).length ?? 0) > 0
    || rules?.material(MaterialType.DevelopmentCard).getItems().some(i => i.id?.back === DeckType.Ascension) === true

  if (locationType === LocationType.Deck) {
    const baseCards = !hasAscension
      ? (playerCount === 2 ? 10 : 7)
      : (playerCount === 2 ? 8 : playerCount === 7 ? 5 : 6)
    return (
      <>
        <h2 css={titleCss('#666')}>{t('help.deck.title', 'Development card deck')}</h2>
        <p>{t('help.deck.description', 'At the beginning of each round, {count} cards from this deck are dealt to each player.', { count: baseCards })}</p>
      </>
    )
  }

  if (locationType === LocationType.AscensionDeck || back === DeckType.Ascension) {
    const ascensionCards = playerCount === 2 ? 4 : (playerCount <= 4 ? 3 : 2)
    return (
      <>
        <h2 css={titleCss('#666')}>{t('help.deck.ascension.title', 'Corruption & Ascension card deck')}</h2>
        <p>
          {t(
            'help.deck.ascension.description',
            'At the beginning of each round, {count} cards from this deck are dealt to each player.',
            { count: ascensionCards }
          )}
        </p>
      </>
    )
  }

  if (locationType === LocationType.PlayerHand && player !== undefined) {
    return (
      <>
        <h2 css={titleCss('#666')}>{t('help.development.hidden.title', 'Development card')}</h2>
        <p>{t('help.hidden.hand', 'This card is in the hand of {player}.', { player: playerName })}</p>
      </>
    )
  }

  if (locationType === LocationType.DraftArea && player !== undefined) {
    return (
      <>
        <h2 css={titleCss('#666')}>{t('help.development.hidden.title', 'Development card')}</h2>
        <p>{t('help.hidden.draft', 'This card is in the draft area of {player}.', { player: playerName })}</p>
      </>
    )
  }

  return <h2 css={titleCss('#666')}>{t('help.development.hidden.title', 'Development card')}</h2>
}

function CardActions({ itemIndex, closeDialog }: { itemIndex?: number; closeDialog: () => void }) {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const rules = useRules<MaterialRules>()!
  const legalMoves = useLegalMoves()

  if (itemIndex === undefined || playerId === undefined) return null

  const cardMoves = legalMoves.filter((move): move is MaterialMove => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.itemIndex === itemIndex)

  const selectMove = cardMoves.find((move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.DraftArea)
  const buildMove = cardMoves.find((move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.ConstructionArea)
  const recycleMove = cardMoves.find((move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.Discard)
  const constructMove = cardMoves.find(
    (move) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.ConstructedDevelopments
  )

  // Find the custom move to place all resources on this card
  const placeAllMove = legalMoves.find((move) => isCustomMoveType(CustomMoveType.PlaceResources)(move) && move.data === itemIndex)

  // Compute the resources that would be placed by the PlaceResources custom move
  const constructionRule = rules.rulesStep as ConstructionRule | undefined
  const placedResources =
    placeAllMove && constructionRule?.getPlaceResourcesMoves
      ? constructionRule
        .getPlaceResourcesMoves(playerId, itemIndex)
        .map((move) => rules.material(MaterialType.ResourceCube).getItem((move as MoveItem).itemIndex).id as Resource)
      : []

  const hasActions = selectMove || buildMove || recycleMove || constructMove || placeAllMove
  if (!hasActions) return null

  return (
    <>
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
        {placeAllMove && (
          <PlayMoveButton css={placeButtonCss} move={placeAllMove} onPlay={closeDialog}>
            {t('help.action.place', 'Place')}{' '}
            {placedResources.map((resource, i) => (
              <Picture key={i} src={resourceIcons[resource]} css={buttonIconCss} />
            ))}
          </PlayMoveButton>
        )}
        {recycleMove && (
          <PlayMoveButton move={recycleMove} onPlay={closeDialog}>
            {t('help.action.recycle', 'Recycle')}
          </PlayMoveButton>
        )}
      </div>
      {placeAllMove && (
        <p css={hintCss}>
          <Trans
            i18nKey="help.action.place.hint"
            defaults="You can long-click on the card to place <resources/> at once."
            components={{
              resources: (
                <span css={hintResourcesCss}>
                  {placedResources.map((resource, i) => (
                    <Picture key={i} src={resourceIcons[resource]} css={hintIconCss} />
                  ))}
                </span>
              )
            }}
          />
        </p>
      )}
    </>
  )
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
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        if (isCharacter(key)) {
          icons.push(<Picture key={`${key}-${i}`} src={characterIcons[key]} css={roundIconCss} />)
        } else {
          icons.push(<Picture key={`${key}-${i}`} src={resourceIcons[key]} css={inlineIconCss} />)
        }
      }
    } else if (count < 0) {
      for (let i = 0; i < -count; i++) {
        icons.push(
          <span key={`${key}-corrupt-${i}`} css={corruptionWrapperCss}>
            <Picture src={resourceIcons[key as Resource]} css={inlineIconCss} />
            <Picture src={corruptionIcon} css={corruptionOverlayCss} />
          </span>
        )
      }
    }
  }
  return <>{icons}</>
}

function ProductionDescription({ production, development }: { production: Production; development: Development }) {
  const { t } = useTranslation()
  const isWarOrPeace = warAndPeaceDevelopmentCardIds.includes(development) && development !== Development.SecretForces
  const hasCorruption =
    !isResource(production) &&
    !isProductionFactor(production) &&
    Object.entries(production as { [key in Resource | Character]?: number }).some(([, v]) => v !== undefined && v < 0)

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
          {t(
            'help.development.production.corruption',
            'Certain Corruption & Ascension cards produce Corruption. If you have any of these in your Empire, subtract the corrupted resources from your total production.'
          )}
        </p>
      )}
      {isWarOrPeace && (
        <p css={explanationCss}>
          {t(
            'help.development.production.bonus',
            'War or Peace campaign bonus cards produce Krystallium and character tokens during an additional production phase, after the Exploration production.'
          )}
        </p>
      )}
    </>
  )
}

function VictoryPointsDisplay({ victoryPoints }: { victoryPoints: VictoryPoints }) {
  const { t } = useTranslation()
  if (typeof victoryPoints === 'number') {
    return (
      <div>
        <strong>{victoryPoints}</strong> {t('help.development.victoryPoints', 'Victory points')}
      </div>
    )
  }
  const combo = victoryPoints as ComboVictoryPoints
  const items = Array.isArray(combo.per) ? combo.per : [combo.per]
  return (
    <div css={iconRowCss}>
      <strong>{combo.quantity}</strong>
      <span css={factorCss}>x</span>
      {items.map((item) =>
        isCharacter(item) ? (
          <Picture key={item} src={characterIcons[item]} css={roundIconCss} />
        ) : (
          <Picture key={item} src={developmentTypeIcons[item]} css={typeIconSmallCss} />
        )
      )}
      <span css={factorLabelCss}>
        {items
          .map((item) => (isCharacter(item) ? (item === Character.Financier ? t('character.financier') : t('character.general')) : getDevelopmentTypeName(t, item)))
          .join(' + ')}
      </span>
    </div>
  )
}


// --- Styles ---

const titleCss = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  border-bottom: 0.06em solid ${color};
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

const hintCss = css`
  font-size: 0.85em;
  color: #777;
  font-style: italic;
  margin: 0.3em 0 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.1em;
`

const hintResourcesCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.1em;
  vertical-align: middle;
  margin-left: 0.2em;
`

const hintIconCss = css`
  width: 1em;
  height: 1.2em;
  object-fit: contain;
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
