import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../Images'
import Character from '@gamepark/its-a-wonderful-world/material/Character'

type Props = { character: Character } & React.HTMLAttributes<HTMLImageElement>

const CharacterToken: FunctionComponent<Props> = ({character, ...props}) => {
  const {t} = useTranslation()
  return <img alt={getDescription(t, character)} src={images[character]} css={style} draggable={false} {...props}/>
}

const style = css`
  border-radius: 100%;
  box-shadow: 0 0 5px black;
`

export const images = {
  [Character.Financier]: Images.financier,
  [Character.General]: Images.general
}

export function getDescription(t: TFunction, character: Character) {
  switch (character) {
    case Character.Financier:
      return t('Financier token')
    case Character.General:
      return t('General token')
  }
}

export default CharacterToken