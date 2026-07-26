/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactNode } from 'react'

/**
 * Wrapper for the content of a material help dialog: it fills the whole height of the dialog
 * so that the {@link HelpActions} bar always lays at the bottom of the popup.
 */
export function HelpContent({ children }: { children: ReactNode }) {
  return <div css={helpContentCss}>{children}</div>
}

/**
 * Action bar displayed at the bottom of a material help dialog.
 * It sticks to the bottom of the scrollable help content so the buttons remain visible.
 */
export function HelpActions({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div css={helpActionsCss}>
      {hint && <p css={helpActionsHintCss}>{hint}</p>}
      <div css={helpActionsRowCss}>{children}</div>
    </div>
  )
}

const helpContentCss = css`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  // Restore the rules applied by the dialog on its direct children
  > h2 {
    margin: 0 1em;
    text-align: center;
  }

  > p {
    white-space: break-spaces;
  }
`

const helpActionsCss = css`
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin: auto -0.5em 0;
  padding: 0.5em 0.5em 0.3em;
  background: var(--gp-dialog-bg, #f0fbfc);
  border-top: 0.05em solid rgba(0, 36, 72, 0.25);
  box-shadow: 0 -0.6em 0.6em -0.5em rgba(0, 36, 72, 0.35);
`

const helpActionsRowCss = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4em;
`

const helpActionsHintCss = css`
  font-size: 0.8em;
  color: #55606b;
  font-style: italic;
  margin: 0 0 0.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.1em;
  text-align: center;
`

/**
 * Custom style for the help dialog buttons: filled instead of the default outlined theme button,
 * so that the available actions cannot be missed.
 */
export const helpActionButtonCss = css`
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.15em;
  padding: 0.3em 0.9em;
  border-radius: 2em;
  border: 0.05em solid rgba(255, 255, 255, 0.5);
  background: linear-gradient(#1a7fb8, #0b5586);
  color: #ffffff;
  font-family: inherit;
  font-size: 1.05em;
  font-weight: 600;
  text-shadow: 0 0.05em 0.1em rgba(0, 0, 0, 0.4);
  box-shadow: 0 0.08em 0.25em rgba(0, 36, 72, 0.5);
  cursor: pointer;
  transition: background 0.1s ease-in-out;

  &:focus {
    outline: none;
  }

  &:focus,
  &:hover {
    background: linear-gradient(#2794d1, #0d6199);
  }

  &:active {
    background: linear-gradient(#0b5586, #1a7fb8);
    box-shadow: 0 0.03em 0.1em rgba(0, 36, 72, 0.5);
    transform: translateY(0.05em);
  }

  &:disabled {
    background: #9aa5ad;
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;
    box-shadow: none;
    cursor: auto;
    opacity: 0.6;
  }
`
