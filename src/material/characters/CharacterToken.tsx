import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../Images'
import Character from './Character'

type Props = { character: Character } & React.HTMLAttributes<HTMLImageElement>

const CharacterToken: FunctionComponent<Props> = ({character, ...props}) => {
  const {t} = useTranslation()
  return <img alt={getDescription(t, character)} src={images[character]} css={style} {...props}/>
}

const style = css`
  border-radius: 100%;
  box-shadow: 0 0 5px black;
`

export const images = {
  [Character.Financier]: Images.financier,
  [Character.General]: Images.general
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