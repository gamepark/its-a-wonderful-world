import {css} from '@emotion/core'
import {usePlayers} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import {humanize} from './util/TimeUtil'
import {useTheme} from 'emotion-theming'
import Theme, {LightTheme} from './Theme'
import {popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupStyle, showPopupStyle} from './util/Styles'

type Props = {
  onClose: () => void
}

const TimePopup: FunctionComponent<Props> = ({onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const players = usePlayers<EmpireName>({withTimeUpdate: true})
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle,showPopupStyle(50,50,80),theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
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

const tableStyle = (theme: Theme) => css`
  margin: 1em;
  border-collapse: collapse;
  font-size: 3em;
  tbody tr {
    border-top: 1px solid ${theme.color === LightTheme ? '#082b2b' : '#d4f7f7'};
  }
  td {
    min-width: 2.5em;
  }
  th, td {
    min-width: 3.5em;
    padding: 0.35em;
    text-align: left;
    &:not(:first-of-type) {
      border-left: 0.1em solid ${theme.color === LightTheme ? '#082b2b' : '#d4f7f7'};
    }
  }
`

export default TimePopup