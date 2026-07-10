import React from 'react'

import {
  CardContent,
  IconWrapper,
  LabelText,
  RadioGrid,
  StyledLabel,
} from './RadioSelectCards.styled'
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
      <CardContent>
        <IconWrapper>
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
        </IconWrapper>
        <LabelText>{label}</LabelText>
      </CardContent>
    </StyledLabel>
  )
}

/**
 * Props for the RadioSelectCards component
 */
type RadioSelectCardsProps = Unwrap<
  Pick<CardRadioCardProps, 'name'> &
    Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> & {
      /**
       * Props shared by every card's input. `checked`/`defaultChecked` are
       * per-card only (set via `data`) — a single boolean here would apply
       * identically to every card in the group.
       */
      inputProps?: Omit<
        NonNullable<CardRadioCardProps['inputProps']>,
        'checked' | 'defaultChecked'
      >
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
      <RadioGrid
        $hasError={Boolean(error)}
        style={style}
      >
        {data.map(({ defaultChecked, checked, disabled, ...props }) => {
          // A native <input> must not receive both `checked` and
          // `defaultChecked` — that mixes controlled/uncontrolled modes and
          // triggers a React warning. Once this card's own `checked` is set,
          // treat it as controlled and drop `defaultChecked` entirely.
          const isControlled = checked !== undefined

          return (
            <CardRadioInput
              name={name}
              key={String(props.value)}
              inputProps={{
                ...sharedInputProps,
                ...(isControlled
                  ? { checked: Boolean(checked), defaultChecked: undefined }
                  : { defaultChecked }),
                disabled: sharedInputProps?.disabled ?? disabled,
              }}
              {...props}
            />
          )
        })}
      </RadioGrid>
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
