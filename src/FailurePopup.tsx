import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Failure} from '@interlude-games/workshop'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import Theme, {LightTheme} from './Theme'
import {closePopupStyle, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupPosition, popupStyle, showPopupOverlayStyle} from './util/Styles'

const FailurePopup: FunctionComponent<{ failures: string[], clearFailures: () => {} }> = ({failures, clearFailures}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const description = failuresDescription[failures[0]] || fallbackDescription(failures[0])
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={clearFailures}>
      <div css={[popupStyle, popupPosition, css`width: 70%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={clearFailures}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{description.title(t)}</h2>
        <p>{description.text(t)}</p>
        {failures[0] === Failure.MOVE_FORBIDDEN && <p>
          <Trans defaults="Si le problème persiste, vous pouvez <0>rafraîchir la partie</0>"
                 components={[<button onClick={() => window.location.reload()}>rafraîchir la partie</button>]}/>
        </p>}
      </div>
    </div>
  )
}

const failuresDescription = {
  [Failure.NETWORK]: {
    title: (t: TFunction) => t('Oups...'),
    text: (t: TFunction) => t('Une action n’a pas pu aboutir et a été annulée. Êtes-vous toujours connecté à Internet ?')
  },
  [Failure.MOVE_FORBIDDEN]: {
    title: (t: TFunction) => t('Coup non autorisé !'),
    text: (t: TFunction) => t('L’action que vous avez jouée n’est pas autorisée.')
  },
  [Failure.UNDO_FORBIDDEN]: {
    title: (t: TFunction) => t('Trop tard !'),
    text: (t: TFunction) => t('Les autres joueurs ont déjà joué, votre coup n’a pas pu être annulé.')
  },
  [Failure.TUTORIAL_MOVE_EXPECTED]: {
    title: (t: TFunction) => t('Coup non prévu dans le tutoriel'),
    text: (t: TFunction) => t('Promis, vous serez bientôt libres de vos choix ! Nous allons vous réafficher la dernière information...')
  }
}

const fallbackDescription = (failure: string) => ({
  title: (t: TFunction) => t('Erreur inconnue :'),
  text: () => failure
})

const style = css`
  background: rgba(0, 0, 0, 0.5);
`

export default FailurePopup