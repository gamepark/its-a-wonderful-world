/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTranslation} from 'react-i18next'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupPosition, popupStyle, showPopupOverlayStyle} from './util/Styles'

type Props = { cancel: () => void, confirm: () => void }

export default function ConfirmPopup({cancel, confirm}: Props) {
  const {t} = useTranslation()
  const theme = useTheme()
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle]}>
      <div css={[popupStyle, popupPosition, css`width: 50%`, theme.light ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={cancel}><FontAwesomeIcon icon={faTimes}/></div>
        <p>{t('You can still build a card. Are you sure you want to finish the game without building it?')}</p>
        <Button css={buttonStyle} onClick={cancel}>{t('Cancel')}</Button>
        <Button css={buttonStyle} onClick={confirm}>{t('Confirm')}</Button>
      </div>
    </div>
  )
}

const buttonStyle = css`
  margin-right: 1em;
`