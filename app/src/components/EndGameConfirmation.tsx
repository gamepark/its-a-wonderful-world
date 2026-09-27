/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { numberOfRounds } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldConstants'
import { Memory } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldMemory'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { hasKrystalliumOrCharacterProduction } from '@gamepark/its-a-wonderful-world/Production'
import { RuleId } from '@gamepark/its-a-wonderful-world/rules/RuleId'
import { Dialog, PlayMoveButton, ThemeButton, useLegalMove, usePlay, usePlayerId, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn, isMoveItemType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * True when validating now is the player's last action of the game while they could still build a card
 * (typically thanks to Krystallium or character tokens).
 * The last validation is the Krystallium production step, or the Exploration step for players who have no such production.
 */
export const useCanStillBuildBeforeGameEnd = (): boolean => {
  const rules = useRules<MaterialRules>()
  const playerId = usePlayerId<Empire>()
  const constructMove = useLegalMove(
    (move: MaterialMove) => isMoveItemType(MaterialType.DevelopmentCard)(move) && move.location.type === LocationType.ConstructedDevelopments
  )
  if (!rules || playerId === undefined || !constructMove) return false
  if ((rules.remind<number>(Memory.Round) ?? 1) < numberOfRounds) return false
  const ruleId = rules.game.rule?.id
  return (
    ruleId === RuleId.KrystalliumProduction ||
    (ruleId === RuleId.ExplorationProduction && !hasKrystalliumOrCharacterProduction(rules.game, playerId))
  )
}

export const useEndGameConfirmationText = () => {
  const { t } = useTranslation()
  return t('header.validate.confirm', 'You can still build a card. Are you sure you want to finish the game without building it?')
}

/**
 * Validation of a production step, asking for a confirmation when it would end the game while the player can still build a card.
 * The returned dialog must be rendered by the caller.
 */
export const useValidateWithConfirmation = () => {
  const endTurn = useLegalMove(isEndPlayerTurn)
  const play = usePlay()
  const needsConfirmation = useCanStillBuildBeforeGameEnd()
  const [showDialog, setShowDialog] = useState(false)
  const validate = () => {
    if (!endTurn) return
    if (needsConfirmation) setShowDialog(true)
    else play(endTurn)
  }
  const dialog = <EndGameConfirmationDialog open={showDialog && !!endTurn} endTurn={endTurn} close={() => setShowDialog(false)} />
  return { endTurn, validate, dialog }
}

type EndGameConfirmationDialogProps = {
  open: boolean
  endTurn?: MaterialMove
  close: () => void
}

const EndGameConfirmationDialog = ({ open, endTurn, close }: EndGameConfirmationDialogProps) => {
  const { t } = useTranslation()
  const text = useEndGameConfirmationText()
  return (
    <Dialog open={open} onBackdropClick={close} css={dialogCss}>
      <p>{text}</p>
      <div css={buttonsCss}>
        <ThemeButton onClick={close}>{t('Cancel', { ns: 'common' })}</ThemeButton>
        <PlayMoveButton move={endTurn} onPlay={close}>
          {t('Validate', { ns: 'common' })}
        </PlayMoveButton>
      </div>
    </Dialog>
  )
}

const dialogCss = css`
  display: flex;
  flex-direction: column;
  max-width: 90vw;
  padding: 1em 2em;
  font-size: calc(3em * var(--gp-scale));
  background-color: var(--gp-dialog-bg);
  color: var(--gp-dialog-color);
  border-radius: 1em;
  box-shadow: 0 0 0.2em black;
  font-family: var(--gp-font-family);
`

const buttonsCss = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3em;
`
