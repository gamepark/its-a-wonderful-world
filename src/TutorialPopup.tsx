import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useActions, usePlayerId} from '@interlude-games/workshop'
import Move from './moves/Move'
import EmpireName from './material/empires/EmpireName'
import Button from './util/Button'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import tutorialArrowLight from './util/tutorial-arrow-light.png'
import tutorialArrowDark from './util/tutorial-arrow-dark.png'
import {useTheme} from 'emotion-theming'
import Theme, {LightTheme} from './Theme'
import {
  closePopupStyle, discordUri, hidePopupOverlayStyle, hidePopupStyle, platformUri, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupStyle,
  showPopupOverlayStyle,
  showPopupStyle
} from './util/Styles'
import GameView from './types/GameView'
import Phase from './types/Phase'
import {isOver} from './Rules'
import {resetTutorial} from './Tutorial'

const TutorialPopup: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const playerId = usePlayerId<EmpireName>()
  const actions = useActions<Move, EmpireName>()
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialDisplay, setTutorialDisplay] = useState(1)
  const moveTutorial = (deltaMessage: number) => {
    setTutorialIndex(tutorialIndex + deltaMessage)
    setTutorialDisplay(1)
  }
  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(1)
  }
  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber
    while (!tutorialDescription[currentStep]) {
      currentStep--
    }
    return tutorialDescription[currentStep][index]
  }
  useEffect(() => {
    if (previousActionNumber.current < actionsNumber) {
      if (tutorialDescription[actionsNumber]) {
        setTutorialIndex(0)
        setTutorialDisplay(1)
      }
    } else {
      setTutorialDisplay(0)
    }
    previousActionNumber.current = actionsNumber
  }, [actionsNumber, setTutorialIndex])
  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && currentMessage
  const tutorialRound = game.round === 1 || (game.round === 2 && game.phase === Phase.Draft )
  return (
    <>
      <div css={[popupOverlayStyle,displayPopup?showPopupOverlayStyle:hidePopupOverlayStyle(85,90),style]} >
      <div css={[popupStyle,displayPopup?showPopupStyle(currentMessage.boxTop, currentMessage.boxLeft, currentMessage.boxWidth):hidePopupStyle(85,90),theme.color === LightTheme ? popupLightStyle : popupDarkStyle,(currentMessage && currentMessage.boxTop<0)?popupBottomStyle(currentMessage.boxTop):popupTopStyle]}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(0)}><FontAwesomeIcon icon={faTimes}/></div>
          { currentMessage && <h2>{currentMessage.title(t)}</h2> }
          { currentMessage && <p>{currentMessage.text(t)}</p> }
          {tutorialIndex > 0 && <Button css={buttonStyle} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
          <Button onClick={() => moveTutorial(1)}>OK</Button>
        </div>
      </div>
      {
        !displayPopup && tutorialRound &&
        <Button css={resetStyle} onClick={() => resetTutorialDisplay()}>Afficher le Tutoriel</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <img alt={t('Tutorial Indicator')} src={theme.color === LightTheme ? tutorialArrowLight : tutorialArrowDark} draggable="false"
             css={[arrowStyle(currentMessage.arrowAngle),displayPopup?showArrowStyle(currentMessage.arrowTop, currentMessage.arrowLeft):hideArrowStyle]}/>
      }
      {
        isOver(game) &&
        <div css={[popupStyle,showPopupStyle(81, 53, 87),theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}>
          <h2>{tutorialEndGame.title(t)}</h2>
          <p>{tutorialEndGame.text(t)}</p>
          <Button css={buttonStyle} onClick={() => resetTutorial()}>Rejouer le tutoriel</Button>
          <Button css={buttonStyle} onClick={() => window.location.href = platformUri}>Lancer une partie avec des amis</Button>
          <Button onClick={() => window.location.href = discordUri}>Rejoindre le Discord</Button>
        </div>
      }
    </>
  )
}

const style = css`
    background-color:transparent;
`
const popupTopStyle = css`
    
`
const popupBottomStyle = (boxTop:number) => css`
    bottom : ${-boxTop}%;
    top:unset;
    transform: translate(-50%,0);
`

const resetStyle = css`
    position: absolute;
    text-align: center;
    bottom : 10%;
    right : 2%;
    font-size: 4em;
`

const buttonStyle = css`
    margin-right:1em;
`

const arrowStyle = (arrowAngle: number) => css`
    position: absolute;
    transform: rotate(${arrowAngle}deg);
    z-index : 102;
    transition:all .5s ease;
`

const showArrowStyle = (arrowTop: number, arrowLeft: number) => css`
    top : ${arrowTop}%;
    left: ${arrowLeft}%;
    width:20%;
`

const hideArrowStyle = css`
    top : 90%;
    left: 90%;
    width:0;
`


const tutorialDescription = {
  0: {
    0: {
      title: (t: TFunction) => t('Bienvenue dans le tutoriel de It’s a Wonderful World'),
      text: (t: TFunction) => t('Vous incarnez un Empire en expansion face à deux factions concurrentes.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 65,
      arrow: false
    },
    1: {
      title: (t: TFunction) => t('But du jeu'),
      text: (t: TFunction) => t('Le jeu se joue en 4 tours. A la fin de la partie, le joueur ayant le plus de points de victoire est déclaré vainqueur.'),
      boxTop: 48,
      boxLeft: 45,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 14
    },
    2: {
      title: (t: TFunction) => t('Phase de Draft'),
      text: (t: TFunction) => t('Chaque tour se compose de 3 phase. Lors de la première phase, le Draft, vous choisissez 1 carte avant de passer les cartes restantes à votre voisin.'),
      boxTop: 48,
      boxLeft: 50,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 22
    },
    3: {
      title: (t: TFunction) => t('Votre stratégie'),
      text: (t: TFunction) => t('Nous allons fonder un empire tourné vers la Finance (bâtiments jaunes), et le Monument national s’intègre très bien à cette stratégie.'),
      boxTop: 81,
      boxLeft: 51,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    4: {
      title: (t: TFunction) => t('Choisissez le Monument National'),
      text: (t: TFunction) => t('Vous pouvez faire glisser la carte de gauche vers la zone de Draft ou cliquer sur cette carte pour zoomer dessus et sélectionner l’action Choisir.'),
      boxTop: -39,
      boxLeft: 43,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 61,
      arrowLeft: 11
    }
  },
  1: {
    0: {
      title: (t: TFunction) => t('Choisissez une deuxième carte'),
      text: (t: TFunction) => t('Vous venez de recevoir les cartes de votre voisin de droite, il faut à nouveau choisir une carte avant de passer le reste sur votre gauche. '),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 70,
      arrow: false
    },
    1: {
      title: (t: TFunction) => t('Choisissez le Centre de Propagande'),
      text: (t: TFunction) => t('Le Centre de Propagande permet de produire un Or par bâtiment jaune construit. Ces cartes permettent d’amorcer la production et deviennent très fortes en fin de partie.'),
      boxTop: -40,
      boxLeft: 46,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 31
    }
  },
  2: {
    0: {
      title: (t: TFunction) => t('Choisissez la Société Secrète'),
      text: (t: TFunction) => t('Cette carte est intéressante pour notre stratégie car elle marque des points sur les jetons Financiers comme notre Empire.'),
      boxTop: -40,
      boxLeft: 50,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 27
    },
    1: {
      title: (t: TFunction) => t('Choisissez la Société Secrète'),
      text: (t: TFunction) => t('Elle ne coûte pas très cher, et j’aurai le temps pour la construire car elle ne m’apporte rien en début de partie.'),
      boxTop: -40,
      boxLeft: 50,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 27
    }

  },
  3: {
    0: {
      title: (t: TFunction) => t('Choisissez le Complexe Industriel'),
      text: (t: TFunction) => t('Il est important de lancer son moteur de production dès le premier tour. Le Complexe Industriel s’inscrit très bien dans la stratégie de notre Empire de départ.'),
      boxTop: -40,
      boxLeft: 50,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 40
    }
  },
  4: {
    0: {
      title: (t: TFunction) => t('Choisissez les Éoliennes'),
      text: (t: TFunction) => t('Il n’y a plus grand chose d’intéressant pour ma stratégie. Je choisis les Éoliennes pour les recycler.'),
      boxTop: -40,
      boxLeft: 45,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 27
    },
    1: {
      title: (t: TFunction) => t('Choisissez les Éoliennes'),
      text: (t: TFunction) => t('Le recyclage de son Énergie (cube noir) me permettra de construire le Complexe Industriel, car mon Empire n’en produit pas.'),
      boxTop: -40,
      boxLeft: 45,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 27
    }
  },
  5: {
    0: {
      title: (t: TFunction) => t('Choisissez le Trésor des Templiers'),
      text: (t: TFunction) => t('De la même façon, comme il n’y a plus grand chose d’intéressant pour ma stratégie, je choisis le Trésor des Templiers pour le recycler.'),
      boxTop: -40,
      boxLeft: 45,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 31
    },
    1: {
      title: (t: TFunction) => t('Choisissez le Trésor des Templiers'),
      text: (t: TFunction) => t('Le recyclage de son Or (cube jaune) m’aidera à construire le Centre de Propagande.'),
      boxTop: -40,
      boxLeft: 45,
      boxWidth: 70,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 31
    }
  },
  6: {
    0: {
      title: (t: TFunction) => t('Fin du Draft'),
      text: (t: TFunction) => t('J’ai récupéré un Zeppelin en dernière carte, qui ne me servira pas à grand chose.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 50,
      arrow: false
    },
    1: {
      title: (t: TFunction) => t('Phase de Planification'),
      text: (t: TFunction) => t('Je dois maintenant choisir quelles cartes je mets en construction et quelles cartes je recycle.'),
      boxTop: 48,
      boxLeft: 50,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 22
    },
    2: {
      title: (t: TFunction) => t('Mettre en Construction le Monument National'),
      text: (t: TFunction) => t('Je peux commencer par mettre le Monument National dans la zone de construction.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    },
    3: {
      title: (t: TFunction) => t('Mettre en Construction le Monument National'),
      text: (t: TFunction) => t('Comme lors de la phase de Draft, je peux sois faire glisser la carte vers la zone orange, soit cliquer dessus et sélectionner l’action Construire.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  7: {
    0: {
      title: (t: TFunction) => t('Mettre en Construction le Centre de Propagande'),
      text: (t: TFunction) => t('Je glisse également le Centre de Propagande en zone de construction.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  8: {
    0: {
      title: (t: TFunction) => t('Mettre en Construction la Société Secrète'),
      text: (t: TFunction) => t('Je glisse également la Société Secrète en zone de construction.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  9: {
    0: {
      title: (t: TFunction) => t('Mettre en Construction le Complexe industriel'),
      text: (t: TFunction) => t('Je glisse également le Complexe industriel en zone de construction.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  10: {
    0: {
      title: (t: TFunction) => t('Mettre les Éoliennes au recyclage'),
      text: (t: TFunction) => t('Je glisse maintenant les Éoliennes dans la zone de recyclage, au niveau des cercles de Ressources. Je pourrais aussi cliquer sur la carte et sélectionner l’action Recycler.'),
      boxTop: -40,
      boxLeft: 34,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  11: {
    0: {
      title: (t: TFunction) => t('Placer l’Énergie générée sur le Complexe Industriel'),
      text: (t: TFunction) => t('Ce recyclage a généré un cube noir dans la zone de ressource, je peux le faire glisser sur le Complexe industriel.'),
      boxTop: 30,
      boxLeft: 68,
      boxWidth: 55,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 24,
      arrowLeft: 29
    }
  },
  12: {
    0: {
      title: (t: TFunction) => t('Mettre le Trésor des Templiers au recyclage'),
      text: (t: TFunction) => t('Je glisse maintenant le Trésor des Templiers dans la Zone de Recyclage.'),
      boxTop: -40,
      boxLeft: 24,
      boxWidth: 40,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  13: {
    0: {
      title: (t: TFunction) => t('Placer l’Or générée sur le Centre de Propagande'),
      text: (t: TFunction) => t('Ce recyclage a généré un cube jaune dans la zone de ressource, je peux le faire glisser sur le Centre de Propagande.'),
      boxTop: 75,
      boxLeft: 60,
      boxWidth: 40,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 40,
      arrowLeft: 46.5
    }
  },
  14: {
    0: {
      title: (t: TFunction) => t('Mettre le Zeppelin au recyclage'),
      text: (t: TFunction) => t('Il ne reste plus que le Zeppelin à faire glisser dans la Zone de Recyclage.'),
      boxTop: -40,
      boxLeft: 27,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 180,
      arrowTop: 60,
      arrowLeft: 7
    }
  },
  15: {
    0: {
      title: (t: TFunction) => t('Le cube bleu généré est placé en recyclage sur la carte Empire'),
      text: (t: TFunction) => t('Le cube bleu ne peut pas être placé sur une carte en Construction. Il est donc automatiquement transféré sur ma carte Empire.'),
      boxTop: 77,
      boxLeft: 39,
      boxWidth: 46,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    1: {
      title: (t: TFunction) => t('Cubes de la carte Empire'),
      text: (t: TFunction) => t('Les ressources de ma carte Empire ne sont plus utilisables pour construire des cartes Développement.'),
      boxTop: 80,
      boxLeft: 39,
      boxWidth: 46,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    2: {
      title: (t: TFunction) => t('Génération de Krystallium'),
      text: (t: TFunction) => t('Cependant, au bout de 5 ressources sur ma carte Empire (quelle que soit leur couleur), je peux les transformer en Krystallium (cube rouge).'),
      boxTop: 80,
      boxLeft: 39,
      boxWidth: 46,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    3: {
      title: (t: TFunction) => t('Utilisation du Krystallium'),
      text: (t: TFunction) => t('Le Krystallium est la seule ressource qui peut être stockée pour être utilisée plus tard à la place de n’importe quelle ressource.'),
      boxTop: 80,
      boxLeft: 39,
      boxWidth: 46,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    4: {
      title: (t: TFunction) => t('Coût en Krystallium'),
      text: (t: TFunction) => t('Certaines cartes comme la Société Secrète, nécessitent du Krystallium pour être construites.'),
      boxTop: 54,
      boxLeft: 57,
      boxWidth: 37,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 48,
      arrowLeft: 27
    },
    5: {
      title: (t: TFunction) => t('Fin de la Phase de Planification'),
      text: (t: TFunction) => t('Je peux maintenant valider pour passer à la Phase de Production.'),
      boxTop: 49,
      boxLeft: 53,
      boxWidth: 37,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    }
  },
  16: {
    0: {
      title: (t: TFunction) => t('Phase de Production'),
      text: (t: TFunction) => t('Lors de la Phase de Production, tous les Empires produisent leurs ressources dans l’ordre de la chaîne de Production.'),
      boxTop: 48,
      boxLeft: 50,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 22
    },
    1: {
      title: (t: TFunction) => t('Production des Matériaux'),
      text: (t: TFunction) => t('Tous les joueurs commencent par produire des Matériaux (cubes blancs). J’en produis 3.'),
      boxTop: 70,
      boxLeft: 22,
      boxWidth: 43,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 40,
      arrowLeft: 6.8
    },
    2: {
      title: (t: TFunction) => t('Bonus de Suprématie industrielle'),
      text: (t: TFunction) => t('C’est moi qui produit le plus de Matériaux, je gagne donc un jeton Financier.'),
      boxTop: 55,
      boxLeft: 22,
      boxWidth: 43,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 25,
      arrowLeft: 6.8
    },
    3: {
      title: (t: TFunction) => t('Jetons Financiers'),
      text: (t: TFunction) => t('Chaque Financier rapporte 1 point de victoire. Mon Empire me permet de les scorer une deuxième fois. Si je parviens à construire la société secrète, je pourrai les compter une troisième fois.  Chaque jeton Financier me rapportera donc 3 points de Victoire.'),
      boxTop: 79,
      boxLeft: 54,
      boxWidth: 76,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    4: {
      title: (t: TFunction) => t('Utilisation des ressources'),
      text: (t: TFunction) => t('Je pourrais mettre mes 3 Matériaux sur le Monument National mais je choisis plutôt de construire le Complexe Inudtriel.'),
      boxTop: 51,
      boxLeft: 68,
      boxWidth: 41,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 45,
      arrowLeft: 36
    },
    5: {
      title: (t: TFunction) => t('Déplacer les ressources'),
      text: (t: TFunction) => t('Je peux déplacer mes ressources une par une, ou cliquer sur la carte pour sélectionner les actions du mode zoom, ou encore faire un clic long sur la carte pour y placer toutes les ressources possibles.'),
      boxTop: 51,
      boxLeft: 68,
      boxWidth: 41,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 45,
      arrowLeft: 36
    }
  },
  19: {
    0: {
      title: (t: TFunction) => t('Gain immédiat'),
      text: (t: TFunction) => t('Je gagne immédiatement un jeton Financier. Le Bonus de production blanc arrive trop tard, il sera valable pour les prochains tours, mais je pourrai profiter de sa production jaune dès ce tour-ci.'),
      boxTop: 73,
      boxLeft: 43,
      boxWidth: 63,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 66.3,
      arrowLeft: 0
    },
    1: {
      title: (t: TFunction) => t('Validation pour passer à la production d’Énergie'),
      text: (t: TFunction) => t('Une fois ces manipulations effectuées, je peux maintenant valider pour passer à l’étape suivante. Quand tout le monde aura validé, tous les joueurs produiront de l’Énergie.'),
      boxTop: 48,
      boxLeft: 53,
      boxWidth: 77,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    }
  },
  20: {
    0: {
      title: (t: TFunction) => t('Production de l’Énergie'),
      text: (t: TFunction) => t('Je ne produis pas d’Énergie, je peux donc directement valider pour passer à la production suivante.'),
      boxTop: 48,
      boxLeft: 53,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    },
    1: {
      title: (t: TFunction) => t('Bonus de Suprématie Militaire'),
      text: (t: TFunction) => t('La République d’Europa et la Fédération d’Asie produisent 1 Énergie chacune. À égalité de production, personne de gagne le Bonus de Suprématie (jeton Général).'),
      boxTop: 44,
      boxLeft: 44,
      boxWidth: 53,
      arrow: true,
      arrowAngle: 90,
      arrowTop: 37,
      arrowLeft: 66
    }
  },
  21: {
    0: {
      title: (t: TFunction) => t('Production de la Science'),
      text: (t: TFunction) => t('Je ne produis pas de Science, je peux donc directement valider pour passer à la production suivante.'),
      boxTop: 48,
      boxLeft: 53,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    },
    1: {
      title: (t: TFunction) => t('Bonus de Suprématie Scientifique'),
      text: (t: TFunction) => t('La République d’Europa est la seule à produire de la Science, elle gagne donc soit un jeton Financier, soit un jeton Général, au choix.'),
      boxTop: 57,
      boxLeft: 50,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 25,
      arrowLeft: 33.3
    }
  },
  22: {
    0: {
      title: (t: TFunction) => t('Production de l’Or'),
      text: (t: TFunction) => t('Je produis 2 Or (un grâce à mon Empire et un grâce à mon Complexe Industriel) : ils me permettent de terminer le Centre de Propagande.'),
      boxTop: 72,
      boxLeft: 53,
      boxWidth: 51,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 40,
      arrowLeft: 46.4
    },
    1: {
      title: (t: TFunction) => t('Bonus de Suprématie Financière'),
      text: (t: TFunction) => t('La Fédération d’Asie produit 1 Or de plus que moi et récupère donc un jeton Financier à ma place. Il faudra que cela change !'),
      boxTop: 53,
      boxLeft: 48,
      boxWidth: 45,
      arrow: true,
      arrowAngle: 90,
      arrowTop: 46,
      arrowLeft: 66
    }
  },
  24: {
    0: {
      title: (t: TFunction) => t('Production de l’Or'),
      text: (t: TFunction) => t('Mon nouveau bonus de production arrive trop tard pour ce tour, mais me servira pour les tours suivants. Ce genre de carte est très puissante en fin de partie.'),
      boxTop: 73,
      boxLeft: 37,
      boxWidth: 49,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 66.8,
      arrowLeft: 1
    },
    1: {
      title: (t: TFunction) => t('Validation pour passer à la Production d’Exploration'),
      text: (t: TFunction) => t('Je peux maintenant valider pour passer à l’étape suivante.'),
      boxTop: 45,
      boxLeft: 53,
      boxWidth: 65,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    }
  },
  25: {
    0: {
      title: (t: TFunction) => t('Production de l’Exploration'),
      text: (t: TFunction) => t('Je ne produis pas d’Exploration, je peux donc directement valider pour passer au tour suivant.'),
      boxTop: 47,
      boxLeft: 53,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 45
    }
  },
  26: {
    0: {
      title: (t: TFunction) => t('Fin du premier tour'),
      text: (t: TFunction) => t('On déplace le marqueur de tour et on le retourne pour traduire le fait qu’on change de sens pour le Draft.'),
      boxTop: 47,
      boxLeft: 30,
      boxWidth: 50,
      arrow: true,
      arrowAngle: 0,
      arrowTop: 17,
      arrowLeft: 14
    },
    1: {
      title: (t: TFunction) => t('Moteur de Production'),
      text: (t: TFunction) => t('Idéalement, il faut réussir à construire au moins une carte développement au terme du premier tour pour lancer son moteur de production.'),
      boxTop: 73,
      boxLeft: 40,
      boxWidth: 49,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 66.8,
      arrowLeft: 4
    },
    2: {
      title: (t: TFunction) => t('Chaque tour se déroule ainsi'),
      text: (t: TFunction) => t('J’ai jusqu’à la fin de la partie pour construire les cartes encore en Construction. Il faut donc construire en priorité les cartes qui produisent des ressources, et garder les cartes qui rapportent des points de victoire pour la fin.'),
      boxTop: 34,
      boxLeft: 63,
      boxWidth: 55,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 25,
      arrowLeft: 24
    },
    3: {
      title: (t: TFunction) => t('Abandonner un Projet en Construction'),
      text: (t: TFunction) => t('Si je souhaite abandonner une carte en Construction, je peux la recycler à tout moment mais son bonus de recyclage va sur ma carte Empire, pour produire du Krystallium.'),
      boxTop: 80,
      boxLeft: 46,
      boxWidth: 60,
      arrow: true,
      arrowAngle: 270,
      arrowTop: 76,
      arrowLeft: 4
    },
    4: {
      title: (t: TFunction) => t('Prenez les commandes'),
      text: (t: TFunction) => t('Vous pouvez maintenant aller au bout de votre partie en faisant vos propres choix. On se retrouve lors du comptage des points pour faire le debrief. Bonne partie !'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 67,
      arrow: false
    }
  }
}

const tutorialEndGame = {
    title: (t: TFunction) => t('Bravo, vous venez de terminer cette partie de It’s a Wonderful World'),
    text: (t: TFunction) => t('Si vous voulez vous entraîner encore un peu, vous pouvez recommencer le tutoriel. Sinon, vous pouvez jouer avec des amis ou trouver des joueurs sur le Discord de la communauté.')
}


export default TutorialPopup