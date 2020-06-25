import {css} from '@emotion/core'
import {Failure} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'

const FailurePopup: FunctionComponent<{ failures: string[], clearFailures: () => {} }> = ({failures, clearFailures}) => {
  const {t} = useTranslation()
  return (
    <div css={style} onClick={clearFailures}>
      {failures.some(failure => failure === Failure.NETWORK) ?
        <div>
          <h2>{t('Oups...')}</h2>
          <p>{t('Une action n’a pas pu aboutir et a été annulée. Êtes-vous toujours connecté à Internet ?')}</p>
        </div>
        : failures.some(failure => failure === Failure.UNDO_FORBIDDEN) ?
          <div>
            <h2>{t('Trop tard !')}</h2>
            <p>{t('Les autres joueurs ont déjà joué, votre coup n’a pas pu être annulé.')}</p>
          </div>
          :
          <div>
            <h2>{t('Erreur inconnue :')}</h2>
            <p>{failures[0]}</p>
          </div>
      }
    </div>
  )
}

const style = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  & > div {
    position: absolute;
    background-color: white;
    text-align: center;
    max-width: 80%;
    width: 500px;
    max-height: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1vh;
  }
`

export default FailurePopup