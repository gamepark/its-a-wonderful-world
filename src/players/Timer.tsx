import {css} from '@emotion/core'
import {useNow} from '@gamepark/workshop'
import PlayerTime from '@gamepark/workshop/dist/Types/PlayerTime'
import React, {FunctionComponent} from 'react'
import {humanize} from '../util/TimeUtil'

const Timer: FunctionComponent<{ time: PlayerTime }> = ({time}) => {
  const now = useNow()
  const availableTime = time.availableTime - now + Date.parse(time.lastChange)
  return <span css={availableTime < 0 && timeoutStyle}>{humanize(Math.abs(availableTime))}</span>
}

const timeoutStyle = css`
  color: darkred;
  &:before {
    content: '-'
  }
`

export default Timer