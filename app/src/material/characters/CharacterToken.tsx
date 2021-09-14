/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import {Picture, PictureAttributes} from '@gamepark/react-components'
import {TFunction} from 'i18next'
import {useTranslation} from 'react-i18next'
import Images from '../Images'

type Props = { character: Character } & PictureAttributes

export default function CharacterToken({character, ...props}: Props) {
  const {t} = useTranslation()
  return <Picture alt={getDescription(t, character)} src={images[character]} css={style} {...props}/>
}

const style = css`
  border-radius: 100%;
  box-shadow: 0 0 0.1em black;
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