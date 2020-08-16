import {css} from '@emotion/core'
import {useEjection} from '@interlude-games/workshop'
import Player from '@interlude-games/workshop/dist/Types/Player'
import moment from 'moment'
import React, {FunctionComponent, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'

type Props = {
  playerId: EmpireName
  players: Player<EmpireName>[]
  now: number
  onClose: () => void
}

const maxDuration = 3 * 60 * 1000

const EjectPopup: FunctionComponent<Props> = ({playerId, players, now, onClose}) => {
  const {t} = useTranslation()
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
    <div css={[style]} onClick={onClose}>
      <div css={content}>
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

const style = css`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`

const content = css`
  position: absolute;
  background-color: white;
  text-align: center;
  max-width: 80%;
  max-height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1em;
  padding: 1em;
  & > h2 {
    margin: 0 0 1em;
  }
`

export default EjectPopup