/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import {ejectPlayerAction, useOpponentWithMaxTime} from '@gamepark/react-client'
import GamePageState from '@gamepark/react-client/dist/Types/GamePageState'
import moment from 'moment'
import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

type Props = { onClose: () => void }

export default function EjectPopup({onClose}: Props) {
  const {t} = useTranslation()
  const maxExceedTime = useSelector((state: GamePageState) => state.options?.maxExceedTime ?? 60000)
  const opponentWithNegativeTime = useOpponentWithMaxTime(0)
  const opponentThatCanBeEjected = useOpponentWithMaxTime()
  const dispatch = useDispatch()
  const theme = useTheme()
  useEffect(() => {
    if (!opponentWithNegativeTime) {
      onClose()
    }
  }, [opponentWithNegativeTime])
  if (!opponentWithNegativeTime) return null
  const opponentName = opponentWithNegativeTime.name || getPlayerName(opponentWithNegativeTime.id, t)
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('eject.dialog.p1', {player: opponentName})}</h2>
        {!opponentThatCanBeEjected ?
          <p>{t('eject.dialog.p2', {duration: moment.duration(maxExceedTime).humanize()})}</p>
          : <>
            <p>{t('eject.dialog.p3')}</p>
            <Button onClick={() => dispatch(ejectPlayerAction(opponentThatCanBeEjected.id))}>{t('Eject {player}', {player: opponentName})}</Button>
          </>
        }
      </div>
    </div>
  )
}