import { css } from '@emotion/react';
import { useModal, useOverlay, usePreventScroll } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import React, { forwardRef, HTMLAttributes, ReactNode, RefObject } from 'react';

import { DOMRef, ModalProps } from '../types';
import { classNames, useDOMRef } from '../utils';
import { Overlay } from './Overlay';
import { Underlay } from './Underlay';

const modalWrapperCSS = css`
  box-sizing: border-box;
  z-index: 2;
  transition: visibility 0ms linear 130ms;
  display: flex;
  position: fixed;
  pointer-events: none;
  &.ac-modal-wrapper--slideOver {
    height: 100vh;
    top: 0;
    right: 0;
    bottom: 0;
  }

  &.ac-modal-wrapper--modal {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const exitTransitionAnimationTime = '0.1s';
const enterTransitionAnimationTime = '0.2s';
const enterTransitionDelayAnimationTime = '0.2s';

const modalCSS = css`
  background-color: var(--ac-global-background-color-dark);
  pointer-events: auto;
  opacity: 0;
  &.ac-modal--slideOver {
    border-left: 1px solid var(--ac-global-border-color-dark);
    box-shadow: -10px 0px 30px 10px rgba(0, 0, 0, 0.1);
    /* Start offset by the animation distance */
    transform: translateX(500px);

    /* Exit animations */
    transition: opacity ${exitTransitionAnimationTime}
        cubic-bezier(0.5, 0, 1, 1),
      transform ${exitTransitionAnimationTime} cubic-bezier(0, 0, 0.4, 1);
    &.is-open {
      /* Entry animations */
      transition: transform ${enterTransitionAnimationTime}
          cubic-bezier(0, 0, 0.4, 1),
        opacity ${enterTransitionAnimationTime} cubic-bezier(0, 0, 0.4, 1);
      opacity: 0.9999;
      visibility: visible;
      transform: translateX(0);
    }
  }

  &.ac-modal--modal {
    border: 1px solid var(--ac-global-border-color-light);
    border-radius: var(--ac-global-rounding-medium);
    box-shadow: -10px 0px 30px 10px rgba(0, 0, 0, 0.1);
    /* Start offset by the animation distance */
    transform: translateY(20px);
    /* Exit animations */
    transition: opacity ${exitTransitionAnimationTime}
        cubic-bezier(0.5, 0, 1, 1),
      transform ${exitTransitionAnimationTime} cubic-bezier(0, 0, 0.4, 1);

    &.is-open {
      /* Entry animations */
      transition: transform ${enterTransitionAnimationTime}
          cubic-bezier(0, 0, 0.4, 1) ${enterTransitionDelayAnimationTime},
        opacity ${enterTransitionAnimationTime} cubic-bezier(0, 0, 0.4, 1)
          ${enterTransitionDelayAnimationTime};
      opacity: 0.9999;
      visibility: visible;
      transform: translateY(0);
    }
  }
`;
interface ModalWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  type?: 'modal' | 'fullscreen' | 'fullscreenTakeover';
  overlayProps: HTMLAttributes<HTMLElement>;
}

// @ts-ignore
const ModalWrapper = forwardRef<HTMLDivElement>(function wrapperForwardRef(
  props: ModalWrapperProps,
  ref: RefObject<HTMLDivElement>
) {
  const { children, isOpen, type, overlayProps, ...otherProps } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  usePreventScroll();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { modalProps } = useModal();

  const wrapperClassName = classNames('ac-modal-wrapper', {
    [`ac-modal-wrapper--${type}`]: type,
  });

  const modalClassName = classNames(
    'ac-modal',
    {
      'is-open': isOpen,
    },

    { [`ac-modal--${type}`]: type },
    otherProps.className
  );

  return (
    <div className={wrapperClassName} css={modalWrapperCSS}>
      <div
        {...mergeProps(otherProps, overlayProps, modalProps)}
        ref={ref}
        className={modalClassName}
        data-testid="modal"
        css={modalCSS}
      >
        {children}
      </div>
    </div>
  );
});

function Modal(props: ModalProps, ref: DOMRef<HTMLElement>) {
  const { children, onClose, type = 'modal', ...otherProps } = props;
  const domRef = useDOMRef(ref);

  const { overlayProps, underlayProps } = useOverlay(props, domRef);
  return (
    <Overlay {...otherProps}>
      <Underlay {...underlayProps} />
      <ModalWrapper
        onClose={onClose}
        type={type}
        // @ts-ignore
        ref={domRef}
        overlayProps={overlayProps}
      >
        {children}
      </ModalWrapper>
    </Overlay>
  );
}

const _Modal = forwardRef(Modal);
export { _Modal as Modal };
