type Empire = {
  name: string
}

type Development = {
  name: string,
  type: DevelopmentType
  constructionCost: { [key in Resource | Character]?: number }
  constructionBonus?: Character | Resource.Krystallium | { [key in Character | Resource.Krystallium]?: number }
  production?: Resource | { [key in Resource]?: number | DevelopmentType }
  victoryPoints?: number | { [key in DevelopmentType | Character]?: number }
  recyclingBonus: Resource
  numberOfCopies?: number
}

declare enum DevelopmentType {
  Structure = 'STRUCTURE', Vehicle = 'VEHICLE', Research = 'RESEARCH', Project = 'PROJECT', Discovery = 'DISCOVERY'
}

declare enum Resource {
  Materials = 'MATERIALS', Energy = 'ENERGY', Science = 'SCIENCE', Gold = 'GOLD', Exploration = 'EXPLORATION', Krystallium = 'KRYSTALLIUM'
}

declare enum Character {
  Financier = 'FINANCIER', General = 'GENERAL'
}