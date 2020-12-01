import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useLeaveGame} from '@gamepark/workshop'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Theme, {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupFixedBackgroundStyle, popupLightStyle, popupPosition, popupStyle} from './util/Styles'

const QuitPopup: FunctionComponent<{ onClose: () => void }> = ({onClose}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const leaveGame = useLeaveGame()
  return (
    <div css={popupFixedBackgroundStyle} onClick={onClose}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={onClose}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('Quitter la partie')}</h2>
        <p>{t('En quittant la partie, vous serez éliminé et les autres joueurs termineront sans vous.')}</p>
        <p>{t('Par respect envers les autres joueurs, n’abandonnez la partie qu’en cas de force majeure.')}</p>
        <Button onClick={() => {
          leaveGame()
          onClose()
        }}>
          {t('Quitter la partie')}
        </Button>
      </div>
    </div>
  )
}

export default QuitPopup