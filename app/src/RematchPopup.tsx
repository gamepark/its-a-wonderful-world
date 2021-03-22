/** @jsxImportSource @emotion/react */
import {css, keyframes, useTheme} from '@emotion/react'
import {faHourglassEnd, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import {usePlayerId, usePlayers} from '@gamepark/react-client'
import RematchOffer from '@gamepark/react-client/dist/Types/RematchOffer'
import {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

type Props = {
  rematchOffer?: RematchOffer<EmpireName>
  onClose: () => void
}

const RematchPopup: FunctionComponent<Props> = ({rematchOffer, onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const playerId = usePlayerId<EmpireName>()
  const players = usePlayers<EmpireName>()
  const getName = (empire: EmpireName) => players.find(p => p.id === empire)?.name || getPlayerName(empire, t)
  return (
    <div css={[popupFixedBackgroundStyle, !rematchOffer && css`display: none`]} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 60%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        {rematchOffer && (
          playerId === rematchOffer.playerId ? (
            rematchOffer.link ?
              <>
                <h2>{t('You offered a friendly rematch')}</h2>
                <p>{t('Your offer was sent to the other players')}</p>
                <Button onClick={() => window.location.href = rematchOffer.link!}>{t('See the new game')}</Button>
              </>
              :
              <>
                <h2>{t('Rematch offer')}</h2>
                <p>{t('Please stand by…')}</p>
                <FontAwesomeIcon css={spinnerStyle} icon={faHourglassEnd}/>
              </>
          ) : (
            rematchOffer.link &&
            <>
              <h2>{t('{player} offers a friendly rematch!', {player: getName(rematchOffer.playerId)})}</h2>
              <p>{t('Click the following link to go to the new game:')}</p>
              <Button onClick={() => window.location.href = rematchOffer.link!}>{t('See the new game')}</Button>
            </>
          )
        )}
      </div>
    </div>
  )
}

const rotate = keyframes`
  from {
    transform: none
  }
  to {
    transform: rotate(180deg)
  }
`

const spinnerStyle = css`
  font-size: 2em;
  animation: ${rotate} 1s ease-in-out infinite;
  margin-bottom: 0.5em;
`

export default RematchPopup