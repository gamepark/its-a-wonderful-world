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

const EmpireSideE = {
  production: {
    [Resource.Materials]: 4,
    [Resource.Energy]: 2,
    [Resource.Science]: -1,
    [Resource.Gold]: -1,
    [Resource.Exploration]: -1
  }
}

const AztecEmpire: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 3, per: DevelopmentType.Discovery},
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
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: 2,
      [Resource.Science]: -1,
      [Resource.Gold]: 1,
      [Resource.Exploration]: 1
    }
  }
}

const FederationOfAsia: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 2, per: DevelopmentType.Project},
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
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: 4,
      [Resource.Science]: 1,
      [Resource.Exploration]: -1
    }
  }
}

const NoramStates: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 1, per: Character.Financier},
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
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: 3,
      [Resource.Energy]: 2,
      [Resource.Gold]: -1
    }
  }
}

const PanafricanUnion: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 2, per: DevelopmentType.Research},
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
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: 3,
      [Resource.Energy]: -1,
      [Resource.Science]: 2
    }
  }
}

const RepublicOfEurope: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 1, per: Character.General},
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
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: -1,
      [Resource.Energy]: 2,
      [Resource.Science]: 2
    }
  }
}

const NationsOfOceania: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 1, per: DevelopmentType.Structure},
    production: {
      [Resource.Materials]: 3,
      [Resource.Energy]: 1
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Science]: 1,
      [Resource.Gold]: 1,
      [Resource.Exploration]: 1
    }
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: -2,
      [Resource.Gold]: 2,
      [Resource.Exploration]: 2
    }
  }
}

const NorthHegemony: Empire = {
  [EmpireSide.A]: {
    victoryPoints: {quantity: 2, per: DevelopmentType.Vehicle},
    production: {
      [Resource.Energy]: 3
    }
  },
  [EmpireSide.B]: EmpireSideB,
  [EmpireSide.C]: EmpireSideC,
  [EmpireSide.D]: {
    production: {
      [Resource.Energy]: 3,
      [Resource.Science]: 1
    }
  },
  [EmpireSide.E]: EmpireSideE,
  [EmpireSide.F]: {
    production: {
      [Resource.Materials]: 3,
      [Resource.Energy]: 2,
      [Resource.Science]: -2
    }
  }
}

export default {
  [EmpireName.AztecEmpire]: AztecEmpire,
  [EmpireName.FederationOfAsia]: FederationOfAsia,
  [EmpireName.NoramStates]: NoramStates,
  [EmpireName.PanafricanUnion]: PanafricanUnion,
  [EmpireName.RepublicOfEurope]: RepublicOfEurope,
  [EmpireName.NationsOfOceania]: NationsOfOceania,
  [EmpireName.NorthHegemony]: NorthHegemony
}