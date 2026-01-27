import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource.ts'
import { HeaderText, PlayMoveButton, useLegalMove, usePlayerId, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn, MaterialRules } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

export const PlanningHeader = () => {
  const rules = useRules<MaterialRules>()!
  const playerId = usePlayerId()
  const endTurn = useLegalMove(isEndPlayerTurn)

  // For player/players case, use a single translation key
  if (playerId === undefined || !rules.activePlayers.includes(playerId)) {
    return (
      <HeaderText
        code="planning"
        defaults={{
          you: 'You must slate for construction or recycle each card in your draft area',
          player: '{player} has to do their planning',
          players: 'Players have to do their planning'
        }}
      />
    )
  }

  // "you" case: differentiate based on state
  const draftAreaCards = rules.material(MaterialType.DevelopmentCard).location(LocationType.DraftArea).player(playerId).length

  const availableResources = rules.material(MaterialType.ResourceCube).location(LocationType.AvailableResources).player(playerId).length

  if (draftAreaCards > 0) {
    return <Trans i18nKey="header.planning.you" defaults="You must slate for construction or recycle each card in your draft area" />
  }

  if (availableResources > 0) {
    return <Trans i18nKey="header.planning.place" defaults="Place your resources on your developments under construction or your Empire card" />
  }

  return (
    <Trans
      i18nKey="header.validate.produce"
      defaults="Click on <validate>Validate</validate> if you are ready to proceed to materials production"
      values={{ resource: Resource.Materials }}
      components={{ validate: <PlayMoveButton move={endTurn} /> }}
    />
  )
}
