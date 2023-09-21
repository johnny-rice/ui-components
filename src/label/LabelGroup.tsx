import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import theme from '../theme';

export const LabelGroup = ({ children }: { children: ReactNode }) => {
  return (
    <span
      className="ac-label-group"
      css={css`
        .ac-label + .ac-label {
          margin: ${theme.spacing.margin8}px;
        }
      `}
    >
      {children}
    </span>
  );
};
