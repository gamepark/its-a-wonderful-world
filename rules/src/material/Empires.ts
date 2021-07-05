import Character from './Character'
import DevelopmentType from './DevelopmentType'
import Empire from './Empire'
import EmpireName from './EmpireName'
import EmpireSide from './EmpireSide'
import Resource from './Resource'

const EmpireSideB = {
  production: {
    [Resource.Materials]: 2,
    [Resource.Energy]: 1,
    [Resource.Science]: 1
  }
}

const EmpireSideC = {
  production: {},
  krystallium: 5
}

const AztecEmpire: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {[DevelopmentType.Discovery]: 3},
    production: {
      [Resource.Energy]: 2,
      [Resource.Exploration]: 1
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Materials]: 2,
      [Resource.Energy]: 2
    }
  }
}

const FederationOfAsia: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {[DevelopmentType.Project]: 2},
    production: {
      [Resource.Materials]: 1,
      [Resource.Gold]: 2
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Materials]: 2,
      [Resource.Science]: 2
    }
  }
}

const NoramStates: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {[Character.Financier]: 1},
    production: {
      [Resource.Materials]: 3,
      [Resource.Gold]: 1
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Materials]: 3,
      [Resource.Gold]: 1
    }
  }
}

const PanafricanUnion: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {[DevelopmentType.Research]: 2},
    production: {
      [Resource.Materials]: 2,
      [Resource.Science]: 2
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Materials]: 1,
      [Resource.Gold]: 2
    }
  }
}

const RepublicOfEurope: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {[Character.General]: 1},
    production: {
      [Resource.Materials]: 2,
      [Resource.Energy]: 1,
      [Resource.Science]: 1
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Materials]: 3,
      [Resource.Exploration]: 1
    }
  }
}

export default {
  [EmpireName.AztecEmpire]: AztecEmpire,
  [EmpireName.FederationOfAsia]: FederationOfAsia,
  [EmpireName.NoramStates]: NoramStates,
  [EmpireName.PanafricanUnion]: PanafricanUnion,
  [EmpireName.RepublicOfEurope]: RepublicOfEurope
}