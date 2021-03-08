/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {useNow} from '@gamepark/react-client'
import PlayerTime from '@gamepark/react-client/dist/Types/PlayerTime'
import {FunctionComponent} from 'react'
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