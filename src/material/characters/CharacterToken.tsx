import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from './Character'
import Financier from './financier.png'
import General from './general.png'

type Props = { character: Character } & React.HTMLAttributes<HTMLImageElement>

const CharacterToken: FunctionComponent<Props> = ({character, ...props}) => <img src={images[character]} css={style} {...props}/>

const style = css`
  filter: drop-shadow(0 0 5px black);
`

export const images = {
  [Character.General]: General,
  [Character.Financier]: Financier
}

export default CharacterToken