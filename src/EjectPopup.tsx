import {useEjection} from '@interlude-games/workshop'
import Player from '@interlude-games/workshop/dist/Types/Player'
import moment from 'moment'
import React, {FunctionComponent, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import {popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupStyle, showPopupStyle} from './util/Styles'
import Theme, {LightTheme} from './Theme'
import {useTheme} from 'emotion-theming'

type Props = {
  playerId: EmpireName
  players: Player<EmpireName>[]
  now: number
  onClose: () => void
}

const maxDuration = 3 * 60 * 1000

const EjectPopup: FunctionComponent<Props> = ({playerId, players, now, onClose}) => {
  const {t} = useTranslation()
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
      <div css={[popupStyle,showPopupStyle(50,50,70),theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <h2>{t('{player} a dépassé son temps de réflexion', {player: awaitedPlayerName})}</h2>
        {time > -maxDuration ?
          <p>{t('Au dela de {duration} de dépassement vous pourrez l’expulser et poursuivre la partie.', {duration: moment.duration(maxDuration).humanize()})}</p>
          : <>
            <p>{t('Si vous pensez qu’il·elle ne reviendra pas, vous avez la possibilité de l’expulser de la partie.', {duration: moment.duration(maxDuration).humanize()})}</p>
            <button onClick={() => eject(awaitedPlayer.id)}>{t('Expulser {player}', {player: awaitedPlayerName})}</button>
          </>
        }
      </div>
    </div>
  )
}

export default EjectPopup