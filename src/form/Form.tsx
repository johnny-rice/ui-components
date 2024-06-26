import { filterDOMProps } from '@react-aria/utils';
import React, { useContext, ReactElement, FormEventHandler } from 'react';
import { css } from '@emotion/react';
import { classNames, useDOMRef } from '../utils';
import {
  Alignment,
  DOMRef,
  LabelPosition,
  LabelableProps,
  DOMProps,
  AriaLabelingProps,
} from '../types';
import { Provider } from '../provider';

const FormContext = React.createContext<LabelableProps>({});

export function useFormProps<T extends LabelableProps>(props: T): T {
  const ctx = useContext(FormContext);
  return { ...ctx, ...props };
}

const formPropNames = new Set([
  'action',
  'autoComplete',
  'encType',
  'method',
  'target',
  'onSubmit',
]);

export interface FormProps extends DOMProps, AriaLabelingProps, LabelableProps {
  /** The contents of the Form. */
  children: ReactElement<LabelableProps> | ReactElement<LabelableProps>[];
  /** Whether the Form elements are displayed with their quiet style. */
  isQuiet?: boolean;
  /** Whether the Form elements are disabled. */
  isDisabled?: boolean;
  /** Whether the Form elements can be selected but not changed by the user. */
  isReadOnly?: boolean;
  /**
   * Where to send the form-data when the form is submitted.
   */
  action?: string;
  /**
   * The enctype attribute specifies how the form-data should be encoded when submitting it to the server.
   */
  encType?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  /**
   * The form-data can be sent as URL variables (with method="get") or as HTTP post transaction (with method="post").
   */
  method?: 'get' | 'post';
  /**
   * The target attribute specifies a name or a keyword that indicates where to display the response that is received after submitting the form.
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * Fired on form submission.
   */
  onSubmit?: FormEventHandler;
  /**
   * The layout of the form.
   * @default 'vertical'
   */
  layout?: 'vertical' | 'inline';
}

const formCSS = css`
  // Vertical layout style
  &.ac-form--vertical {
    & > div,
    & {
      & > .ac-field:not(.ac-field--hasHelpText) {
        margin-bottom: 20px;
      }
      & > .ac-field {
        & > .ac-dropdown {
          width: 100%;
          & > .ac-dropdown-button {
            width: 100%;
          }
        }
        & > .ac-dropdown-button {
          width: 100%;
        }
      }
    }
  }
  // Inline layout style
  &.ac-form--inline {
    & > div,
    & {
      width: 100%;
      display: inline-flex;
      flex-direction: row;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5em;

      --ac-field-text-color-override: var(--ac-global-color-primary);
    }
  }
`;

function Form(props: FormProps, ref: DOMRef<HTMLFormElement>) {
  const {
    children,
    labelPosition = 'top' as LabelPosition,
    labelAlign = 'start' as Alignment,
    layout = 'vertical',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isRequired,
    necessityIndicator,
    isDisabled,
    isReadOnly,
    isQuiet,
    ...otherProps
  } = props;
  const domRef = useDOMRef(ref);

  const ctx = {
    labelPosition,
    labelAlign,
    necessityIndicator,
  };

  return (
    <form
      {...filterDOMProps(otherProps, {
        labelable: true,
        propNames: formPropNames,
      })}
      noValidate
      ref={domRef}
      className={classNames('ac-form', {
        'ac-form--positionSide': labelPosition === 'side',
        'ac-form--positionTop': labelPosition === 'top',
        'ac-form--vertical': layout === 'vertical',
        'ac-form--inline': layout !== 'vertical',
      })}
      css={formCSS}
    >
      <FormContext.Provider value={ctx}>
        <Provider
          isQuiet={isQuiet}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
        >
          {children}
        </Provider>
      </FormContext.Provider>
    </form>
  );
}

/**
 * Forms allow users to enter data that can be submitted while providing alignment and styling for form fields.
 */
const _Form = React.forwardRef(Form);
export { _Form as Form };
