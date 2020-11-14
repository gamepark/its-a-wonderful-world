import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEjection, useNow} from '@gamepark/workshop'
import Player from '@gamepark/workshop/dist/Types/Player'
import {useTheme} from 'emotion-theming'
import moment from 'moment'
import React, {FunctionComponent, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import Theme, {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

type Props = {
  playerId: EmpireName
  players: Player<EmpireName>[]
  onClose: () => void
}

const maxDuration = 3 * 60 * 1000

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
  if (!awaitedPlayer)
    return null
  const awaitedPlayerName = awaitedPlayer.name || getEmpireName(t, awaitedPlayer.id)
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('{player} a dépassé son temps de réflexion', {player: awaitedPlayerName})}</h2>
        {time > -maxDuration ?
          <p>{t('Au dela de {duration} de dépassement vous pourrez l’expulser et poursuivre la partie.', {duration: moment.duration(maxDuration).humanize()})}</p>
          : <>
            <p>{t('Si vous pensez qu’il·elle ne reviendra pas, vous avez la possibilité de l’expulser de la partie.', {duration: moment.duration(maxDuration).humanize()})}</p>
            <Button onClick={() => eject(awaitedPlayer.id)}>{t('Expulser {player}', {player: awaitedPlayerName})}</Button>
          </>
        }
      </div>
    </div>
  )
}

export default EjectPopup