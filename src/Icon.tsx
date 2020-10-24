import React, { ReactNode } from 'react';
import { css } from '@emotion/core';

/**
 * Wraps the svg in a reasonable size and applies a color
 */
const Icon = ({
  svg,
  style,
}: {
  svg: ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <i
      className="icon-wrap"
      css={css`
        width: 1em;
        height: 1em;
        font-size: 1.3rem;
        svg {
          fill: currentColor;
          width: 1em;
          height: 1em;
          display: inline-block;
          transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          flex-shrink: 0;
          user-select: none;
        }
      `}
      style={style}
    >
      {svg}
    </i>
  );
};

export default Icon;
