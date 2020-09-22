import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Theme, {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupPosition, popupStyle, showPopupOverlayStyle} from './util/Styles'

const ConfirmPopup: FunctionComponent<{ cancel: () => void, confirm: () => void }> = ({cancel, confirm}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle, style]}>
      <div css={[popupStyle, popupPosition, css`width: 50%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={cancel}><FontAwesomeIcon icon={faTimes}/></div>
        <p>{t('Vous pouvez encore construire une carte. Êtes-vous sûr de vouloir finir la partie sans la construire ?')}</p>
        <Button css={buttonStyle} onClick={cancel}>{t('Annuler')}</Button>
        <Button css={buttonStyle} onClick={confirm}>{t('Confirmer')}</Button>
      </div>
    </div>
  )
}

const style = css`
  background: rgba(0, 0, 0, 0.5);
`

const buttonStyle = css`
  margin-right: 1em;
`

export default ConfirmPopup