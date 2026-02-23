import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { numberOfRounds } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldConstants'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { hasKrystalliumOrCharacterProduction } from '@gamepark/its-a-wonderful-world/Production'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { HeaderText, MaterialComponent, PlayMoveButton, useLegalMove, useLegalMoves, usePlayerId, useRules } from '@gamepark/react-game'
import { isCreateItem, isEndPlayerTurn, MaterialRules } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

const characterIconCss = css`
  display: inline-block;
  font-size: 0.4em;
  position: relative;
  top: 0.1em;
`

const ruleToResource: Record<number, Resource> = {
  [RuleId.ProductionMaterials]: Resource.Materials,
  [RuleId.ProductionEnergy]: Resource.Energy,
  [RuleId.ProductionScience]: Resource.Science,
  [RuleId.ProductionGold]: Resource.Gold,
  [RuleId.ProductionExploration]: Resource.Exploration,
  [RuleId.ProductionKrystallium]: Resource.Krystallium
}

export const ProductionHeader = () => {
  const rules = useRules<MaterialRules>()!
  const playerId = usePlayerId()
  const endTurn = useLegalMove(isEndPlayerTurn)
  const legalMoves = useLegalMoves()

  // For player/players case, use a single translation key
  if (playerId === undefined || !rules.activePlayers.includes(playerId)) {
    return (
      <HeaderText
        code="production"
        defaults={{
          you: 'Place the resources produced on your developments under construction or your Empire card',
          player: '{player} must use the resources produced',
          players: 'Players must use the resources produced'
        }}
      />
    )
  }

  // "you" case: differentiate based on state
  const needsToChooseCharacter = rules.remind<boolean>(Memory.ScienceBonus, playerId as Empire)

  if (needsToChooseCharacter) {
    const takeFinancier = legalMoves.find((move) => isCreateItem(move) && move.itemType === MaterialType.CharacterToken && move.item.id === Character.Financier)
    const takeGeneral = legalMoves.find((move) => isCreateItem(move) && move.itemType === MaterialType.CharacterToken && move.item.id === Character.General)
    return (
      <Trans
        i18nKey="header.bonus.choice"
        defaults="Supremacy bonus: <takeFinancier>take <financier/></takeFinancier> or <takeGeneral>take <general/></takeGeneral>"
        components={{
          takeFinancier: <PlayMoveButton move={takeFinancier} />,
          financier: <MaterialComponent type={MaterialType.CharacterToken} itemId={Character.Financier} css={characterIconCss} />,
          takeGeneral: <PlayMoveButton move={takeGeneral} />,
          general: <MaterialComponent type={MaterialType.CharacterToken} itemId={Character.General} css={characterIconCss} />
        }}
      />
    )
  }

  const availableResources = rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(playerId).length

  if (availableResources > 0) {
    return <Trans i18nKey="header.production.you" defaults="Place the resources produced on your developments under construction or your Empire card" />
  }

  const ruleId = rules.game.rule?.id as RuleId
  const resource = ruleToResource[ruleId] ?? Resource.Materials

  const hasKrystalliumProduction = ruleId === RuleId.ProductionExploration && hasKrystalliumOrCharacterProduction(rules.game, playerId as Empire)

  if (resource < Resource.Exploration || hasKrystalliumProduction) {
    return (
      <Trans
        i18nKey="header.validate.produce"
        defaults="Click on <validate>Validate</validate> if you are ready to proceed to {resource} production"
        values={{ resource: resource + 1 }}
        components={{ validate: <PlayMoveButton move={endTurn} /> }}
      />
    )
  }

  const round = rules.remind<number>(Memory.Round) ?? 1
  const isLastRound = round >= numberOfRounds

  if (isLastRound) {
    return (
      <Trans
        i18nKey="header.validate.scoring"
        defaults="Click on <validate>Validate</validate> to proceed to the calculation of the scores"
        components={{ validate: <PlayMoveButton move={endTurn} /> }}
      />
    )
  }

  return (
    <Trans
      i18nKey="header.validate.round"
      defaults="Click on <validate>Validate</validate> to proceed to the next round"
      components={{ validate: <PlayMoveButton move={endTurn} /> }}
    />
  )
}
