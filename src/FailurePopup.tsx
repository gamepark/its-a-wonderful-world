import {css} from '@emotion/core'
import {Failure} from '@interlude-games/workshop'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {Trans, useTranslation} from 'react-i18next'

const FailurePopup: FunctionComponent<{ failures: string[], clearFailures: () => {} }> = ({failures, clearFailures}) => {
  const {t} = useTranslation()
  const description = failuresDescription[failures[0]] || fallbackDescription(failures[0])
  return (
    <div css={style} onClick={clearFailures}>
      <div>
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
    title: (t: TFunction) => t('Coup non autorisé !'),
    text: (t: TFunction) => t('Vous devez jouer le coup prévu par le tutoriel')
  }
}

const fallbackDescription = (failure: string) => ({
  title: (t: TFunction) => t('Erreur inconnue :'),
  text: () => failure
})

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
    border-radius: 1em;
    & > h2 {
      font-size: 5em;
    }
    & > p {
      font-size: 4em;
    }
  }
`

export default FailurePopup