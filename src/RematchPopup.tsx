import {css, keyframes} from '@emotion/core'
import {faHourglassEnd} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {usePlayerId, usePlayers} from '@interlude-games/workshop'
import RematchOffer from '@interlude-games/workshop/dist/Types/RematchOffer'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'
import Theme, {LightTheme} from './Theme'
import {popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupStyle, showPopupStyle} from './util/Styles'

type Props = {
  rematchOffer?: RematchOffer<EmpireName>
  onClose: () => void
}

const RematchPopup: FunctionComponent<Props> = ({rematchOffer, onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const playerId = usePlayerId<EmpireName>()
  const players = usePlayers<EmpireName>()
  const getPlayerName = (empire: EmpireName) => players.find(p => p.id === empire)?.name || getEmpireName(t, empire)
  return (
    <div css={[popupFixedBackgroundStyle, !rematchOffer && css`display: none`]} onClick={onClose}>
      <div css={[popupStyle, showPopupStyle(50, 50, 60), theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        {rematchOffer && (
          playerId === rematchOffer.playerId ? (
            rematchOffer.link ?
              <>
                <h2>{t('Vous avez proposé une revanche')}</h2>
                <p>{t('Votre proposition a été transmise aux autres joueurs')}</p>
                <p><a href={rematchOffer.link}>{t('Voir la nouvelle partie')}</a></p>
              </>
              :
              <>
                <h2>{t('Proposition de revanche')}</h2>
                <p>{t('Veuillez patienter...')}</p>
                <FontAwesomeIcon css={spinnerStyle} icon={faHourglassEnd}/>
              </>
          ) : (
            rematchOffer.link &&
            <>
              <h2>{t('{player} vous propose une revanche !', {player: getPlayerName(rematchOffer.playerId)})}</h2>
              <p>{t('Cliquez sur le lien ci-dessous pour accéder à la nouvelle partie :')}</p>
              <p><a href={rematchOffer.link}>{t('Voir la nouvelle partie')}</a></p>
            </>
          )
        )}
      </div>
    </div>
  )
}

const rotate = keyframes`
  from {transform: none}
  to {transform: rotate(180deg)}
`

const spinnerStyle = css`
  font-size: 2em;
  animation: ${rotate} 1s ease-in-out infinite;
  margin-bottom: 0.5em;
`

export default RematchPopup