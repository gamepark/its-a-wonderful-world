import {css} from '@emotion/core'
import {usePlayers} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import {humanize} from './util/TimeUtil'

type Props = {
  onClose: () => void
}

const TimePopup: FunctionComponent<Props> = ({onClose}) => {
  const {t} = useTranslation()
  const players = usePlayers<EmpireName>({withTimeUpdate: true})
  return (
    <div css={[style]} onClick={onClose}>
      <div css={content}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>{t('Joueur')}</th>
              <th>{t('Temps d’attente maximum')}</th>
              <th>{t('Temps d’attente total')}</th>
              <th>{t('Temps de réflexion maximum')}</th>
              <th>{t('Temps de réflexion total')}</th>
              {players.length > 2 &&
              <>
                <th>{t('A fait attendre les autres joueurs')}</th>
                <th>{t('A fait attendre les autres (pondéré par le nombre de joueurs attendus)')}</th>
              </>
              }
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.name || getEmpireName(t, player.id)}</td>
                <td>{player.time && humanize(player.time.highestDownTime)}</td>
                <td>{player.time && humanize(player.time.cumulatedDownTime)}</td>
                <td>{player.time && humanize(player.time.highestPlayTime)}</td>
                <td>{player.time && humanize(player.time.cumulatedPlayTime)}</td>
                {players.length > 2 &&
                <>
                  <td>{player.time && humanize(player.time.cumulatedWaitForMeTime)}</td>
                  <td>{player.time && humanize(player.time.weightedWaitForMeTime)}</td>
                </>
                }
              </tr>
            ))}
          </tbody>
        </table>
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
  border-radius: 1vh;
`

const tableStyle = css`
  margin: 1vh;
  border-collapse: collapse;
  font-size: 3vh;
  tbody tr {
    border-top: 1px solid black;
  }
  td {
    min-width: 7vh;
  }
  th, td {
    min-width: 10vw;
    padding: 1vh;
    text-align: left;
    &:not(:first-of-type) {
      border-left: 1px solid black;
    }
  }
`

export default TimePopup