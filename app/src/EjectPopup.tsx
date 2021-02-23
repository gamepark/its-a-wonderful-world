import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Rules from '@gamepark/its-a-wonderful-world/Rules'
import {useEjection, useNow, useOptions} from '@gamepark/workshop'
import Player from '@gamepark/workshop/dist/Types/Player'
import {useTheme} from 'emotion-theming'
import moment from 'moment'
import React, {FunctionComponent, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import Theme, {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

type Props = {
  playerId: EmpireName
  players: Player<EmpireName>[]
  onClose: () => void
}

const EjectPopup: FunctionComponent<Props> = ({playerId, players, onClose}) => {
  const {t} = useTranslation()
  const now = useNow()
  const theme = useTheme<Theme>()
  const [awaitedPlayer, time] = players.filter(player => player.time?.playing)
    .map<[Player<EmpireName>, number]>(player => [player, player.time!.availableTime - now + Date.parse(player.time!.lastChange)])
    .sort(([, availableTimeA], [, availableTimeB]) => availableTimeA - availableTimeB)[0]
  useEffect(() => {
    if (players.find(player => player.id === playerId)?.time?.playing || !awaitedPlayer || time >= 0) {
      onClose()
    }
  }, [awaitedPlayer, onClose, time, playerId, players])
  const eject = useEjection()
  const maxExceedTime = useOptions()?.maxExceedTime || 0
  if (!awaitedPlayer)
    return null
  const awaitedPlayerName = awaitedPlayer.name || Rules.getPlayerName(awaitedPlayer.id, t)
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('{player} has exceeded their thinking time', {player: awaitedPlayerName})}</h2>
        {time > -maxExceedTime ?
          <p>{t('Beyond {duration} you will be allowed to eject them and continue the game.', {duration: moment.duration(maxExceedTime).humanize()})}</p>
          : <>
            <p>{t('If you don’t think they are coming back, you have the option of ejecting them from the game.', {duration: moment.duration(maxExceedTime).humanize()})}</p>
            <Button onClick={() => eject(awaitedPlayer.id)}>{t('Eject {player}', {player: awaitedPlayerName})}</Button>
          </>
        }
      </div>
    </div>
  )
}

export default EjectPopup