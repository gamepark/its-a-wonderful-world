/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faMinusSquare, faPlusSquare, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import GameView from '@gamepark/its-a-wonderful-world/GameView'
import {isOver} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import Move from '@gamepark/its-a-wonderful-world/moves/Move'
import {isReceiveCharacter} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import Phase from '@gamepark/its-a-wonderful-world/Phase'
import {Tutorial, useActions, useAnimation, useFailures, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {TFunction} from 'i18next'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import Button from '../util/Button'
import {
  closePopupStyle, discordUri, hidePopupOverlayStyle, platformUri, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupStyle, showPopupOverlayStyle
} from '../util/Styles'
import tutorialArrowDark from '../util/tutorial-arrow-dark.png'
import tutorialArrowLight from '../util/tutorial-arrow-light.png'

type Props = {
  game: GameView
  tutorial: Tutorial
}

export default function TutorialPopup({game, tutorial}: Props) {
  const {t} = useTranslation()
  const theme = useTheme()
  const [failures] = useFailures()
  const playerId = usePlayerId<EmpireName>()
  const actions = useActions<Move, EmpireName>()
  const animation = useAnimation<Move>(animation => !isReceiveCharacter(animation.move))
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialEnd, setTutorialEnd] = useState(false)
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
  const [hideLastTurnInfo, setHideLastTurnInfo] = useState(false)
  const [hideThirdTurnInfo, setHideThirdTurnInfo] = useState(false)
  useEffect(() => tutorial.setOpponentsPlayAutomatically(true), [])
  const toggleTutorialEnd = () => {
    setTutorialEnd(!tutorialEnd)
  }
  const moveTutorial = (deltaMessage: number) => {
    setTutorialIndex(tutorialIndex + deltaMessage)
    setTutorialDisplay(true)
  }
  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true)
  }
  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber
    while (!tutorialDescription[currentStep]) {
      currentStep--
    }
    return tutorialDescription[currentStep][index]
  }
  useEffect(() => {
    if (previousActionNumber.current > actionsNumber) {
      setTutorialDisplay(false)
    } else if (tutorialDescription[actionsNumber]) {
      resetTutorialDisplay()
    }
    previousActionNumber.current = actionsNumber
  }, [actionsNumber])
  useEffect(() => {
    if (failures.length) {
      setTutorialIndex(tutorialDescription[actionsNumber].length - 1)
      setTutorialDisplay(true)
    }
  }, [actionsNumber, failures])
  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && !animation && currentMessage && !failures.length
  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]}
           onClick={() => setTutorialDisplay(false)}>
        <div css={[popupStyle, theme.light ? popupLightStyle : popupDarkStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
             onClick={event => event.stopPropagation()}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>
          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p>{currentMessage.text(t)}</p>}
          {tutorialIndex > 0 && <Button css={buttonStyle} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
          <Button onClick={() => moveTutorial(1)}>{t('OK')}</Button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <Button css={resetStyle} onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <Picture alt="Arrow pointing toward current tutorial interest" src={theme.light ? tutorialArrowLight : tutorialArrowDark}
                 css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
      }
      {
        game.round === 3 && game.phase === Phase.Draft && !hideThirdTurnInfo &&
        <div css={[popupStyle, popupPosition(thirdTurnInfo), theme.light ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => setHideThirdTurnInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
          <h2>{thirdTurnInfo.title(t)}</h2>
          <p>{thirdTurnInfo.text(t)}</p>
          <Button onClick={() => setHideThirdTurnInfo(true)}>{t('OK')}</Button>
        </div>
      }
      {
        game.round === 4 && game.phase === Phase.Draft && !hideLastTurnInfo &&
        <div css={[popupStyle, popupPosition(lastTurnInfo), theme.light ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => setHideLastTurnInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
          <h2>{lastTurnInfo.title(t)}</h2>
          <p>{lastTurnInfo.text(t)}</p>
          <Button onClick={() => setHideLastTurnInfo(true)}>{t('OK')}</Button>
        </div>
      }
      {
        isOver(game) &&
        <div css={[popupStyle, popupPosition(tutorialEndGame), tutorialEnd && buttonsPosition, theme.light ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => toggleTutorialEnd()}><FontAwesomeIcon icon={tutorialEnd ? faPlusSquare : faMinusSquare}/></div>
          {!tutorialEnd &&
          <>
            <h2>{tutorialEndGame.title(t)}</h2>
            <p>{tutorialEndGame.text(t)}</p>
          </>
          }
          <Button css={buttonStyle} onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
          <Button css={buttonStyle} onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
          <Button onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
        </div>
      }
    </>
  )
}

export function resetTutorial() {
  localStorage.removeItem('its-a-wonderful-world')
  window.location.reload()
}

const style = css`
  background-color: transparent;
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'});
`

export const buttonsPosition = css`
  top: 86%;
  width: 80%;
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 10%;
  right: 1%;
  font-size: 3.5em;
`

const buttonStyle = css`
  margin-right: 1em;
`

const arrowStyle = (angle: number) => css`
  position: absolute;
  transform: rotate(${angle}deg);
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
`

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`

export const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

type TutorialStepDescription = {
  title: (t: TFunction) => string
  text: (t: TFunction) => string
  boxTop: number
  boxLeft: number
  boxWidth: number
  arrow?: {
    angle: number
    top: number
    left: number
  }
}

const tutorialDescription: TutorialStepDescription[][] = [
  [
    {
      title: (t: TFunction) => t('Welcome to It’ s a Wonderful World tutorial'),
      text: (t: TFunction) => t('In It’s a Wonderful World, you are leading an expanding Empire. You must choose the path that will get you to develop faster and better than your competitors!'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Your Empire'),
      text: (t: TFunction) => t('This is your Empire: the Noram States.'),
      boxTop: 26,
      boxLeft: 40.5,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 17,
        left: 66
      }
    },
    {
      title: (t: TFunction) => t('Your opponents'),
      text: (t: TFunction) => t('In this tutorial, you play against 2 opponents controlled by the machine: the Republic of Europe and Federation of Asia.'),
      boxTop: 35,
      boxLeft: 40.5,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 27,
        left: 66
      }
    },
    {
      title: (t: TFunction) => t('Goal of the game'),
      text: (t: TFunction) => t('The game consists of choosing and building Development cards. Some of these cards earn victory points. The player with the most victory points at the end of the game wins!'),
      boxTop: 61,
      boxLeft: 44,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 61,
        left: 36
      }
    },
    {
      title: (t: TFunction) => t('Flow of the game'),
      text: (t: TFunction) => t('A game is played in 4 rounds. We will guide you through the first round to teach you how to play, then you will be free to make your own choices!'),
      boxTop: 30,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 17,
        left: 14
      }
    },
    {
      title: (t: TFunction) => t('Flow of a round'),
      text: (t: TFunction) => t('A round consists of 3 phases that players play simultaneously: Draft, Planning and Production.'),
      boxTop: 30,
      boxLeft: 43,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 17,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Draft phase'),
      text: (t: TFunction) => t('Each player receives 7 cards. You must choose 1 card and pass the rest to the Republic of Europe.'),
      boxTop: 61,
      boxLeft: 44,
      boxWidth: 60,
      arrow: {
        angle: -180,
        top: 61,
        left: 36
      }
    },
    {
      title: (t: TFunction) => t('Choose your first card'),
      text: (t: TFunction) => t('Move the Secret Society to your draft area. We will see later why this card is strategic for you.'),
      boxTop: 61,
      boxLeft: 43,
      boxWidth: 70,
      arrow: {
        angle: -180,
        top: 61,
        left: 11
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Simultaneous choice'),
      text: (t: TFunction) => t('As you can see, the Asian Federation has passed you 6 cards. The players choose 1 card simultaneously and pass the rest to the next player.'),
      boxTop: 61,
      boxLeft: 45,
      boxWidth: 80,
      arrow: {
        angle: 180,
        top: 61,
        left: 36
      }
    },
    {
      title: (t: TFunction) => t('Direction of the draft'),
      text: (t: TFunction) => t('These arrows indicate the direction of the cards for this round.'),
      boxTop: 26,
      boxLeft: 44.5,
      boxWidth: 70,
      arrow: {
        angle: 90,
        top: 19,
        left: 75
      }
    },
    {
      title: (t: TFunction) => t('Choose the Industrial Complex'),
      text: (t: TFunction) => t('This card will provide you with a good start.'),
      boxTop: 60,
      boxLeft: 40,
      boxWidth: 70,
      arrow: {
        angle: 180,
        top: 60,
        left: 31
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Cards production'),
      text: (t: TFunction) => t('Some cards produce resources once built. For example, the Industrial Complex will produce a gray resource (Materials) and a yellow one (Gold).'),
      boxTop: 67,
      boxLeft: 62,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 61.9,
        left: 20.7
      }
    },
    {
      title: (t: TFunction) => t('Construction cost'),
      text: (t: TFunction) => t('The resources will allow you to build the cards. For example, the Industrial Complex costs 3 Materials (in grey) and one Energy (in black).'),
      boxTop: 52,
      boxLeft: 58.5,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 45,
        left: 17
      }
    },
    {
      title: (t: TFunction) => t('Production of the Empire'),
      text: (t: TFunction) => t('Fortunately, you don’t start without production! Your Empire will produce 3 Materials and 1 Gold every round.'),
      boxTop: 78,
      boxLeft: 43,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 72.2,
        left: 1.3
      }
    },
    {
      title: (t: TFunction) => t('Now choose the Propaganda Center'),
      text: (t: TFunction) => t('Thanks to this card, you will be able to produce more and more Gold!'),
      boxTop: 60,
      boxLeft: 40,
      boxWidth: 60,
      arrow: {
        angle: -180,
        top: 60,
        left: 27
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Proportional production'),
      text: (t: TFunction) => t('Once built, the Propaganda Center will produce as much Gold as you have yellow cards built.'),
      boxTop: 56,
      boxLeft: 34,
      boxWidth: 60,
      arrow: {
        angle: -180,
        top: 55.5,
        left: 26
      }
    },
    {
      title: (t: TFunction) => t('Types of cards'),
      text: (t: TFunction) => t('The Secret Society and the Propaganda Center are both yellow cards. The symbol at the bottom right of the cards is a reminder of their type.'),
      boxTop: 56,
      boxLeft: 37.3,
      boxWidth: 60,
      arrow: {
        angle: -180,
        top: 55.5,
        left: 29.3
      }
    },
    {
      title: (t: TFunction) => t('Now choose the Harbor Zone'),
      text: (t: TFunction) => t('It is expensive to build (5 Gold), but it will then produce a lot each turn (2 Materials and 2 Gold).'),
      boxTop: 60,
      boxLeft: 50,
      boxWidth: 60,
      arrow: {
        angle: -180,
        top: 60,
        left: 40
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Choose the Wind Turbines'),
      text: (t: TFunction) => t('This card is not necessarily interesting to build, but we will be able to make good use of it anyway!'),
      boxTop: 60,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 60,
        left: 27
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Recycling bonus'),
      text: (t: TFunction) => t('During Planning, each card can offer you a resource if you discard it. For the Wind Turbine, it is an Energy, it is indicated here.'),
      boxTop: 52,
      boxLeft: 56,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 51.8,
        left: 47.9
      }
    },
    {
      title: (t: TFunction) => t('Recycling bonus'),
      text: (t: TFunction) => t('It’s a good thing: we lacked one Energy to build the Industrial Complex!'),
      boxTop: 54,
      boxLeft: 58,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 48,
        left: 16.7
      }
    },
    {
      title: (t: TFunction) => t('Choose the Universal Exposition'),
      text: (t: TFunction) => t('As with the Wind Turbine, we will be able to recycle this card, but this time to win one Gold.'),
      boxTop: 60,
      boxLeft: 45,
      boxWidth: 70,
      arrow: {
        angle: 180,
        top: 60,
        left: 31
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('End of Draft'),
      text: (t: TFunction) => t('You have automatically retrieved the last card passed by the Asian Federation, a Zeppelin.'),
      boxTop: 63,
      boxLeft: 65,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 62,
        left: 63.5
      }
    },
    {
      title: (t: TFunction) => t('Planning phase'),
      text: (t: TFunction) => t('We now move on to the second phase of the round, the Planning: each card chosen in the previous phase must be put under construction or recycled.'),
      boxTop: 30,
      boxLeft: 30,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 17,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Let’s start with the Industrial Complex'),
      text: (t: TFunction) => t('We want to build this card. So move it to the Construction Area.'),
      boxTop: 62,
      boxLeft: 31,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 62,
        left: 16.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Start the construction of the Propaganda Center.'),
      text: (t: TFunction) => t('Also slate the Propaganda Center into the Construction Area.'),
      boxTop: 62,
      boxLeft: 31,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 62,
        left: 16.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Victory points'),
      text: (t: TFunction) => t('At this location, you can see that the Propaganda Center earns 1 victory point at the end of the game, if built.'),
      boxTop: 67,
      boxLeft: 58,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 61.7,
        left: 16.5
      }
    },
    {
      title: (t: TFunction) => t('Put the Harbor Zone under Construction'),
      text: (t: TFunction) => t('Once built, this card will produce 2 Materials and 2 Gold each turn, but will also yield 2 victory points at the end of the game.'),
      boxTop: 62,
      boxLeft: 31,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 62,
        left: 16.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Character tokens'),
      text: (t: TFunction) => t('Another way to score victory points is to accumulate Financiers and Generals. Each brings 1 point.'),
      boxTop: 81,
      boxLeft: 24,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 80,
        left: -1.7
      }
    },
    {
      title: (t: TFunction) => t('Your strategy'),
      text: (t: TFunction) => t('Your Empire gives you a strategic bonus: each Financier token earns you an extra point!'),
      boxTop: 78,
      boxLeft: 33,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 72,
        left: -3.3
      }
    },
    {
      title: (t: TFunction) => t('Start the Construction of the Secret Society'),
      text: (t: TFunction) => t('The Secret Society fits perfectly into your strategy, since once built it will also earn you 1 point per Financial token: put it under construction.'),
      boxTop: 60,
      boxLeft: 34,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 60,
        left: 7
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Other strategies…'),
      text: (t: TFunction) => t('This card earns 3 victory points per green building built.'),
      boxTop: 83,
      boxLeft: 31,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 82.3,
        left: 13.7
      }
    },
    {
      title: (t: TFunction) => t('Other strategies…'),
      text: (t: TFunction) => t('However, to build it we would have to spend 2 precious Financiers!'),
      boxTop: 69,
      boxLeft: 32,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 68.5,
        left: 13
      }
    },
    {
      title: (t: TFunction) => t('Recycle the Universal Exposition'),
      text: (t: TFunction) => t('Slide this card to the Recycling Zone, above the Construction Zone: it will be more useful this way.'),
      boxTop: 62,
      boxLeft: 31,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 62,
        left: 16.5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Recycling bonus'),
      text: (t: TFunction) => t('By recycling the Universal Exposition during the Planning phase, we obtained an Gold that can be used immediately.'),
      boxTop: 44,
      boxLeft: 55,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 31.1,
        left: 46.4
      }
    },
    {
      title: (t: TFunction) => t('Place the Gold on the Propaganda Center'),
      text: (t: TFunction) => t('Drag this yellow cube to your Propaganda Center to start building it.'),
      boxTop: 44,
      boxLeft: 55,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 31.1,
        left: 46.4
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('The yellow cube is there'),
      text: (t: TFunction) => t('You only need 2 more Gold to complete the construction of the Propaganda Center.'),
      boxTop: 48,
      boxLeft: 58,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 41.5,
        left: 16.5
      }
    },
    {
      title: (t: TFunction) => t('Recycle the Wind Turbine'),
      text: (t: TFunction) => t('Now slide the Wind Turbine to the recycling area, to get a black cube this time.'),
      boxTop: 60,
      boxLeft: 34,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 60,
        left: 7
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Place the Energy on the Industrial Complex'),
      text: (t: TFunction) => t('Now slide the black cube, obtained by recycling the Wind Turbine, to the Industrial Complex.'),
      boxTop: 29,
      boxLeft: 63,
      boxWidth: 55,
      arrow: {
        angle: 270,
        top: 23,
        left: 24
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Recycle the Zeppelin'),
      text: (t: TFunction) => t('This card costs 2 Energy (which you do not produce) and produces 1 blue cube (the Exploration), not very useful for our strategy: recycle it.'),
      boxTop: 60,
      boxLeft: 27,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 60,
        left: 7
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('The blue cube is here'),
      text: (t: TFunction) => t('By recycling the Zeppelin, you get a blue cube. However, none of your cards under construction need this resource.'),
      boxTop: 81,
      boxLeft: 49,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Useless resources?'),
      text: (t: TFunction) => t('A resource that cannot be used immediately must be placed here on your Empire card.'),
      boxTop: 81,
      boxLeft: 49,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Useless resources?'),
      text: (t: TFunction) => t('The Resources on your Empire card can no longer be used to build Development cards.'),
      boxTop: 81,
      boxLeft: 49,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Generation of Krystallium'),
      text: (t: TFunction) => t('However, if there are 5 cubes on your Empire card (regardless of their color), they are converted into 1 red cube, the Krystallium.'),
      boxTop: 81,
      boxLeft: 49,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Use of Krystallium'),
      text: (t: TFunction) => t('The Krystallium can replace any cube to build a card, and can be used at any time.'),
      boxTop: 81,
      boxLeft: 49,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Krystallium cost'),
      text: (t: TFunction) => t('Some cards, such as the Secret Society, require Krystallium to be built.'),
      boxTop: 42,
      boxLeft: 41,
      boxWidth: 70,
      arrow: {
        angle: -180,
        top: 41.7,
        left: 31.8
      }
    },
    {
      title: (t: TFunction) => t('Don’t forget to validate!'),
      text: (t: TFunction) => t('You must click on Validate to indicate to the other players that you have completed your planning.'),
      boxTop: 31,
      boxLeft: 53,
      boxWidth: 80,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Production phase'),
      text: (t: TFunction) => t('The production phase takes place in 5 stages: one per resource, in the order of the production line: grey, black, green, yellow and finally blue.'),
      boxTop: 30,
      boxLeft: 50,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 17,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Materials production'),
      text: (t: TFunction) => t('All players start by producing Materials. You produce 3 of them, which are available here.'),
      boxTop: 53,
      boxLeft: 36,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 40,
        left: 6.8
      }
    },
    {
      title: (t: TFunction) => t('Supremacy Bonus'),
      text: (t: TFunction) => t('At each Production step, the Empire that produces the most wins a General or a Financier. You produce the most Materials, so you win a Financier token!'),
      boxTop: 38,
      boxLeft: 30,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 25,
        left: 6.8
      }
    },
    {
      title: (t: TFunction) => t('Financier Tokens'),
      text: (t: TFunction) => t('Here is your token. As a reminder, it gives you 1 victory point, + 1 thanks to your Empire. Once the Secret Society is built, it will be 1 additional point per Financier.'),
      boxTop: 76,
      boxLeft: 49,
      boxWidth: 80,
      arrow: {
        angle: -90,
        top: 88,
        left: -2
      }
    },
    {
      title: (t: TFunction) => t('Build the Industrial Complex'),
      text: (t: TFunction) => t('Your 3 Materials will allow us to complete the construction of the Industrial Complex.'),
      boxTop: 49,
      boxLeft: 49,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 44,
        left: 7.5
      }
    },
    {
      title: (t: TFunction) => t('Build the Industrial Complex'),
      text: (t: TFunction) => t('Several options are available to you: drag the card to the left, click and hold on the card, move the cubes one by one, or click on the card to zoom in and see all the available actions.'),
      boxTop: 49,
      boxLeft: 49,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 44,
        left: 7.5
      }
    }
  ],
  [],
  [],
  [
    {
      title: (t: TFunction) => t('Built cards'),
      text: (t: TFunction) => t('The Industrial Complex is now part of your Empire, and increases your production by 1 Material and 1 Gold.'),
      boxTop: 74,
      boxLeft: 47,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 69.3,
        left: 0
      }
    },
    {
      title: (t: TFunction) => t('Order of production'),
      text: (t: TFunction) => t('The Material production step has already started, so it’s too late to produce an additional Material this round, but you will benefit from it during the 3 remaining rounds.'),
      boxTop: 74,
      boxLeft: 47,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 69.3,
        left: 0
      }
    },
    {
      title: (t: TFunction) => t('Order of production'),
      text: (t: TFunction) => t('On the other hand, the Gold production step hasn’t started yet, so you’ll get an extra Gold starting this round!'),
      boxTop: 74,
      boxLeft: 47,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 69.3,
        left: 0
      }
    },
    {
      title: (t: TFunction) => t('Construction bonus'),
      text: (t: TFunction) => t('In addition, by completing the construction of certain cards, you can win a bonus indicated here: you earned a second Financier token!'),
      boxTop: 72,
      boxLeft: 46,
      boxWidth: 70,
      arrow: {
        angle: -90,
        top: 66.4,
        left: -0.7
      }
    },
    {
      title: (t: TFunction) => t('Don’t forget to validate!'),
      text: (t: TFunction) => t('Once you have placed all your resources, you must validate to let other players know that you are ready.'),
      boxTop: 30,
      boxLeft: 54,
      boxWidth: 77,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Energy production'),
      text: (t: TFunction) => t('The player producing the most Energy wins a General token. However, your 2 opponents are tied: in this case, no one wins a token.'),
      boxTop: 38,
      boxLeft: 28,
      boxWidth: 53,
      arrow: {
        angle: 0,
        top: 25,
        left: 20
      }
    },
    {
      title: (t: TFunction) => t('Recycling'),
      text: (t: TFunction) => t('At any time you can recycle a card from your Construction Zone. However, the cubes placed on it will be lost and its recycling bonus must be put on your Empire card.'),
      boxTop: 64,
      boxLeft: 51,
      boxWidth: 50,
      arrow: {
        angle: -90,
        top: 58.4,
        left: 14
      }
    },
    {
      title: (t: TFunction) => t('Don’t forget to validate!'),
      text: (t: TFunction) => t('Actions such as recycling a card or placing a Krystallium to complete a construction are possible at any time. You must therefore validate your turn at each production step, even if you don’t produce anything!'),
      boxTop: 30,
      boxLeft: 53,
      boxWidth: 70,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Science production'),
      text: (t: TFunction) => t('The player with the most Science can choose either a Financier Tokens or a General Token. Here, the Republic of Europa has taken a General.'),
      boxTop: 39,
      boxLeft: 42,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 25,
        left: 33.3
      }
    },
    {
      title: (t: TFunction) => t('Don’t forget to validate!'),
      text: (t: TFunction) => t('Although you are not producing Science, you still have to validate again.'),
      boxTop: 30,
      boxLeft: 53,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Gold production'),
      text: (t: TFunction) => t('You produce 2 Gold (one thanks to your Empire and one thanks to the Industrial Complex).'),
      boxTop: 54,
      boxLeft: 53,
      boxWidth: 51,
      arrow: {
        angle: 0,
        top: 40,
        left: 46.4
      }
    },
    {
      title: (t: TFunction) => t('Supremacy Bonus'),
      text: (t: TFunction) => t('The Federation of Asia produces 1 Gold more than you and therefore receives the Financier token. Try to produce more next rounds to win the Supremacy bonus!'),
      boxTop: 53,
      boxLeft: 40,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 46,
        left: 66
      }
    },
    {
      title: (t: TFunction) => t('Placement of resources'),
      text: (t: TFunction) => t('You can always choose to place your resources on your Empire card; however the Krystallium does not earn points at the end of the game.'),
      boxTop: 81,
      boxLeft: 44,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 77,
        left: 2.5
      }
    },
    {
      title: (t: TFunction) => t('Placement of resources'),
      text: (t: TFunction) => t('It is better to build your cards: place your Gold on your Propaganda Center.'),
      boxTop: 49,
      boxLeft: 49,
      boxWidth: 60,
      arrow: {
        angle: -90,
        top: 44,
        left: 7.5
      }
    }
  ],
  [],
  [
    {
      title: (t: TFunction) => t('Gold production'),
      text: (t: TFunction) => t('Your new Gold production comes too late for this round, but will benefit you in future rounds.'),
      boxTop: 73,
      boxLeft: 37,
      boxWidth: 50,
      arrow: {
        angle: -90,
        top: 66.8,
        left: 0.5
      }
    },
    {
      title: (t: TFunction) => t('Construction bonus'),
      text: (t: TFunction) => t('By completing the construction of the Propaganda Center, you have won a General, which will give you 1 victory point at the end of the game.'),
      boxTop: 70,
      boxLeft: 36,
      boxWidth: 50,
      arrow: {
        angle: -90,
        top: 63.8,
        left: -0.6
      }
    },
    {
      title: (t: TFunction) => t('Don’t forget to validate!'),
      text: (t: TFunction) => t('As usual, validate to proceed to the next step.'),
      boxTop: 30,
      boxLeft: 53,
      boxWidth: 65,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Total production'),
      text: (t: TFunction) => t('The total production of each player is displayed here. You will produce at least 4 Materials and 3 Gold in the next round!'),
      boxTop: 26,
      boxLeft: 40.5,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 17,
        left: 66
      }
    },
    {
      title: (t: TFunction) => t('Exploration production'),
      text: (t: TFunction) => t('You do not produce any Exploration. Validate now to proceed to the next round.'),
      boxTop: 30,
      boxLeft: 53,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 17,
        left: 45
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('End of the first round'),
      text: (t: TFunction) => t('We are now in round 2, and a new Draft phase begins. The direction of the cards is reversed every turn.'),
      boxTop: 29,
      boxLeft: 36,
      boxWidth: 70,
      arrow: {
        angle: 0,
        top: 16,
        left: 14.5
      }
    },
    {
      title: (t: TFunction) => t('Each round goes like this'),
      text: (t: TFunction) => t('You have until the end of the game to complete the construction of your cards. Try to build the Harbor Zone quickly, to benefit from its production! The Secret Society does not produce anything, you can safely wait until turn 4 to finish it.'),
      boxTop: 34,
      boxLeft: 63,
      boxWidth: 55,
      arrow: {
        angle: -90,
        top: 25,
        left: 24
      }
    },
    {
      title: (t: TFunction) => t('You can change your mind!'),
      text: (t: TFunction) => t('In the menu, the [↺] button allows you to undo your last move: it is displayed in red when it is allowed.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 55
    },
    {
      title: (t: TFunction) => t('Keep an eye on your opponents'),
      text: (t: TFunction) => t('By clicking on your opponents, you can see their Empire. "If you know your enemies and know yourself, you will not be imperiled in a hundred battles." - Sun Tzu'),
      boxTop: 35,
      boxLeft: 44,
      boxWidth: 55,
      arrow: {
        angle: 90,
        top: 27,
        left: 67
      }
    },
    {
      title: (t: TFunction) => t('It’s up to you!'),
      text: (t: TFunction) => t('You can now finish the game by making your own choices. Good luck!'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    }
  ]
]

const thirdTurnInfo = {
  title: (t: TFunction) => t('2-player game'),
  text: (t: TFunction) => t('For information, in a 2-player game, each player receives 10 cards for the draft. However, the last 3 cards not chosen are discarded.'),
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const lastTurnInfo = {
  title: (t: TFunction) => t('Last round!'),
  text: (t: TFunction) => t('This is the last round! It’s time to score as many victory points as possible. As a reminder, Krystallium does not score points at the end.'),
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations!'),
  text: (t: TFunction) => t('You have finished your first game! You can now play with your friends, or meet other players via our chat room on Discord.'),
  boxTop: 81,
  boxLeft: 53,
  boxWidth: 87
}