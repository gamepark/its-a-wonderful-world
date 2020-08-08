import {css, keyframes} from '@emotion/core'
import {faHourglassEnd} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {usePlayerId, usePlayers} from '@interlude-games/workshop'
import RematchOffer from '@interlude-games/workshop/dist/Types/RematchOffer'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {getEmpireName} from './material/empires/EmpireCard'
import EmpireName from './material/empires/EmpireName'

type Props = {
  rematchOffer?: RematchOffer<EmpireName>
  onClose: () => void
}

const RematchPopup: FunctionComponent<Props> = ({rematchOffer, onClose}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const players = usePlayers<EmpireName>()
  const getPlayerName = (empire: EmpireName) => players.find(p => p.id === empire)?.name || getEmpireName(t, empire)
  return (
    <div css={[style, !rematchOffer && css`display: none`]} onClick={onClose}>
      {rematchOffer && (
        playerId === rematchOffer.playerId ? (
          rematchOffer.link ?
            <div css={content}>
              <h2>{t('Vous avez proposé une revanche')}</h2>
              <p>{t('Votre proposition a été transmise aux autres joueurs')}</p>
              <p><a href={rematchOffer.link}>{t('Voir la nouvelle partie')}</a></p>
            </div>
            :
            <div css={content}>
              <h2>{t('Proposition de revanche')}</h2>
              <p>{t('Veuillez patienter...')}</p>
              <FontAwesomeIcon css={spinnerStyle} icon={faHourglassEnd}/>
            </div>
        ) : (
          rematchOffer.link &&
          <div css={content}>
            <h2>{t('{player} vous propose une revanche !', {player: getPlayerName(rematchOffer.playerId)})}</h2>
            <p>{t('Cliquez sur le lien ci-dessous pour accéder à la nouvelle partie :')}</p>
            <p><a href={rematchOffer.link}>{t('Voir la nouvelle partie')}</a></p>
          </div>
        )
      )}
    </div>
  )
}

const style = css`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`

const content = css`
  position: absolute;
  background-color: white;
  text-align: center;
  max-width: 80%;
  width: 500px;
  max-height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1vh;
`

const rotate = keyframes`
  from {transform: none}
  to {transform: rotate(180deg)}
`

const spinnerStyle = css`
  font-size: 5vh;
  animation: ${rotate} 1s ease-in-out infinite;
  margin-bottom: 1vh;
`

export default RematchPopup