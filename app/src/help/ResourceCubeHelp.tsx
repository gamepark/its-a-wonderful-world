/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DevelopmentType } from '@gamepark/its-a-wonderful-world/material/DevelopmentType'
import { Resource } from '@gamepark/its-a-wonderful-world/material/Resource'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'
import { developmentTypeIcons, resourceIcons } from '../panels/Images'

const resourceNames: Record<Resource, string> = {
  [Resource.Materials]: 'Materials',
  [Resource.Energy]: 'Energy',
  [Resource.Science]: 'Science',
  [Resource.Gold]: 'Gold',
  [Resource.Exploration]: 'Exploration',
  [Resource.Krystallium]: 'Krystallium'
}

const resourceToDevelopmentType: Partial<Record<Resource, DevelopmentType>> = {
  [Resource.Materials]: DevelopmentType.Structure,
  [Resource.Energy]: DevelopmentType.Vehicle,
  [Resource.Science]: DevelopmentType.Research,
  [Resource.Gold]: DevelopmentType.Project,
  [Resource.Exploration]: DevelopmentType.Discovery
}

const resourceAssociationTexts: Partial<Record<Resource, string>> = {
  [Resource.Materials]: 'Materials are always required to build Structure cards.',
  [Resource.Energy]: 'Energy is always required to build Vehicle cards.',
  [Resource.Science]: 'Science is always required to build Research cards.',
  [Resource.Gold]: 'Gold is always required to build Project cards.',
  [Resource.Exploration]: 'Exploration is always required to build Discovery cards.'
}

const resourceColors: Record<Resource, string> = {
  [Resource.Materials]: '#888',
  [Resource.Energy]: '#222',
  [Resource.Science]: '#2d8a2d',
  [Resource.Gold]: '#c9a800',
  [Resource.Exploration]: '#2b6cb0',
  [Resource.Krystallium]: '#9b2d9b'
}

export function ResourceCubeHelp({ item }: MaterialHelpProps) {
  const { t } = useTranslation()
  const resource = item.id as Resource

  return (
    <>
      <h2 css={titleCss(resourceColors[resource])}>
        <Picture src={resourceIcons[resource]} css={titleIconCss} />
        {t(resourceNames[resource])}
      </h2>

      {resource === Resource.Krystallium ? (
        <>
          <p css={associationCss}>
            {t('help.krystallium.persist', 'Unlike other resource cubes, Krystallium is kept from one round to the next.')}
          </p>
          <h3 css={sectionTitleCss}>{t('help.resource.obtain', 'How to obtain')}</h3>
          <ul>
            <li>{t('help.krystallium.obtain.conversion', 'Every 5 resource cubes placed on your Empire card are automatically converted into 1 Krystallium.')}</li>
            <li>{t('help.krystallium.obtain.bonus', 'Some Development cards produce Krystallium as a construction bonus.')}</li>
          </ul>
          <h3 css={sectionTitleCss}>{t('help.resource.use', 'How to use')}</h3>
          <p>
            {t('help.krystallium.use', 'Krystallium is a wild resource: it can replace any resource cube when paying the construction cost of a Development. However, it cannot replace a Character token.')}
          </p>
        </>
      ) : (
        <>
          <p css={associationCss}>
            <Picture src={developmentTypeIcons[resourceToDevelopmentType[resource]!]} css={inlineIconCss} />
            {' '}{t(`help.resource.association.${resource}`, resourceAssociationTexts[resource]!)}
          </p>
          <h3 css={sectionTitleCss}>{t('help.resource.obtain', 'How to obtain')}</h3>
          <ul>
            <li>{t('help.resource.obtain.recycling', 'Recycling: during the Planning phase, discarding a card from your Draft area gives you a resource cube as a recycling bonus.')}</li>
            <li>{t('help.resource.obtain.production', 'Production: during the Production phase, each player produces resources based on the symbols on their Empire card and their built Developments.')}</li>
          </ul>
          <h3 css={sectionTitleCss}>{t('help.resource.use', 'How to use')}</h3>
          <ul>
            <li>{t('help.resource.use.construction', 'Place them on Development cards Under Construction to pay their construction cost. Each cost slot requires a specific resource type.')}</li>
            <li>{t('help.resource.use.empire', 'Place them on your Empire card. Every 5 resource cubes on the Empire card are automatically converted into 1 Krystallium.')}</li>
          </ul>
        </>
      )}
    </>
  )
}

const titleCss = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  border-bottom: 0.06em solid ${color};
  padding-bottom: 0.2em;
  margin: 0 !important;
`

const titleIconCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
`

const sectionTitleCss = css`
  font-size: 1em;
  margin: 0.4em 0 0.1em;
`

const associationCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-top: 0.3em;
  font-style: italic;
  color: #555;
`

const inlineIconCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  flex-shrink: 0;
`
