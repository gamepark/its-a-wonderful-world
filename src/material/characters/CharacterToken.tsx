import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from './Character'
import Financier from './financier.png'
import General from './general.png'
import zeroFinancier from './financier-zero.png'
import zeroGeneral from './general-zero.png'

type Props = { character: Character, dummy?:boolean } & React.HTMLAttributes<HTMLImageElement>

const CharacterToken: FunctionComponent<Props> = ({character, dummy=false, ...props}) => {
  const {t} = useTranslation()
  if(dummy)
    return <img alt={getDescription(t, character, dummy)} src={defaultImages[character]} css={style} {...props}/>
  else
    return <img alt={getDescription(t, character, dummy)} src={images[character]} css={style} {...props}/>
}

const style = css`
  border-radius: 100%;
  box-shadow: 0 0 5px black;
`

export const images = {
  [Character.General]: General,
  [Character.Financier]: Financier
}

export const defaultImages = {
  [Character.General]: zeroGeneral,
  [Character.Financier]: zeroFinancier
}

function getDescription(t: TFunction, character: Character, dummy: boolean) {
  switch (character) {
    case Character.Financier:
      if(dummy)
        return t('Jetons Financiers')
      else
        return t('Un jeton Financier')
    case Character.General:
      if(dummy)
        return t('Jetons Généraux')
      else
        return t('Un jeton Général')
  }
}

export default CharacterToken