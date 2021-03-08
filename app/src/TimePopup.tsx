/** @jsxImportSource @emotion/react */
import {css, Theme, useTheme} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Rules'
import {usePlayers} from '@gamepark/react-client'
import {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {LightTheme} from './Theme'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'
import {humanize} from './util/TimeUtil'

type Props = {
  onClose: () => void
}

const TimePopup: FunctionComponent<Props> = ({onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const players = usePlayers<EmpireName>({withTimeUpdate: true})
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 80%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>{t('Player')}</th>
              <th>{t('Maximum down time')}</th>
              <th>{t('Total down time')}</th>
              <th>{t('Maximum thinking time')}</th>
              <th>{t('Total thinking time')}</th>
              {players.length > 2 &&
              <>
                <th>{t('Made other players wait')}</th>
                <th>{t('Made others wait (weighted by the number of awaited players)')}</th>
              </>
              }
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.name || getPlayerName(player.id, t)}</td>
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