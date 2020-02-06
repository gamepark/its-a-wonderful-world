import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Hand, usePlay} from 'tabletop-game-workshop/dist'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/development-cards/DevelopmentCard'
import Empire from '../material/Empire'
import EmpireCard from '../material/empire-cards/EmpireCard'
import {chooseDevelopmentCard} from '../moves/ChooseDevelopmentCard'

const bottomLeft = css`
  position: absolute;
  bottom: 1vh;
  left: 1vh;
`

const MyEmpire: FunctionComponent<{ empire: Empire, player: Player }> = ({empire, player}) => {
  const play = usePlay()
  return (
    <Fragment>
      <EmpireCard empire={empire as Empire} position={bottomLeft}/>
      <div css={css`
        position: absolute;
        height: 24.6vh;
        width: ${player.draftArea.length * 15.3 + 1.6}vh;
        bottom: 1vh;
        left: 26vh;
        background-color: rgba(0, 255, 0, 0.1);
        border: 0.3vh dashed green;
        border-radius: 1vh;
      `}>
        {player.draftArea.map((development, index) => <DevelopmentCard key={index} development={development} position={css`
          position: absolute;
          bottom: 1vh;
          left: ${index * 15.3 + 1}vh;
        `}/>)}
      </div>
      <div css={css`
        position: absolute;
        height: 24.6vh;
        bottom: 26.6vh;
        left: 26vh;
        right: 1vh;
        background-color: rgba(255, 0, 0, 0.1);
        border: 0.3vh dashed red;
        border-radius: 1vh;
      `}>
        {player.constructionArea.map((construction, index) => <DevelopmentCard key={index} development={construction.development} position={css`
          position:absolute;
          top: 1vh;
          left: ${index * 15.3 + 1}vh;
        `}/>)}
      </div>
      {player.constructedDevelopments.map((development, index) => <DevelopmentCard key={index} development={development} position={css`
        position:absolute;
        bottom: ${index * 2.6 + 14}vh;
        left: 10.8vh;
      `}/>)}
      <Hand rotationOrigin={5000} nearbyMaxRotation={0.72} sizeRatio={65 / 100}
            onItemClick={index => play(chooseDevelopmentCard(empire, index))}
            position={css`
              bottom: 3vh;
              right: ${player.hand.length * 7 - 6}vh;
            `}>
        {player.hand.map((development, index) => <DevelopmentCard key={index} development={development}/>)}
      </Hand>
    </Fragment>
  )
}

export default MyEmpire