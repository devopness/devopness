import React from 'react'

import { StyledLabel } from './RadioSelectCards.styled'
import { getColor } from 'src/colors'
import { RingLoader, ErrorMessage } from 'src/components/Primitives'
import { Unwrap } from 'src/components/types'
import { getFont } from 'src/fonts'
import { Icon, iconLoader } from 'src/icons'

const ICON_SIZE = 50
const LOADING_ICON_SIZE = 60
const LOADING_ICON_RATIO = 2

/**
 * Props for individual radio card inputs
 */
type CardRadioCardProps = Unwrap<
  Required<
    Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value'>
  > &
    Pick<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & {
      /** Icon to display in the card */
      icon:
        | Icon
        | Omit<string, Icon>
        | { name: Icon | Omit<string, Icon>; color?: string }
      /** Label for the card */
      label: string
      /** Additional props for the input element */
      inputProps?: Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'id' | 'name' | 'type' | 'value'
      > & { ref?: React.Ref<HTMLInputElement> }
    }
>

const CardRadioInput = ({
  icon,
  label,
  inputProps,
  ...props
}: CardRadioCardProps) => {
  const inputId = props.id ?? String(props.value)

  return (
    <StyledLabel htmlFor={inputId}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          {typeof icon === 'string' && (
            <>{iconLoader(icon as Icon, ICON_SIZE)}</>
          )}
          {typeof icon === 'object' && 'name' in icon && (
            <>{iconLoader(icon.name as Icon, ICON_SIZE, icon.color)}</>
          )}
          <input
            type="radio"
            id={inputId}
            style={{
              margin: '0.75rem',
              height: '0.875rem',
              ...inputProps?.style,
            }}
            {...props}
            {...inputProps}
          />
        </div>
        <span
          style={{
            color: getColor('blue.950'),
            fontFamily: getFont('roboto'),
            fontSize: '0.8125rem',
            fontWeight: 500,
            letterSpacing: '0.01625rem',
          }}
        >
          {label}
        </span>
      </div>
    </StyledLabel>
  )
}

/**
 * Props for the RadioSelectCards component
 */
type RadioSelectCardsProps = Unwrap<
  Pick<CardRadioCardProps, 'name' | 'inputProps'> &
    Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> & {
      /** Array of card data to render */
      data: Unwrap<
        Omit<CardRadioCardProps, 'name' | 'inputProps'> & {
          defaultChecked?: boolean
          checked?: boolean
          disabled?: boolean
        }
      >[]
      /** Loader state */
      isLoading?: boolean
      /** External error to display */
      error?: React.ComponentPropsWithoutRef<typeof ErrorMessage>['error']
    }
>

/**
 * RadioSelectCards component
 *
 * Displays a group of selectable radio cards. Supports loading state and error display.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: 'option1', label: 'Option 1', icon: 'icon1' },
 *   { value: 'option2', label: 'Option 2', icon: { name: 'icon2', color: 'blue' } },
 * ]
 *
 * <RadioSelectCards
 *   name="exampleRadio"
 *   data={options}
 *   isLoading={false}
 *   error="Please select an option"
 * />
 * ```
 */
const RadioSelectCards = ({
  data,
  style,
  isLoading,
  error,
  name,
  inputProps: sharedInputProps,
}: RadioSelectCardsProps) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RingLoader
          data-testid="radio-select-cards-loader"
          color={getColor('purple.800')}
          size={LOADING_ICON_SIZE / LOADING_ICON_RATIO}
        />
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
          gap: '3rem 2.5rem',
          border: error ? `1px solid ${getColor('red.500')}` : undefined,
          ...style,
        }}
      >
        {data.map(({ defaultChecked, checked, disabled, ...props }) => (
          <CardRadioInput
            name={name}
            key={String(props.value)}
            inputProps={{
              ...sharedInputProps,
              defaultChecked:
                sharedInputProps?.defaultChecked ?? defaultChecked,
              checked: sharedInputProps?.checked ?? checked,
              disabled: sharedInputProps?.disabled ?? disabled,
            }}
            {...props}
          />
        ))}
      </div>
      {error && (
        <div style={{ fontFamily: getFont('roboto') }}>
          <ErrorMessage error={error} />
        </div>
      )}
    </>
  )
}

export { RadioSelectCards }
export type { RadioSelectCardsProps }
