import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from './Character'
import Financier from './financier.png'
import General from './general.png'

type Props = { character: Character } & React.HTMLAttributes<HTMLImageElement>

const CharacterToken: FunctionComponent<Props> = ({character, ...props}) => {
  const {t} = useTranslation()
  return <img alt={getDescription(t, character)} src={images[character]} css={style} {...props}/>
}

const style = css`
  filter: drop-shadow(0 0 5px black);
`

export const images = {
  [Character.General]: General,
  [Character.Financier]: Financier
}

function getDescription(t: TFunction, character: Character) {
  switch (character) {
    case Character.Financier:
      return t('Un jeton Financier')
    case Character.General:
      return t('Un jeton Général')
  }
}

export default CharacterToken