/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ItemButtonProps, ItemMenuButton } from '@gamepark/react-game'
import { HTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The colour of a button's rim tells where its move takes the item: the lime of the draft area, the amber
 * of the construction area, the red of what leaves the game. Cyan, the colour of the interface, is left
 * for everything else.
 */
export enum MenuButtonTone {
  Default = 'default',
  Draft = 'draft',
  Construction = 'construction',
  Recycle = 'recycle'
}

const toneColors: Record<MenuButtonTone, string> = {
  [MenuButtonTone.Default]: '#26d9d9',
  [MenuButtonTone.Draft]: '#afca0b',
  [MenuButtonTone.Construction]: '#f7a600',
  [MenuButtonTone.Recycle]: '#e8383a'
}

type Props = ItemButtonProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'title'> & {
    children?: ReactNode
    tone?: MenuButtonTone
    /** Translation key of the label, shown only while the button is hovered: the icon is what says what it does. */
    title?: string
  }

/**
 * The round buttons laid over the material: a dark teal disc, the colour of the game's interface, ringed
 * with the colour of the {@link MenuButtonTone}.
 */
export const WonderfulMenuButton = ({ tone = MenuButtonTone.Default, title, ...props }: Props) => {
  const { t } = useTranslation()
  return <ItemMenuButton css={[menuButtonCss, toneCss(toneColors[tone])]} label={title && t(title)} {...props} />
}

const menuButtonCss = css`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  padding: 0;
  font-size: 1em;
  color: #d4f7f7;
  background: radial-gradient(circle at 50% 25%, #1b6b6b 0%, #0b3d3d 55%, #041c1c 100%);
  transition:
    background 150ms ease,
    box-shadow 150ms ease,
    color 150ms ease,
    margin-top 150ms ease;

  /* A thinner inner ring, echoing the double frames of the cards */
  &::before {
    content: '';
    position: absolute;
    inset: 0.18em;
    border-radius: 50%;
    border: 0.04em solid rgba(212, 247, 247, 0.25);
    pointer-events: none;
  }

  > svg {
    font-size: 1em;
    filter: drop-shadow(0 0.05em 0.08em rgba(0, 0, 0, 0.7));
  }

  &:focus {
    outline: none;
  }

  &:hover:not(:disabled),
  &:focus-visible {
    color: #ffffff;
    margin-top: -0.12em;
    background: radial-gradient(circle at 50% 25%, #26877f 0%, #0f5252 55%, #062828 100%);
  }

  &:active:not(:disabled) {
    margin-top: 0;
  }

  /* The label slides out from behind the disc on hover */
  > span {
    padding: 0.25em 0.65em;
    font-size: 0.8em;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #d4f7f7;
    background: #082b2b;
    border: 0.08em solid;
    border-radius: 0.35em;
    box-shadow: 0 0.12em 0.35em rgba(0, 0, 0, 0.6);
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms ease;
  }

  &:hover:not(:disabled) > span,
  &:focus-visible > span {
    opacity: 1;
  }

  &:disabled {
    background: #555;
    border-color: #444;
    color: #999;
    box-shadow: none;
    cursor: default;
  }
`

const toneCss = (color: string) => css`
  border: 0.12em solid ${color};

  > span {
    border-color: ${color};
  }
  box-shadow:
    0 0.15em 0.4em rgba(0, 0, 0, 0.6),
    inset 0 0 0.45em color-mix(in srgb, ${color} 35%, transparent);

  &:hover:not(:disabled),
  &:focus-visible {
    box-shadow:
      0 0.3em 0.5em rgba(0, 0, 0, 0.6),
      inset 0 0 0.6em color-mix(in srgb, ${color} 55%, transparent);
  }
`
