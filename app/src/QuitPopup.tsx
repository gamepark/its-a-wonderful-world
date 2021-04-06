/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useGiveUp} from '@gamepark/react-client'
import {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

const QuitPopup: FunctionComponent<{ onClose: () => void }> = ({onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const [giveUp] = useGiveUp()
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('Leave the game')}</h2>
        <p>{t('When you leave the game, you will be eliminated and the other players will finish without you.')}</p>
        <p>{t('Out of respect for other players, only abandon the game in case of force majeure.')}</p>
        <Button onClick={() => {
          giveUp()
          onClose()
        }}>
          {t('Leave the game')}
        </Button>
      </div>
    </div>
  )
}

export default QuitPopup