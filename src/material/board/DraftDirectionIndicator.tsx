import {css, keyframes} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import Player from '../../types/Player'
import PlayerView from '../../types/PlayerView'
import DownArrowIcon from '../../util/DownArrowIcon'
import UpArrowIcon from '../../util/UpArrowIcon'

const DraftDirectionIndicator: FunctionComponent<{ clockwise: boolean, players: (Player | PlayerView)[] }> = ({clockwise, players}) => (
  <Fragment>
    {players.slice(1).map((_, index) => clockwise ?
      <DescendingArrows key={index} color="forestgreen" css={css`top: ${25.2 + index * 18.5}%;`}
                        title={'Sens de passage des cartes'}/> :
      <AscendingArrows key={index} color="purple" css={css`top: ${25.2 + index * 18.5}%;`}
                       title={'Sens de passage des cartes'}/>
    )}
  </Fragment>
)

const DescendingArrows: FunctionComponent<React.HTMLAttributes<HTMLDivElement> & { color: string }> = ({color, ...props}) => (
  <div css={[slider, scrollDownAnimation]} {...props}>
    <div>
      <DownArrowIcon fill={color} style={{top: 0}}/>
      <DownArrowIcon fill={color} style={{top: '25%'}}/>
      <DownArrowIcon fill={color} style={{top: '50%'}}/>
      <DownArrowIcon fill={color} style={{top: '75%'}}/>
      <DownArrowIcon fill={color} style={{top: '100%'}}/>
    </div>
  </div>
)

const AscendingArrows: FunctionComponent<React.HTMLAttributes<HTMLDivElement> & { color: string }> = ({color, ...props}) => (
  <div css={[slider, scrollUpAnimation]} {...props}>
    <div>
      <UpArrowIcon fill={color} style={{top: 0}}/>
      <UpArrowIcon fill={color} style={{top: '25%'}}/>
      <UpArrowIcon fill={color} style={{top: '50%'}}/>
      <UpArrowIcon fill={color} style={{top: '75%'}}/>
      <UpArrowIcon fill={color} style={{top: '100%'}}/>
    </div>
  </div>
)

const slider = css`
  position: absolute;
  right: 9%;
  width: 3%;
  height: 2%;
  overflow: hidden;
  & > * {
    width: 100%;
    height: 200%;
    & > svg {
      position: absolute;
      width: 100%;
      transform: translateY(-50%);
    }
  }
`

export const scrollDown = keyframes`
  from { transform: translateY(-50%); }
  to { transform: translateY(0%); }
`

const scrollDownAnimation = css`
  & > * {
    animation: ${scrollDown} 2s linear infinite;
  }
`

export const scrollUp = keyframes`
  from { transform: translateY(0%); }
  to { transform: translateY(-50%); }
`

const scrollUpAnimation = css`
  & > * {
    animation: ${scrollUp} 2s linear infinite;
  }
`

export default DraftDirectionIndicator