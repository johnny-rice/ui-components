import React, { CSSProperties, ReactNode } from 'react';
import { mergeProps } from '@react-aria/utils';
import { useHover } from '@react-aria/interactions';
import { useButton } from '@react-aria/button';
import { classNames } from '../utils/classNames';
import { FocusableRef, PressEvents } from '../types';
import { useFocusableRef } from '../utils/useDOMRef';

interface TriggerWrapProps extends PressEvents {
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A focusable element that wraps a trigger for a tooltip
 * @param props
 * @param ref
 * @returns
 */
function TriggerWrap(
  props: TriggerWrapProps,
  ref: FocusableRef<HTMLDivElement>
) {
  const domRef = useFocusableRef(ref);
  const { children, style, ...otherProps } = props;
  // Need to advertise the component as a button for tooltips to work
  const { buttonProps } = useButton(props, domRef);
  const { hoverProps, isHovered } = useHover({});

  return (
    <div
      {...mergeProps(hoverProps, buttonProps, otherProps)}
      ref={domRef}
      className={classNames('ac-trigger-wrap', {
        'is-hovered': isHovered,
      })}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * TriggerWrap allows users to focus on an element and to get tooltips
 */
const _TriggerWrap = React.forwardRef(TriggerWrap);
export { _TriggerWrap as TriggerWrap };
