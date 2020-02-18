import {css} from '@emotion/core'
import React, {Fragment, FunctionComponent} from 'react'
import {Player} from '../ItsAWonderfulWorld'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {height as empireCardHeight, width as empireCardWidth} from '../material/empires/EmpireCard'

export const constructedCardLeftMargin = empireCardWidth * 0.44

const ConstructedCardsArea: FunctionComponent<{ margin: number, player: Player }> = ({margin, player}) => (
  <Fragment>
    {player.constructedDevelopments.map((development, index) => <DevelopmentCard key={index} development={development} css={css`
        position:absolute;
        transform: translateY(${index * -12}%);
        bottom: ${margin + empireCardHeight * 0.90}vh;
        left: ${margin + constructedCardLeftMargin}vh;
      `}/>)}
  </Fragment>
)

export default ConstructedCardsArea