import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { ItsAWonderfulWorldOptions } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { CustomMoveType } from '@gamepark/its-a-wonderful-world/material/CustomMoveType'
import { Development } from '@gamepark/its-a-wonderful-world/material/Development'
import { EmpireSide } from '@gamepark/its-a-wonderful-world/material/EmpireSide'
import { LocationType } from '@gamepark/its-a-wonderful-world/material/LocationType'
import { MaterialType } from '@gamepark/its-a-wonderful-world/material/MaterialType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isCreateItem, isCustomMoveType, isEndPlayerTurn, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { characterTokenDescription } from '../material/CharacterTokenDescription.tsx'
import { resourceIcons } from '../panels/Images'
import { TutorialSetup } from './TutorialSetup'

// ── Helper types & filter functions ──────────────────────────────────────

const me = Empire.NoramStates
const player2 = Empire.RepublicOfEurope
const player3 = Empire.FederationOfAsia

type CardId = { front: Development }
type Filter = (move: MaterialMove, game: MaterialGame) => boolean

const cardFront = (game: MaterialGame, type: MaterialType, index: number): Development | undefined =>
  (game.items[type]?.[index]?.id as CardId | undefined)?.front

const chooseCard =
  (dev: Development): Filter =>
  (move, game) =>
    isMoveItemType(MaterialType.DevelopmentCard)(move) &&
    move.location.type === LocationType.DraftArea &&
    cardFront(game, MaterialType.DevelopmentCard, move.itemIndex) === dev

const slateCard =
  (dev: Development): Filter =>
  (move, game) =>
    isMoveItemType(MaterialType.DevelopmentCard)(move) &&
    move.location.type === LocationType.ConstructionArea &&
    cardFront(game, MaterialType.DevelopmentCard, move.itemIndex) === dev

const recycleCard =
  (dev: Development): Filter =>
  (move, game) =>
    isMoveItemType(MaterialType.DevelopmentCard)(move) &&
    move.location.type === LocationType.Discard &&
    cardFront(game, MaterialType.DevelopmentCard, move.itemIndex) === dev

const placeResource =
  (dev: Development, space?: number): Filter =>
  (move, game) =>
    isMoveItemType(MaterialType.ResourceCube)(move) &&
    move.location.type === LocationType.ConstructionCardCost &&
    cardFront(game, MaterialType.DevelopmentCard, move.location.parent!) === dev &&
    (space === undefined || move.location.x === space)

const placeResourceOrAll =
  (dev: Development, space?: number): Filter =>
  (move, game) =>
    placeResource(dev, space)(move, game) ||
    (isCustomMoveType(CustomMoveType.PlaceResources)(move) &&
      cardFront(game, MaterialType.DevelopmentCard, move.data as number) === dev)

const buildCard =
  (dev: Development): Filter =>
  (move, game) =>
    (isCustomMoveType(CustomMoveType.PlaceResources)(move) &&
      cardFront(game, MaterialType.DevelopmentCard, move.data as number) === dev) ||
    (isMoveItemType(MaterialType.DevelopmentCard)(move) &&
      move.location.type === LocationType.ConstructedDevelopments &&
      cardFront(game, MaterialType.DevelopmentCard, move.itemIndex) === dev)

const chooseCharacter =
  (character: Character): Filter =>
  (move) =>
    isCreateItem(move) && move.itemType === MaterialType.CharacterToken && move.item?.id === character

const validate: Filter = (move) => isEndPlayerTurn(move)

// ── Tutorial class ──────────────────────────────────────────────────────

export class Tutorial extends MaterialTutorial<Empire, MaterialType, LocationType> {
  options: ItsAWonderfulWorldOptions = {
    players: [{ id: me }, { id: player2 }, { id: player3 }],
    empiresSide: EmpireSide.A,
    corruptionAndAscension: false,
    warAndPeace: false
  }

  setup = new TutorialSetup()

  players = [{ id: me }, { id: player2 }, { id: player3 }]

  // ── Steps ──────────────────────────────────────────────────────────────

  steps: TutorialStep<Empire, MaterialType, LocationType>[] = [
    // ═══════════════════════════════════════════════════════════════
    // INTRO (popup-only steps before any move)
    // ═══════════════════════════════════════════════════════════════

    // 0
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.welcome', "Welcome to the tutorial for It's a Wonderful World")}</strong>
            <br />
            {t(
              'tuto.context',
              "In It's a Wonderful World, you are leading an expanding Empire. You must choose the path that will get you to develop faster and better than your competitors!"
            )}
          </>
        )
      }
    },
    // 1
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.your.empire.title', 'Your Empire')}</strong>
            <br />
            {t('tuto.your.empire', 'This is your Empire: the Noram States.')}
          </>
        ),
        position: { x: 25, y: -28 },
        size: { width: 60 }
      }
    },
    // 2
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.your.opponents.title', 'Your opponents')}</strong>
            <br />
            {t(
              'tuto.your.opponents',
              'In this tutorial, you play against 2 opponents controlled by the machine: the Republic of Europe and Federation of Asia.'
            )}
          </>
        ),
        position: { x: 25, y: -7 },
        size: { width: 60 }
      }
    },
    // 3
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.goal.title', 'Goal of the game')}</strong>
            <br />
            {t(
              'tuto.goal',
              'The game consists of choosing and building Development cards. Some of these cards earn victory points. The player with the most victory points at the end of the game wins!'
            )}
          </>
        )
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(me)]
      })
    },
    // 4
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.flow.game.title', 'Flow of the game')}</strong>
            <br />
            {t(
              'tuto.flow.game',
              'A game is played in 4 rounds. We will guide you through the first round to teach you how to play, then you will be free to make your own choices!'
            )}
          </>
        ),
        position: { x: -30, y: -13 }
      }
    },
    // 5
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.flow.round.title', 'Flow of a round')}</strong>
            <br />
            {t('tuto.flow.round', 'A round consists of 3 phases that players play simultaneously: Draft, Planning and Production.')}
          </>
        ),
        position: { x: -25, y: -13 }
      }
    },
    // 6
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.draft.phase.title', 'Draft phase')}</strong>
            <br />
            {t('tuto.draft.phase', 'Each player receives 7 cards. You must choose 1 card and pass the rest to the Republic of Europe.')}
          </>
        ),
        position: { x: -5, y: 8 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(me)]
      })
    },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 1: choose Secret Society
    // ═══════════════════════════════════════════════════════════════

    // 7
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.first.card.title', 'Choose your first card')}</strong>
            <br />
            {t('tuto.choose.first.card', 'Move the Secret Society to your draft area. We will see later why this card is strategic for you.')}
          </>
        ),
        position: { x: 0, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.SecretSociety)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.SecretSociety) }
    },
    // 8 - RoE auto-choose
    { move: { player: player2, filter: chooseCard(Development.CenterOfTheEarth) } },
    // 9 - FoA auto-choose
    { move: { player: player3, filter: chooseCard(Development.LunarBase) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 2: choose Industrial Complex
    // ═══════════════════════════════════════════════════════════════

    // 10
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.simultaneous.choice.title', 'Simultaneous choice')}</strong>
            <br />
            {t(
              'tuto.simultaneous.choice',
              'As you can see, the Federation of Asia has passed you 6 cards. The players choose 1 card simultaneously and pass the rest to the next player.'
            )}
          </>
        ),
        position: { x: -5, y: 5 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DevelopmentCard).location(LocationType.PlayerHand).player(me)]
      })
    },
    // 11
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.draft.direction.title', 'Direction of the draft')}</strong>
            <br />
            {t('tuto.draft.direction', 'These arrows indicate the direction of the cards for this round.')}
          </>
        ),
        position: { x: 30, y: -15 },
        size: { width: 70 }
      }
    },
    // 12
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.industrial.complex.title', 'Choose the Industrial Complex')}</strong>
            <br />
            {t('tuto.choose.industrial.complex', 'This card will provide you with a good start.')}
          </>
        ),
        position: { x: 0, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.IndustrialComplex) }
    },
    // 13 - RoE auto
    { move: { player: player2, filter: chooseCard(Development.MilitaryBase) } },
    // 14 - FoA auto
    { move: { player: player3, filter: chooseCard(Development.WorldCongress) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 3: choose Propaganda Center
    // ═══════════════════════════════════════════════════════════════

    // 15
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.cards.production.title', 'Cards production')}</strong>
            <br />
            {t(
              'tuto.cards.production',
              'Some cards produce resources once built. For example, the Industrial Complex will produce a gray resource (Materials) and a yellow one (Gold).'
            )}
          </>
        ),
        position: { x: 10, y: 10 }
      },
      focus: (game) => {
        const card = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.DraftArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        const index = card.getIndex()
        return {
          materials: [card],
          locations: index >= 0 ? [{ type: LocationType.DevelopmentCardProduction, parent: index }] : []
        }
      }
    },
    // 16
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.cost', 'Construction cost')}</strong>
            <br />
            {t(
              'tuto.construction.cost',
              'The resources will allow you to build the cards. For example, the Industrial Complex costs 3 Materials (in grey) and one Energy (in black).'
            )}
          </>
        ),
        position: { x: 10, y: 10 }
      },
      focus: (game) => {
        const index = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.DraftArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
          .getIndex()
        return {
          locations:
            index >= 0
              ? [0, 1, 2, 3].map((x) => ({
                  type: LocationType.DevelopmentCardCostSpace,
                  parent: index,
                  x
                }))
              : []
        }
      }
    },
    // 17
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.empire.production.title', 'Production of the Empire')}</strong>
            <br />
            {t('tuto.empire.production', "Fortunately, you don't start without production! Your Empire will produce 3 Materials and 1 Gold every round.")}
          </>
        ),
        position: { x: -30, y: 25 }
      },
      focus: () => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        }
      })
    },
    // 18
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.propaganda.center.title', 'Now choose the Propaganda Center')}</strong>
            <br />
            {t('tuto.choose.propaganda.center', 'Thanks to this card, you will be able to produce more and more Gold!')}
          </>
        ),
        position: { x: 0, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.PropagandaCenter) }
    },
    // 19 - RoE auto
    { move: { player: player2, filter: chooseCard(Development.CityOfAgartha) } },
    // 20 - FoA auto
    { move: { player: player3, filter: chooseCard(Development.ArkOfTheCovenant) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 4: choose Harbor Zone
    // ═══════════════════════════════════════════════════════════════

    // 21
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.proportional.production.title', 'Proportional production')}</strong>
            <br />
            {t('tuto.proportional.production', 'Once built, the Propaganda Center will produce as much Gold as you have yellow cards built.')}
          </>
        ),
        position: { x: 24, y: 10 }
      },
      focus: (game) => {
        const card = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.DraftArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        const index = card.getIndex()
        return {
          materials: [card],
          locations: index >= 0 ? [{ type: LocationType.DevelopmentCardProduction, parent: index }] : []
        }
      }
    },
    // 22
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.types.of.cards.title', 'Types of cards')}</strong>
            <br />
            {t(
              'tuto.types.of.cards',
              'The Secret Society and the Propaganda Center are both yellow cards. The symbol at the bottom right of the cards is a reminder of their type.'
            )}
          </>
        ),
        position: { x: 24, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.SecretSociety || item.id?.front === Development.PropagandaCenter)
        ]
      })
    },
    // 23
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.harbor.zone.title', 'Now choose the Harbor Zone')}</strong>
            <br />
            {t('tuto.choose.harbor.zone', 'It is expensive to build (5 Gold), but it will then produce a lot each turn (2 Materials and 2 Gold).')}
          </>
        ),
        position: { x: 5, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.HarborZone)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.HarborZone) }
    },
    // 24 - RoE auto
    { move: { player: player2, filter: chooseCard(Development.TransportationNetwork) } },
    // 25 - FoA auto
    { move: { player: player3, filter: chooseCard(Development.Juggernaut) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 5: choose Wind Turbines
    // ═══════════════════════════════════════════════════════════════

    // 26
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.wind.turbines.title', 'Choose the Wind Turbines')}</strong>
            <br />
            {t('tuto.choose.wind.turbines', 'This card is not necessarily interesting to build, but we will be able to make good use of it anyway!')}
          </>
        ),
        position: { x: 0, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.WindTurbines)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.WindTurbines) }
    },
    // 27 - RoE auto
    { move: { player: player2, filter: chooseCard(Development.FinancialCenter) } },
    // 28 - FoA auto
    { move: { player: player3, filter: chooseCard(Development.RecyclingPlant) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 6: choose Universal Exposition
    // ═══════════════════════════════════════════════════════════════

    // 29
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.recyclingBonus', 'Recycling bonus')}</strong>
            <br />
            {t(
              'tuto.recycling.bonus',
              'During Planning, each card can offer you a resource if you discard it. For the Wind Turbine, it is an Energy, it is indicated here.'
            )}
          </>
        ),
        position: { x: 5, y: -20 }
      },
      focus: (game) => {
        const card = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.DraftArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.WindTurbines)
        const index = card.getIndex()
        return {
          materials: [card],
          locations: index >= 0 ? [{ type: LocationType.DevelopmentCardRecyclingBonus, parent: index }] : []
        }
      }
    },
    // 30
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.recyclingBonus', 'Recycling bonus')}</strong>
            <br />
            {t('tuto.recycling.bonus.energy', "It's a good thing: we lacked one Energy to build the Industrial Complex!")}
          </>
        ),
        position: { x: 10, y: 5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ]
      })
    },
    // 31
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.choose.universal.exposition.title', 'Choose the Universal Exposition')}</strong>
            <br />
            {t('tuto.choose.universal.exposition', 'As with the Wind Turbine, we will be able to recycle this card, but this time to win one Gold.')}
          </>
        ),
        position: { x: 0, y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.PlayerHand)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.UniversalExposition)
        ],
        highlight: true
      }),
      move: { player: me, filter: chooseCard(Development.UniversalExposition) }
    },
    // 32 - RoE auto
    { move: { player: player2, filter: chooseCard(Development.HumanCloning) } },
    // 33 - FoA auto
    { move: { player: player3, filter: chooseCard(Development.OffshoreOilRig) } },

    // ═══════════════════════════════════════════════════════════════
    // DRAFT PICK 7: auto-pick (Zeppelin) + transition to Planning
    // (handled automatically by ChooseDevelopmentCardRule)
    // ═══════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════
    // PLANNING PHASE
    // ═══════════════════════════════════════════════════════════════

    // 34
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.end.of.draft.title', 'End of Draft')}</strong>
            <br />
            {t('tuto.end.of.draft', 'You have automatically retrieved the last card passed by the Federation of Asia, a Zeppelin.')}
          </>
        ),
        position: { x: 15, y: 5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.Zeppelin)
        ]
      })
    },
    // 35
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.planning.phase.title', 'Planning phase')}</strong>
            <br />
            {t(
              'tuto.planning.phase',
              'We now move on to the second phase of the round, the Planning: each card chosen in the previous phase must be put under construction or recycled.'
            )}
          </>
        ),
        position: { x: -10, y: -13 }
      }
    },

    // 36 - Slate Industrial Complex
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.slate.industrial.complex.title', "Let's start with the Industrial Complex")}</strong>
            <br />
            {t('tuto.slate.industrial.complex', 'We want to build this card. So move it to the Construction Area.')}
          </>
        ),
        position: { x: -10, y: -21 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ],
        highlight: true
      }),
      move: { player: me, filter: slateCard(Development.IndustrialComplex) }
    },

    // 37 - Slate Propaganda Center
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.slate.propaganda.center.title', 'Start the construction of the Propaganda Center.')}</strong>
            <br />
            {t('tuto.slate.propaganda.center', 'Also slate the Propaganda Center into the Construction Area.')}
          </>
        ),
        position: { x: -10, y: -21 }
      },
      move: { player: me, filter: slateCard(Development.PropagandaCenter) }
    },

    // 38 - Victory points info
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.victoryPoints', 'Victory points')}</strong>
            <br />
            {t('tuto.victory.points', 'At this location, you can see that the Propaganda Center earns 1 victory point at the end of the game, if built.')}
          </>
        ),
        position: { x: 10, y: 0 }
      },
      focus: (game) => {
        const index = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.ConstructionArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
          .getIndex()
        return {
          locations: index >= 0 ? [{ type: LocationType.DevelopmentCardVictoryPoints, parent: index }] : []
        }
      }
    },

    // 39 - Slate Harbor Zone
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.slate.harbor.zone.title', 'Put the Harbor Zone under Construction')}</strong>
            <br />
            {t(
              'tuto.slate.harbor.zone',
              'Once built, this card will produce 2 Materials and 2 Gold each turn, but will also yield 2 victory points at the end of the game.'
            )}
          </>
        ),
        position: { x: -10, y: -23 }
      },
      move: { player: me, filter: slateCard(Development.HarborZone) }
    },

    // 40 - Character tokens info
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.character.tokens.title', 'Character tokens')}</strong>
            <br />
            {t('tuto.character.tokens', 'Another way to score victory points is to accumulate Financiers and Generals. Each gives you 1 point.')}
          </>
        ),
        position: { x: -10 }
      },
      focus: () => ({
        staticItems: {
          [MaterialType.CharacterToken]: characterTokenDescription.staticItems
        }
      })
    },

    // 41 - Your strategy info
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.your.strategy.title', 'Your strategy')}</strong>
            <br />
            {t('tuto.your.strategy', 'Your Empire gives you a strategic bonus: each Financier token earns you an extra point!')}
          </>
        ),
        position: { x: -30, y: 25 }
      },
      focus: () => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        }
      })
    },

    // 42 - Slate Secret Society
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.slate.secret.society.title', 'Start the Construction of the Secret Society')}</strong>
            <br />
            {t(
              'tuto.slate.secret.society',
              'The Secret Society fits perfectly into your strategy, since once built it will also earn you 1 point per Financier token: put it under construction.'
            )}
          </>
        ),
        position: { x: -10, y: -23 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.SecretSociety)
        ],
        highlight: true
      }),
      move: { player: me, filter: slateCard(Development.SecretSociety) }
    },

    // 43 - Other strategies (universal exposition VP)
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.other.strategies.title', 'Other strategies...')}</strong>
            <br />
            {t('tuto.other.strategies', 'This card earns 3 victory points per green building built.')}
          </>
        ),
        position: { x: 8, y: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.UniversalExposition)
        ]
      })
    },

    // 44 - Other strategies (Financier cost)
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.other.strategies.title', 'Other strategies...')}</strong>
            <br />
            {t('tuto.other.strategies.cost', 'However, to build it we would have to spend 2 precious Financiers!')}
          </>
        ),
        position: { x: 8, y: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.UniversalExposition)
        ]
      })
    },

    // 45 - Recycle Universal Exposition
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.recycle.universal.exposition.title', 'Recycle the Universal Exposition')}</strong>
            <br />
            {t('tuto.recycle.universal.exposition', 'Drag this card to the Recycling Zone, above the Construction Zone: it will be more useful this way.')}
          </>
        ),
        position: { x: 8, y: 25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.UniversalExposition)
        ],
        locations: [{ type: LocationType.Discard }],
        highlight: true
      }),
      move: { player: me, filter: recycleCard(Development.UniversalExposition) }
    },

    // 46 - Recycling bonus Gold obtained
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.recyclingBonus', 'Recycling bonus')}</strong>
            <br />
            {t(
              'tuto.recycling.bonus.gold',
              'By recycling the Universal Exposition during the Planning phase, we obtained a Gold that can be used immediately.'
            )}
          </>
        ),
        position: { x: 10, y: 5 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me)]
      })
    },

    // 47 - Place Gold on Propaganda Center
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.place.gold.propaganda.title', 'Place the Gold on the Propaganda Center')}</strong>
            <br />
            {t('tuto.place.gold.propaganda', 'Drag this yellow cube to your Propaganda Center to start building it.')}
          </>
        ),
        position: { x: 10, y: 5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me),
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        ],
        highlight: true
      }),
      move: { player: me, filter: placeResourceOrAll(Development.PropagandaCenter, 0) }
    },

    // 48 - Yellow cube is there
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.yellow.cube.there.title', 'The yellow cube is there')}</strong>
            <br />
            {t('tuto.yellow.cube.there', 'You only need 2 more Gold to complete the construction of the Propaganda Center.')}
          </>
        ),
        position: { x: 10, y: 5 }
      },
      focus: (game) => {
        const card = this.material(game, MaterialType.DevelopmentCard)
          .location(LocationType.ConstructionArea)
          .player(me)
          .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        return {
          materials: [card, this.material(game, MaterialType.ResourceCube).location(LocationType.ConstructionCardCost).parent(card.getIndex())]
        }
      }
    },

    // 49 - Recycle Wind Turbine
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.recycle.wind.turbine.title', 'Recycle the Wind Turbine')}</strong>
            <br />
            {t('tuto.recycle.wind.turbine', 'Now slide the Wind Turbine to the recycling area, to get a black cube this time.')}
          </>
        ),
        position: { x: 0, y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.WindTurbines)
        ],
        highlight: true
      }),
      move: { player: me, filter: recycleCard(Development.WindTurbines) }
    },

    // 50 - Place Energy on Industrial Complex
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.place.energy.industrial.title', 'Place the Energy on the Industrial Complex')}</strong>
            <br />
            {t('tuto.place.energy.industrial', 'Now slide the black cube, obtained by recycling the Wind Turbine, to the Industrial Complex.')}
          </>
        ),
        position: { x: -5, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me),
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ]
      }),
      move: { player: me, filter: placeResourceOrAll(Development.IndustrialComplex, 3) }
    },

    // 51 - Recycle Zeppelin
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.recycle.zeppelin.title', 'Recycle the Zeppelin')}</strong>
            <br />
            {t(
              'tuto.recycle.zeppelin',
              'This card costs 2 Energy (which you do not produce) and produces 1 blue cube (the Exploration), not very useful for our strategy: recycle it.'
            )}
          </>
        ),
        position: { x: 0, y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.DraftArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.Zeppelin)
        ],
        highlight: true
      }),
      move: { player: me, filter: recycleCard(Development.Zeppelin) }
    },

    // 52-57 - Info about useless resources, krystallium, validate
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.blue.cube.here.title', 'The blue cube is here')}</strong>
            <br />
            {t('tuto.blue.cube.here', 'By recycling the Zeppelin, you get a blue cube. However, none of your cards under construction need this resource.')}
          </>
        ),
        position: { x: -25, y: 30 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.useless.resources.title', 'Useless resources?')}</strong>
            <br />
            {t('tuto.useless.resources.1', 'A resource that cannot be used immediately must be placed here on your Empire card.')}
          </>
        ),
        position: { x: -25, y: 30 }
      },
      focus: (game) => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        },
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.useless.resources.title', 'Useless resources?')}</strong>
            <br />
            {t('tuto.useless.resources.2', 'The Resources on your Empire card can no longer be used to build Development cards.')}
          </>
        ),
        position: { x: -25, y: 30 }
      },
      focus: (game) => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        },
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.krystallium.generation.title', 'Generation of Krystallium')}</strong>
            <br />
            {t(
              'tuto.krystallium.generation',
              'However, if there are 5 cubes on your Empire card (regardless of their color), they are converted into 1 red cube, the Krystallium.'
            )}
          </>
        ),
        position: { x: -25, y: 30 }
      },
      focus: (game) => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        },
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.EmpireCardResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <img src={resourceIcons[Resource.Krystallium]} alt={t('Krystallium')} style={{ width: '1.7em', verticalAlign: 'middle', marginRight: '0.2em' }} />
            <strong>{t('tuto.krystallium.use.title', 'Use of Krystallium')}</strong>
            <br />
            {t('tuto.krystallium.use', 'The Krystallium can replace any cube to build a card, and can be used at any time.')}
          </>
        )
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.krystallium.cost.title', 'Krystallium cost')}</strong>
            <br />
            {t('tuto.krystallium.cost', 'Some cards, such as the Secret Society, require Krystallium to be built.')}
          </>
        ),
        position: { x: -10, y: -22 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.SecretSociety)
        ]
      })
    },

    // 58 - Validate planning
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.validate.title', "Don't forget to validate!")}</strong>
            <br />
            {t('tuto.validate.planning', 'You must click on Validate to indicate to the other players that you have completed your planning.')}
          </>
        ),
        position: { x: -10, y: -15 }
      },
      move: { player: me, filter: validate }
    },

    // ── Opponent planning (auto-play) ────────────────────────────

    // RoE planning
    { move: { player: player2, filter: slateCard(Development.MilitaryBase) } },
    { move: { player: player2, filter: slateCard(Development.AirborneLaboratory) } },
    { move: { player: player2, filter: slateCard(Development.CityOfAgartha) } },
    { move: { player: player2, filter: slateCard(Development.CenterOfTheEarth) } },
    { move: { player: player2, filter: slateCard(Development.HumanCloning) } },
    { move: { player: player2, filter: recycleCard(Development.TransportationNetwork) } },
    { move: { player: player2, filter: recycleCard(Development.FinancialCenter) } },
    { move: { player: player2, filter: placeResource(Development.MilitaryBase, 0) } },
    { move: { player: player2, filter: placeResource(Development.HumanCloning, 2) } },
    { move: { player: player2, filter: validate } },

    // FoA planning
    { move: { player: player3, filter: slateCard(Development.WorldCongress) } },
    { move: { player: player3, filter: slateCard(Development.LunarBase) } },
    { move: { player: player3, filter: slateCard(Development.OffshoreOilRig) } },
    { move: { player: player3, filter: recycleCard(Development.ArkOfTheCovenant) } },
    { move: { player: player3, filter: recycleCard(Development.Juggernaut) } },
    { move: { player: player3, filter: recycleCard(Development.RecyclingPlant) } },
    { move: { player: player3, filter: recycleCard(Development.ResearchCenter) } },
    { move: { player: player3, filter: placeResource(Development.OffshoreOilRig, 0) } },
    { move: { player: player3, filter: placeResource(Development.OffshoreOilRig, 1) } },
    { move: { player: player3, filter: placeResource(Development.OffshoreOilRig, 3) } },
    { move: { player: player3, filter: placeResource(Development.LunarBase, 2) } },
    { move: { player: player3, filter: validate, interrupt: (move) => isCreateItem(move) && move.itemType === MaterialType.CharacterToken } },

    // ═══════════════════════════════════════════════════════════════
    // MATERIALS PRODUCTION
    // ═══════════════════════════════════════════════════════════════

    // Player popups & moves for materials production
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.production.phase.title', 'Production phase')}</strong>
            <br />
            {t(
              'tuto.production.phase',
              'The production phase takes place in 5 stages: one per resource, in the order of the production line: grey, black, green, yellow and finally blue.'
            )}
          </>
        ),
        position: { x: -10, y: 10 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.materials', 'Materials production')}</strong>
            <br />
            {t('tuto.materials.production', 'All players start by producing Materials. You produce 3 of them, which are available here.')}
          </>
        ),
        position: { x: -45, y: 10 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.supremacy.bonus.title', 'Supremacy Bonus')}</strong>
            <br />
            {t(
              'tuto.supremacy.bonus',
              'At each Production step, the Empire that produces the most wins a General or a Financier. You produce the most Materials, so you win a Financier token!'
            )}
          </>
        ),
        position: { x: -45, y: 10 }
      },
      move: {}
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.financier.tokens.title', 'Financier Tokens')}</strong>
            <br />
            {t(
              'tuto.financier.tokens',
              'Here is your token. As a reminder, it gives you 1 victory point, + 1 thanks to your Empire. Once the Secret Society is built, it will be 1 additional point per Financier.'
            )}
          </>
        ),
        position: { x: -25, y: 25 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.build.ic.title', 'Build the Industrial Complex')}</strong>
            <br />
            {t('tuto.build.ic.1', 'Your 3 Materials will allow us to complete the construction of the Industrial Complex.')}
          </>
        ),
        position: { x: 0, y: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me),
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.build.ic.title', 'Build the Industrial Complex')}</strong>
            <br />
            {t(
              'tuto.build.ic.2',
              'Several options are available to you: drag the card to the left, click and hold on the card, or click on the card to zoom in and see all the available actions.'
            )}
          </>
        ),
        position: { x: 0, y: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me),
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ],
        highlight: true
      }),
      move: {
        player: me,
        filter: buildCard(Development.IndustrialComplex),
        interrupt: (move) => isCreateItem(move) && move.itemType === MaterialType.CharacterToken
      }
    },

    // After IC built - info popups
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.built.cards.title', 'Built cards')}</strong>
            <br />
            {t('tuto.built.cards', 'The Industrial Complex is now part of your Empire, and increases your production by 1 Material and 1 Gold.')}
          </>
        ),
        position: { x: -25, y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructedDevelopments)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.order.production.title', 'Order of production')}</strong>
            <br />
            {t(
              'tuto.order.production.1',
              "The Material production step has already started, so it's too late to produce an additional Material this round, but you will benefit from it during the 3 remaining rounds."
            )}
          </>
        ),
        position: { x: -25, y: 15 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.order.production.title', 'Order of production')}</strong>
            <br />
            {t('tuto.order.production.2', "On the other hand, the Gold production step hasn't started yet, so you'll get an extra Gold starting this round!")}
          </>
        ),
        position: { x: -25, y: 15 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.constructionBonus', 'Construction bonus')}</strong>
            <br />
            {t(
              'tuto.construction.bonus',
              'In addition, by completing the construction of certain cards, you can win a bonus indicated here: you earned a second Financier token!'
            )}
          </>
        ),
        position: { x: -25, y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructedDevelopments)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.IndustrialComplex)
        ]
      }),
      move: {}
    },

    // Validate materials production
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.validate.title', "Don't forget to validate!")}</strong>
            <br />
            {t('tuto.validate.production', 'Once you have placed all your resources, you must validate to let other players know that you are ready.')}
          </>
        ),
        position: { x: -10, y: -15 }
      },
      move: { player: me, filter: validate }
    },

    // RoE materials production (auto-play)
    { move: { player: player2, filter: placeResource(Development.MilitaryBase, 1) } },
    { move: { player: player2, filter: placeResource(Development.MilitaryBase, 2) } },
    { move: { player: player2, filter: validate } },

    // FoA materials production (auto-play)
    { move: { player: player3, filter: placeResource(Development.OffshoreOilRig, 2) } },
    { move: { player: player3, filter: validate } },

    // ═══════════════════════════════════════════════════════════════
    // ENERGY PRODUCTION
    // ═══════════════════════════════════════════════════════════════

    // RoE energy (auto)
    { move: { player: player2, filter: placeResource(Development.MilitaryBase, 3) } },
    { move: { player: player2, filter: validate } },
    // FoA energy (auto)
    { move: { player: player3, filter: placeResource(Development.LunarBase, 0) } },
    { move: { player: player3, filter: validate } },

    // Player popups
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.energy', 'Energy production')}</strong>
            <br />
            {t(
              'tuto.energy.production',
              'The player producing the most Energy wins a General token. However, your 2 opponents are tied: in this case, no one wins a token.'
            )}
          </>
        ),
        position: { x: 15, y: -5 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.recycling.info.title', 'Recycling')}</strong>
            <br />
            {t(
              'tuto.recycling.info',
              'At any time you can recycle a card from your Construction Zone. However, the cubes placed on it will be lost and its recycling bonus must be put on your Empire card.'
            )}
          </>
        ),
        position: { x: 25, y: 10 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DevelopmentCard).location(LocationType.ConstructionArea).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.validate.title', "Don't forget to validate!")}</strong>
            <br />
            {t(
              'tuto.validate.energy',
              "Actions such as recycling a card or placing a Krystallium to complete a construction are possible at any time. You must therefore validate your turn at each production step, even if you don't produce anything!"
            )}
          </>
        ),
        position: { x: -10, y: -10 }
      },
      move: { player: me, filter: validate }
    },

    // ═══════════════════════════════════════════════════════════════
    // SCIENCE PRODUCTION
    // ═══════════════════════════════════════════════════════════════

    // RoE science production: place 2 Science on HumanCloning + choose General
    { move: { player: player2, filter: placeResource(Development.HumanCloning, 0) } },
    { move: { player: player2, filter: placeResource(Development.HumanCloning, 1) } },
    { move: { player: player2, filter: chooseCharacter(Character.General) } },
    { move: { player: player2, filter: validate } },
    // FoA science (no production, just validate)
    { move: { player: player3, filter: validate } },

    // Player popups
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.science', 'Science production')}</strong>
            <br />
            {t(
              'tuto.science.production',
              'The player with the most Science can choose either a Financier or a General Token. Here, the Republic of Europe has taken a General.'
            )}
          </>
        ),
        position: { x: -10, y: 10 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.validate.title', "Don't forget to validate!")}</strong>
            <br />
            {t('tuto.validate.science', 'Although you are not producing Science, you still have to validate again.')}
          </>
        ),
        position: { x: -10, y: -15 }
      },
      move: { player: me, filter: validate }
    },

    // ═══════════════════════════════════════════════════════════════
    // GOLD PRODUCTION
    // ═══════════════════════════════════════════════════════════════

    // RoE gold (no gold production, just validate)
    { move: { player: player2, filter: validate } },
    // FoA gold production
    { move: { player: player3, filter: placeResource(Development.LunarBase, 4) } },
    { move: { player: player3, filter: placeResource(Development.LunarBase, 5) } },
    { move: { player: player3, filter: placeResource(Development.WorldCongress, 0) } },
    { move: { player: player3, filter: validate } },

    // Player popups & moves
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.gold', 'Gold production')}</strong>
            <br />
            {t('tuto.gold.production', 'You produce 2 Gold (one thanks to your Empire and one thanks to the Industrial Complex).')}
          </>
        ),
        position: { x: 10, y: 10 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.supremacy.bonus.title', 'Supremacy Bonus')}</strong>
            <br />
            {t(
              'tuto.gold.supremacy',
              'The Federation of Asia produces 1 Gold more than you and therefore receives the Financier token. Try to produce more next rounds to win the Supremacy bonus!'
            )}
          </>
        ),
        position: { x: 10, y: 10 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.placement.resources.title', 'Placement of resources')}</strong>
            <br />
            {t(
              'tuto.placement.resources.1',
              'You can always choose to place your resources on your Empire card; however the Krystallium does not earn points at the end of the game.'
            )}
          </>
        ),
        position: { x: -25, y: 25 }
      },
      focus: (game) => ({
        staticItems: {
          [MaterialType.EmpireCard]: [{ id: { empire: me, side: EmpireSide.A }, location: { type: LocationType.EmpireCardSpace, player: me } }]
        },
        materials: [this.material(game, MaterialType.ResourceCube).location(LocationType.AvailableResources).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.placement.resources.title', 'Placement of resources')}</strong>
            <br />
            {t('tuto.placement.resources.2', 'It is better to build your cards: place your Gold on your Propaganda Center.')}
          </>
        ),
        position: { x: 0, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructionArea)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        ]
      }),
      move: { player: me, filter: buildCard(Development.PropagandaCenter) }
    },

    // After Propaganda Center built
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.gold', 'Gold production')}</strong>
            <br />
            {t('tuto.gold.production.late', 'Your new Gold production comes too late for this round, but will benefit you in future rounds.')}
          </>
        ),
        position: { x: -25, y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructedDevelopments)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.PropagandaCenter)
        ]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('help.development.constructionBonus', 'Construction bonus')}</strong>
            <br />
            {t(
              'tuto.construction.bonus.general',
              'By completing the construction of the Propaganda Center, you have won a General, which will give you 1 victory point at the end of the game.'
            )}
          </>
        ),
        position: { x: -25, y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.DevelopmentCard)
            .location(LocationType.ConstructedDevelopments)
            .player(me)
            .filter<CardId>((item) => item.id.front === Development.PropagandaCenter),
          this.material(game, MaterialType.CharacterToken).location(LocationType.PlayerCharacters).player(me).id(Character.General)
        ]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.validate.title', "Don't forget to validate!")}</strong>
            <br />
            {t('tuto.validate.gold', 'As usual, validate to proceed to the next step.')}
          </>
        ),
        position: { x: -10, y: -15 }
      },
      move: { player: me, filter: validate }
    },

    // ═══════════════════════════════════════════════════════════════
    // EXPLORATION PRODUCTION
    // ═══════════════════════════════════════════════════════════════

    // RoE exploration (no production, just validate)
    { move: { player: player2, filter: validate } },
    // FoA exploration (no production, just validate)
    { move: { player: player3, filter: validate } },

    // Player popups
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.total.production.title', 'Total production')}</strong>
            <br />
            {t(
              'tuto.total.production',
              'The total production of each player is displayed here. You will produce at least 4 Materials and 3 Gold in the next round!'
            )}
          </>
        ),
        position: { x: 15, y: -20 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('production.exploration', 'Exploration production')}</strong>
            <br />
            {t('tuto.exploration.production', 'You do not produce any Exploration. Validate now to proceed to the next round.')}
          </>
        ),
        position: { x: -10, y: -15 }
      },
      move: {
        player: me,
        filter: validate,
        interrupt: isMoveItemType(MaterialType.DevelopmentCard)
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // END OF ROUND 1 → ROUND 2 STARTS
    // ═══════════════════════════════════════════════════════════════

    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.end.first.round.title', 'End of the first round')}</strong>
            <br />
            {t('tuto.end.first.round', 'We are now in round 2, and a new Draft phase begins. The direction of the cards is reversed every turn.')}
          </>
        ),
        position: { x: 0, y: 0 }
      },
      move: {}
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.each.round.title', 'Each round goes like this')}</strong>
            <br />
            {t(
              'tuto.each.round',
              'You have until the end of the game to complete the construction of your cards. Try to build the Harbor Zone quickly, to benefit from its production! The Secret Society does not produce anything, you can safely wait until turn 4 to finish it.'
            )}
          </>
        ),
        position: { x: 10, y: 0 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.DevelopmentCard).location(LocationType.ConstructionArea).player(me)]
      })
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.undo.title', 'You can change your mind!')}</strong>
            <br />
            {t('tuto.undo', 'In the menu, the [↺] button allows you to undo your last move: it is displayed in red when it is allowed.')}
          </>
        ),
        position: { x: 10, y: 0 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.watch.opponents.title', 'Keep an eye on your opponents')}</strong>
            <br />
            {t(
              'tuto.watch.opponents',
              'By clicking on your opponents, you can see their Empire. "If you know your enemies and know yourself, you will not be imperiled in a hundred battles." - Sun Tzu'
            )}
          </>
        ),
        position: { x: 10, y: 0 }
      }
    },
    {
      popup: {
        text: (t) => (
          <>
            <strong>{t('tuto.your.turn.title', "It's up to you!")}</strong>
            <br />
            {t('tuto.your.turn', 'You can now finish the game by making your own choices. Good luck!')}
          </>
        ),
        position: { x: 10, y: 0 }
      }
    }
  ]
}
