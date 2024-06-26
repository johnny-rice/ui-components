import React, { CSSProperties, ReactNode, RefObject, useRef } from 'react';
import { SliderState, useSliderState } from '@react-stately/slider';
import { useNumberFormatter } from '@react-aria/i18n';
import { useSlider } from '@react-aria/slider';
import { css } from '@emotion/react';
import { useProviderProps } from '../provider';
import { BarSliderBase } from '../types/slider';
import { classNames, useFocusableRef } from '../utils';
import { FocusableRef } from '../types';
import { labelCSS, labelContainerCSS, sliderCSS } from './styles';
export interface SliderBaseChildArguments {
  inputRef: RefObject<HTMLInputElement>;
  trackRef: RefObject<HTMLElement>;
  state: SliderState;
}

export interface SliderBaseProps<T = number[]> extends BarSliderBase<T> {
  children: (opts: SliderBaseChildArguments) => ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  classes?: string[] | Object;
  style?: CSSProperties;
}

const controlsCSS = css`
  min-height: var(--ac-slider-height, var(--ac-alias-single-line-height));
  width: calc(
    100% - var(--ac-slider-handle-width, var(--ac-global-dimension-size-200)) /
      2 * 2
  );
  margin-left: calc(
    var(--ac-slider-handle-width, var(--ac-global-dimension-size-200)) / 2
  );
`;

function SliderBase(props: SliderBaseProps, ref: FocusableRef<HTMLDivElement>) {
  props = useProviderProps(props);
  let {
    isDisabled,
    children,
    classes,
    style,
    labelPosition = 'top',
    getValueLabel,
    showValueLabel = !!props.label,
    formatOptions,
    minValue = 0,
    maxValue = 100,
  } = props;

  // `Math.abs(Math.sign(a) - Math.sign(b)) === 2` is true if the values have a different sign.
  const alwaysDisplaySign =
    Math.abs(Math.sign(minValue) - Math.sign(maxValue)) === 2;
  if (alwaysDisplaySign) {
    if (formatOptions != null) {
      // @ts-ignore
      if (!('signDisplay' in formatOptions)) {
        formatOptions = {
          ...formatOptions,
          signDisplay: 'exceptZero',
        } as Intl.NumberFormatOptions;
      }
    } else {
      formatOptions = { signDisplay: 'exceptZero' } as Intl.NumberFormatOptions;
    }
  }

  const formatter = useNumberFormatter(formatOptions);
  const state = useSliderState({
    ...props,
    numberFormatter: formatter,
    minValue,
    maxValue,
  });
  const trackRef = useRef<HTMLDivElement>(null);
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const domRef = useFocusableRef(ref, inputRef);

  let displayValue = '';
  let maxLabelLength: number | undefined = undefined;

  if (typeof getValueLabel === 'function') {
    displayValue = getValueLabel(state.values);
    switch (state.values.length) {
      case 1:
        maxLabelLength = Math.max(
          getValueLabel([minValue]).length,
          getValueLabel([maxValue]).length
        );
        break;
      case 2:
        // Try all possible combinations of min and max values.
        maxLabelLength = Math.max(
          getValueLabel([minValue, minValue]).length,
          getValueLabel([minValue, maxValue]).length,
          getValueLabel([maxValue, minValue]).length,
          getValueLabel([maxValue, maxValue]).length
        );
        break;
      default:
        throw new Error('Only sliders with 1 or 2 handles are supported!');
    }
  } else {
    maxLabelLength = Math.max(
      [...formatter.format(minValue)].length,
      [...formatter.format(maxValue)].length
    );
    switch (state.values.length) {
      case 1:
        displayValue = state.getThumbValueLabel(0);
        break;
      case 2:
        // This should really use the NumberFormat#formatRange proposal...
        // https://github.com/tc39/ecma402/issues/393
        // https://github.com/tc39/proposal-intl-numberformat-v3#formatrange-ecma-402-393
        displayValue = `${state.getThumbValueLabel(
          0
        )} – ${state.getThumbValueLabel(1)}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        maxLabelLength =
          3 +
          2 *
            Math.max(
              maxLabelLength,
              [...formatter.format(minValue)].length,
              [...formatter.format(maxValue)].length
            );
        break;
      default:
        throw new Error('Only sliders with 1 or 2 handles are supported!');
    }
  }

  const labelNode = (
    <label className={'ac-slider-label'} {...labelProps} css={labelCSS}>
      {props.label}
    </label>
  );

  const valueNode = (
    <output
      {...outputProps}
      className={'ac-slider-value'}
      css={css`
        grid-area: value;
        text-align: right;
        color: var(--ac-global-text-color-900);
      `}
      // TODO this is non-deterministic
      // style={
      //   maxLabelLength > 0
      //     ? {
      //         width: `${maxLabelLength}ch`,
      //         minWidth: `${maxLabelLength}ch`,
      //       }
      //     : undefined
      // }
    >
      {displayValue}
    </output>
  );

  return (
    <div
      ref={domRef}
      className={classNames(
        'ac-slider',
        {
          'ac-slider--positionTop': labelPosition === 'top',
          'ac-slider--positionSide': labelPosition === 'side',
          'is-disabled': isDisabled,
        },
        classes
      )}
      style={{
        ...style,
      }}
      {...groupProps}
      css={sliderCSS}
    >
      {props.label && (
        <div
          className={'ac-slider-labelContainer'}
          css={labelContainerCSS}
          role="presentation"
        >
          {props.label && labelNode}
          {labelPosition === 'top' && showValueLabel && valueNode}
        </div>
      )}
      <div
        className={'ac-slider-controls'}
        css={controlsCSS}
        ref={trackRef}
        {...trackProps}
        role="presentation"
      >
        {children({
          trackRef,
          inputRef,
          state,
        })}
      </div>
      {labelPosition === 'side' && (
        <div className={'ac-slider-valueLabelContainer'} role="presentation">
          {showValueLabel && valueNode}
        </div>
      )}
    </div>
  );
}

const _SliderBase = React.forwardRef(SliderBase);
export { _SliderBase as SliderBase };
