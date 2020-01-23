type ItsAWonderfulWorldState = {
  players: PlayersMap,
  deck: Development[],
  round: number
}

type PlayersMap = { [key: string]: Player }

type Player = {

}