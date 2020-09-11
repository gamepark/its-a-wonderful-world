import {css} from '@emotion/core'
import {faMinusSquare, faPlusSquare, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions, useAnimation, usePlayerId} from '@interlude-games/workshop'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import EmpireName from './material/empires/EmpireName'
import Move from './moves/Move'
import {isReceiveCharacter} from './moves/ReceiveCharacter'
import {isOver} from './Rules'
import Theme, {LightTheme} from './Theme'
import {resetTutorial} from './Tutorial'
import GameView from './types/GameView'
import Button from './util/Button'
import {
  closePopupStyle, discordUri, hidePopupOverlayStyle, platformUri, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupStyle, showPopupOverlayStyle
} from './util/Styles'
import tutorialArrowDark from './util/tutorial-arrow-dark.png'
import tutorialArrowLight from './util/tutorial-arrow-light.png'

const TutorialPopup: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const playerId = usePlayerId<EmpireName>()
  const actions = useActions<Move, EmpireName>()
  const animation = useAnimation<Move>(animation => !isReceiveCharacter(animation.move))
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialEnd, setTutorialEnd] = useState(false)
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
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
      setTutorialIndex(0)
      setTutorialDisplay(true)
    }
    previousActionNumber.current = actionsNumber
  }, [actionsNumber, setTutorialIndex])
  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && !animation && currentMessage
  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]}
           onClick={() => setTutorialDisplay(false)}>
        <div css={[popupStyle, theme.color === LightTheme ? popupLightStyle : popupDarkStyle, displayPopup ? popupPosition(currentMessage!) : hidePopupStyle]}
             onClick={event => event.stopPropagation()}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>
          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p>{currentMessage.text(t)}</p>}
          {tutorialIndex > 0 && <Button css={buttonStyle} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
          <Button onClick={() => moveTutorial(1)}>OK</Button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <Button css={resetStyle} onClick={() => resetTutorialDisplay()}>Afficher le Tutoriel</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <img alt={t('Tutorial Indicator')} src={theme.color === LightTheme ? tutorialArrowLight : tutorialArrowDark} draggable="false"
             css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
      }
      {
        isOver(game) &&
        <div css={[popupStyle, popupPosition(tutorialEndGame), tutorialEnd && buttonsPosition, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => toggleTutorialEnd()}><FontAwesomeIcon icon={tutorialEnd ? faPlusSquare : faMinusSquare}/></div>
          {!tutorialEnd &&
          <>
            <h2>{tutorialEndGame.title(t)}</h2>
            <p>{tutorialEndGame.text(t)}</p>
          </>
          }
          <Button css={buttonStyle} onClick={() => resetTutorial()}>Rejouer le tutoriel</Button>
          <Button css={buttonStyle} onClick={() => window.location.href = platformUri}>Jouer avec des amis</Button>
          <Button onClick={() => window.location.href = discordUri}>Trouver des joueurs</Button>
        </div>
      }
    </>
  )
}

const style = css`
  background-color: transparent;
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
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
    margin-right:1em;
`

const arrowStyle = (angle: number) => css`
    position: absolute;
    transform: rotate(${angle}deg);
    z-index : 102;
    transition:all .5s ease;
`

const showArrowStyle = (top: number, left: number) => css`
    top : ${top}%;
    left: ${left}%;
    width:20%;
`

const hideArrowStyle = css`
    top : 90%;
    left: 90%;
    width:0;
`

export const hidePopupStyle = css`
    top : 85%;
    left : 90%;
    width: 0;
    height: 0;
    margin: 0;
    padding:0;
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
      title: (t: TFunction) => t('Bienvenue dans le tutoriel de It’s a Wonderful World'),
      text: (t: TFunction) => t('Vous incarnez un Empire en expansion face à deux Empires concurrents.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 65
    },
    {
      title: (t: TFunction) => t('But du jeu'),
      text: (t: TFunction) => t('It’s a Wonderful World est un jeu de construction et de draft qui se joue en 4 tours. À la fin de la partie, le joueur ayant le plus de points de victoire est déclaré vainqueur.'),
      boxTop: 30,
      boxLeft: 45,
      boxWidth: 80,
      arrow: {
        angle: 0,
        top: 17,
        left: 14
      }
    },
    {
      title: (t: TFunction) => t('Comment jouer'),
      text: (t: TFunction) => t('Un tour est composé de 3 phases que les joueurs jouent simultanément : le Draft, la Planification et la Production.'),
      boxTop: 30,
      boxLeft: 45,
      boxWidth: 70,
      arrow: {
        angle: 0,
        top: 17,
        left: 22
      }
    },
    {
      title: (t: TFunction) => t('Phase de Draft'),
      text: (t: TFunction) => t('Chaque joueur reçoit 7 cartes. Vous devez choisir 1 carte et passer les autres à la République d’Europa.'),
      boxTop: 61,
      boxLeft: 50,
      boxWidth: 80,
      arrow: {
        angle: -180,
        top: 61,
        left: 36
      }
    },
    {
      title: (t: TFunction) => t('Choisissez votre première carte'),
      text: (t: TFunction) => t('Déplacez la Société Secrète dans votre zone de draft. Nous verrons plus tard pourquoi cette carte est stratégique pour vous.'),
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
      title: (t: TFunction) => t('Choix simultané'),
      text: (t: TFunction) => t('Comme vous avez pu le constater, la Fédération d’Asie vous a passé 6 cartes. Les joueurs choisissent simultanément 1 carte et passent le reste au joueur suivant.'),
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
      title: (t: TFunction) => t('Sens du draft'),
      text: (t: TFunction) => t('Ces flèches indiquent le sens de passage des cartes pour ce tour.'),
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
      title: (t: TFunction) => t('Choisissez le Complexe Industriel'),
      text: (t: TFunction) => t('Cette carte va vous permettre de bien démarrer la partie.'),
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
      title: (t: TFunction) => t('Production des cartes'),
      text: (t: TFunction) => t('Certaines cartes produisent des ressources une fois construites. Par exemple, le Complexe Industriel produira une ressource grise (les Matériaux) et une jaune (l’Or)'),
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
      title: (t: TFunction) => t('Coût de construction'),
      text: (t: TFunction) => t('Les ressources vous permettront de construire les cartes. Par exemple, le Complexe Industriel coûte 3 Matériaux (en gris) et une Énergie (en noir)'),
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
      title: (t: TFunction) => t('Production de l’Empire'),
      text: (t: TFunction) => t('Heureusement, vous ne commencez pas sans production ! Votre Empire produira chaque tour 3 Matériaux et 1 Or.'),
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
      title: (t: TFunction) => t('Choisissez à présent le Centre de Propagande'),
      text: (t: TFunction) => t('Grâce à cette carte, vous pourrez produire de plus en plus d’Or !'),
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
      title: (t: TFunction) => t('Production proportionnelle'),
      text: (t: TFunction) => t('Le Centre de Propagande produira une fois construit autant d’Or que vous avez de cartes jaunes construites.'),
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
      title: (t: TFunction) => t('Types de cartes'),
      text: (t: TFunction) => t('La Société Secrète et le Centre de Propagande sont toutes les 2 des cartes jaunes. Le symbole en bas à droite des cartes est un rappel de leur type.'),
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
      title: (t: TFunction) => t('Choisissez maintenant la Zone Portuaire'),
      text: (t: TFunction) => t('Elle coûte cher à construire (5 Ors), mais elle produira ensuite beaucoup à chaque tour (2 Matériaux et 2 Ors).'),
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
      title: (t: TFunction) => t('Choisissez les Éoliennes'),
      text: (t: TFunction) => t('Cette carte n’est pas forcément intéressante à construire, mais nous allons pouvoir en faire bon usage quand même !'),
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
      title: (t: TFunction) => t('Bonus de recyclage'),
      text: (t: TFunction) => t('Pendant la Planification, chaque carte pourra vous offrir une ressource si vous la défaussez. Pour l’Éolienne, c’est une Énergie, c’est indiqué ici.'),
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
      title: (t: TFunction) => t('Bonus de recyclage'),
      text: (t: TFunction) => t('Ça tombe bien, il nous manquait justement une Énergie pour construire le Complexe Industriel !'),
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
      title: (t: TFunction) => t('Choisissez l’Exposition universelle'),
      text: (t: TFunction) => t('Comme pour l’Éolienne, nous pourrons recycler cette carte, mais cette fois-ci pour gagner un Or.'),
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
      title: (t: TFunction) => t('Fin du Draft'),
      text: (t: TFunction) => t('Vous avez automatiquement récupéré la dernière carte passée par la Fédération d’Asie, ici un Zeppelin.'),
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
      title: (t: TFunction) => t('Phase de Planification'),
      text: (t: TFunction) => t('Nous passons maintenant à la seconde phase du tour, la Planification : chaque carte choisie lors de la phase précédente doit être mise en construction ou recyclée.'),
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
      title: (t: TFunction) => t('Commençons par le Complexe Industriel'),
      text: (t: TFunction) => t('Nous voulons construire cette carte. Déplacez-la donc vers la Zone de Construction.'),
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
      title: (t: TFunction) => t('Mettez en Construction le Centre de Propagande'),
      text: (t: TFunction) => t('Glissez également le Centre de Propagande en zone de construction.'),
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
      title: (t: TFunction) => t('Points de victoire'),
      text: (t: TFunction) => t('À cet emplacement, vous pouvez voir que le Centre de Propagande rapporte 1 point de victoire à la fin de la partie, s’il est construit.'),
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
      title: (t: TFunction) => t('Mettez en Construction la Zone Portuaire'),
      text: (t: TFunction) => t('Une fois construite, cette carte produira 2 Matériaux et 2 Ors chaque tour, mais rapportera aussi 2 points de victoire en fin de partie.'),
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
      title: (t: TFunction) => t('Jetons personnages'),
      text: (t: TFunction) => t('Une autre façon de marquer des points de victoire consiste à accumuler des Financiers et des Générales. Chacun rapporte 1 point.'),
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
      title: (t: TFunction) => t('Votre stratégie'),
      text: (t: TFunction) => t('Votre Empire vous donne un bonus stratégique : chaque jeton Financier vous rapporte un point supplémentaire !'),
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
      title: (t: TFunction) => t('Mettez en Construction la Société Secrète'),
      text: (t: TFunction) => t('La Société Secrète s’inscrit parfaitement dans votre stratégie, puisqu’une fois construite elle vous rapportera également 1 point par jeton Financier : mettez-la en construction.'),
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
      title: (t: TFunction) => t('D’autres stratégies...'),
      text: (t: TFunction) => t('Cette carte rapporte 3 points de victoire par bâtiment vert construit.'),
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
      title: (t: TFunction) => t('D’autres stratégies...'),
      text: (t: TFunction) => t('Cependant, pour la construire il nous faudrait dépenser 2 précieux financiers !'),
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
      title: (t: TFunction) => t('Recyclez l’Exposition Universelle'),
      text: (t: TFunction) => t('Glissez cette carte vers la zone de recyclage, au dessus de la Zone de Construction : elle nous sera plus utile ainsi.'),
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
      title: (t: TFunction) => t('Bonus de recyclage !'),
      text: (t: TFunction) => t('En recyclant l’Exposition Universelle pendant la phase de Planification, nous avons obtenu un Or utilisable immédiatement.'),
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
      title: (t: TFunction) => t('Placez l’Or sur le Centre de Propagande'),
      text: (t: TFunction) => t('Glissez ce cube jaune vers votre Centre de Propagande pour commencer à le construire.'),
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
      title: (t: TFunction) => t('Le cube jaune est là'),
      text: (t: TFunction) => t('Il ne vous manque plus que 2 Ors pour terminer la construction du Centre de Propagande.'),
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
      title: (t: TFunction) => t('Recyclez l’Éolienne'),
      text: (t: TFunction) => t('Glissez maintenant l’Éolienne vers la zone de recyclage, pour obtenir un cube noir cette fois-ci.'),
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
      title: (t: TFunction) => t('Placez l’Énergie sur le Complexe Industriel'),
      text: (t: TFunction) => t('À présent, glissez le cube noir, obtenu en recyclant l’Éolienne, vers le Complexe Industriel.'),
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
      title: (t: TFunction) => t('Recyclez  le Zeppelin'),
      text: (t: TFunction) => t('Cette carte coûte 2 Énergies (que vous ne produisez pas) et produit 1 cube bleu (l’Exploration), peu utile pour notre stratégie : recyclez-là.'),
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
      title: (t: TFunction) => t('Le cube bleu est là'),
      text: (t: TFunction) => t('En recyclant le zeppelin, vous obtenez un cube bleu. Cependant, aucune de vos cartes en construction n’a besoin de cette ressource.'),
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
      title: (t: TFunction) => t('Ressources inutiles ?'),
      text: (t: TFunction) => t('Une ressource qui ne peut pas être utilisée immédiatement doit être placée ici, sur votre carte Empire.'),
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
      title: (t: TFunction) => t('Ressources inutiles ?'),
      text: (t: TFunction) => t('Les Ressources de votre carte Empire ne sont plus utilisables pour construire des cartes Développement.'),
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
      title: (t: TFunction) => t('Génération de Krystallium'),
      text: (t: TFunction) => t('Cependant, si 5 cubes se trouvent sur votre carte Empire (quelle que soit leur couleur), ils sont convertis en 1 cube rouge, le Krystallium.'),
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
      title: (t: TFunction) => t('Utilisation du Krystallium'),
      text: (t: TFunction) => t('Le Krystallium peut remplacer n’importe quel cube pour construire une carte, et peut-être utilisé à tout moment.'),
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
      title: (t: TFunction) => t('Coût en Krystallium'),
      text: (t: TFunction) => t('Certaines cartes, comme la Société Secrète, nécessitent du Krystallium pour être construites.'),
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
      title: (t: TFunction) => t('N’oubliez pas de valider !'),
      text: (t: TFunction) => t('Vous devez cliquer sur Valider pour indiquer aux autres joueurs que vous avez terminé votre planification.'),
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
      title: (t: TFunction) => t('Phase de Production'),
      text: (t: TFunction) => t('La phase de production se déroule en 5 étapes : une par ressource, dans l’ordre de la chaîne de Production : gris, noir, vert, jaune et enfin bleu.'),
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
      title: (t: TFunction) => t('Production des Matériaux'),
      text: (t: TFunction) => t('Tous les joueurs commencent par produire des Matériaux. Vous en produisez 3, qui sont disponibles ici.'),
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
      title: (t: TFunction) => t('Bonus de Suprématie'),
      text: (t: TFunction) => t('À chaque étape de Production, l’Empire qui produit le plus gagne une Générale ou un Financier. Vous produisez le plus de Matériaux, vous gagnez donc un jeton Financier !'),
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
      title: (t: TFunction) => t('Jetons Financiers'),
      text: (t: TFunction) => t('Voici votre jeton. Pour rappel, il rapporte 1 point de victoire de base, + 1 grâce à votre Empire. Une fois la Société Secrète construite, ce sera à nouveau 1 point de plus par Financier.'),
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
      title: (t: TFunction) => t('Construisez le Complexe Industriel'),
      text: (t: TFunction) => t('Vos 3 Matériaux vont permettre de terminer la construction du Complexe Industriel.'),
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
      title: (t: TFunction) => t('Construisez le Complexe Industriel'),
      text: (t: TFunction) => t('Plusieurs options s’offrent à vous : glisser la carte vers la gauche, cliquer longtemps sur la carte, déplacer les cubes un par un, ou cliquer sur la carte pour zoomer dessus et avoir accès aux actions possibles.'),
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
      title: (t: TFunction) => t('Cartes construites'),
      text: (t: TFunction) => t('Le Complexe Industriel fait à présent partie de votre Empire, et augmente votre production de 1 Matériau et 1 Or.'),
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
      title: (t: TFunction) => t('Ordre des productions'),
      text: (t: TFunction) => t('L’étape de production des Matériaux a déjà commencé : il est donc trop tard pour produire un Matériau supplémentaire ce tour-ci, mais vous en bénéficierez lors des 3 tours restants.'),
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
      title: (t: TFunction) => t('Ordre des productions'),
      text: (t: TFunction) => t('Par contre, l’étape de production de l’Or n’a pas encore commencé : vous aurez donc un Or supplémentaire dès ce tour !'),
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
      title: (t: TFunction) => t('Bonus de Construction'),
      text: (t: TFunction) => t('De plus, en terminant la construction de certaines cartes, vous pouvez gagner un bonus indiqué ici : vous avez gagné un second jeton Financier !'),
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
      title: (t: TFunction) => t('N’oubliez pas de valider !'),
      text: (t: TFunction) => t('Une fois que vous avez placé toutes vos ressources, vous devez valider pour indiquer aux autres joueurs que vous êtes prêts.'),
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
      title: (t: TFunction) => t('Étape de production d’Énergie'),
      text: (t: TFunction) => t('Le joueur produisant le plus d’Énergie gagne un jeton Générale. Cependant, vos 2 adversaires sont à égalité : dans ce cas, personne ne gagne de jeton.'),
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
      title: (t: TFunction) => t('Recyclage'),
      text: (t: TFunction) => t('À tout moment vous pouvez recycler une carte depuis votre Zone de Construction. Cependant, les cubes placés dessus seront perdus et son bonus de recyclage ira obligatoirement sur votre carte Empire.'),
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
      title: (t: TFunction) => t('N’oubliez pas de valider !'),
      text: (t: TFunction) => t('Les actions comme recycler une carte ou placer un Krytallium pour terminer une construction sont possibles à tout moment. Vous devez donc valider votre tour à chaque étape de production, même si vous ne produisez rien !'),
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
      title: (t: TFunction) => t('Production de la Science'),
      text: (t: TFunction) => t('Le joueur produisant le plus de Science peut choisir un jeton Financier ou un jeton Générale. Ici, la République d’Europa a pris une Générale.'),
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
      title: (t: TFunction) => t('N’oubliez pas de valider !'),
      text: (t: TFunction) => t('Bien que vous ne produisiez pas de Science, vous devez quand même cliquer sur valider à nouveau.'),
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
      title: (t: TFunction) => t('Production de l’Or'),
      text: (t: TFunction) => t('Vous produisez 2 Or (un grâce à votre Empire et un grâce au Complexe Industriel) : placez-les sur le Centre de Propagande pour terminer sa construction.'),
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
      title: (t: TFunction) => t('Bonus de Suprématie'),
      text: (t: TFunction) => t('La Fédération d’Asie produit 1 Or de plus que vous et récupère donc le jeton Financier. Essayez de produire plus lors des prochains tours pour gagner cette Suprématie !'),
      boxTop: 53,
      boxLeft: 40,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 46,
        left: 66
      }
    }
  ],
  [],
  [
    {
      title: (t: TFunction) => t('Production de l’Or'),
      text: (t: TFunction) => t('Votre nouvelle production d’Or arrive trop tard pour ce tour, mais vous servira pour les tours suivants.'),
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
      title: (t: TFunction) => t('Bonus de construction'),
      text: (t: TFunction) => t('En terminant la construction du Centre de Propagande, vous avez gagné une Générale, qui vous rapportera 1 point de victoire en fin de partie.'),
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
      title: (t: TFunction) => t('N’oubliez pas de valider !'),
      text: (t: TFunction) => t('Comme d’habitude, validez pour passer à l’étape suivante.'),
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
      title: (t: TFunction) => t('Production totale'),
      text: (t: TFunction) => t('La production totale de chaque joueur est affichée ici. Vous produirez au prochain tour au moins 4 Matériaux et 3 Ors !'),
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
      title: (t: TFunction) => t('Production de l’Exploration'),
      text: (t: TFunction) => t('Vous ne produisez pas d’Exploration, validez directement pour passer au tour suivant.'),
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
      title: (t: TFunction) => t('Fin du premier tour'),
      text: (t: TFunction) => t('Nous sommes maintenant au tour 2, et une nouvelle phase de Draft débute. Le sens de passage des cartes est inversé à chaque tour.'),
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
      title: (t: TFunction) => t('Chaque tour se déroule ainsi'),
      text: (t: TFunction) => t('Vous avez jusqu’à la fin de la partie pour terminer la construction de vos cartes. Essayez de construire la Zone Portuaire rapidement, pour bénéficier de sa production ! La Société Secrète ne produit rien, vous pouvez sans risque attendre le tour 4 pour la terminer.'),
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
      title: (t: TFunction) => t('Surveillez vos adversaires'),
      text: (t: TFunction) => t('En cliquant sur vos adversaires, vous pouvez voir leur Empire. « Qui connaît son ennemi comme il se connaît, en cent combats ne sera point défait. » - Sun Tzu'),
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
      title: (t: TFunction) => t('À vous de jouer !'),
      text: (t: TFunction) => t('Vous pouvez maintenant finir la partie en faisant vos propres choix. Bonne chance !'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    }
  ]
]

const tutorialEndGame = {
  title: (t: TFunction) => t('Félicitations !'),
  text: (t: TFunction) => t('Vous avez terminé votre première partie ! Vous pouvez maintenant jouer avec vos amis, ou rencontrer d’autres joueurs via notre salon de rencontre sur Discord.'),
  boxTop: 81,
  boxLeft: 53,
  boxWidth: 87
}


export default TutorialPopup