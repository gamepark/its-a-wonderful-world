import Character from './material/Character'
import Development from './material/Development'
import Empire from './material/Empire'
import Resource from './material/Resource'

type ItsAWonderfulWorld = {
  players: Player[],
  deck: Development[],
  round: number,
  phase: Phase
}

export default ItsAWonderfulWorld

export type Player = {
  empire: Empire,
  hand: Development[],
  chosenCard?: Development | true,
  draftArea: Development[],
  constructionArea: DevelopmentUnderConstruction[],
  constructedDevelopments: Development[]
}

export type DevelopmentUnderConstruction = {
  development: Development
  resources: Resource[]
  characters: Character[]
}

export enum Phase {Draft = 'Draft', Planning = 'Planning', Production = 'Production'}
