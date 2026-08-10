import React, { useId } from 'react'

import { getColor } from 'src/colors'
import { ErrorMessage, RingLoader } from 'src/components/Primitives'
import { Unwrap } from 'src/components/types'
import { Icon, iconLoader } from 'src/icons'

import {
  StyledCardDescription,
  StyledCardLabel,
  StyledCardHeader,
  StyledCardIcon,
  StyledCardLead,
  StyledCardMeta,
  StyledCardRadio,
  StyledCardText,
  StyledCardTitle,
  StyledCardsGrid,
  StyledCardsLoader,
  StyledCardsRoot,
  StyledCardsSection,
  StyledCardsSectionDescription,
  StyledCardsSectionHeader,
  StyledCardsSectionTitle,
} from './RadioSelectCards.styled'

const ICON_SIZE = 50
const LOADING_ICON_SIZE = 60
const LOADING_ICON_RATIO = 2

type RadioSelectCardsDensity = 'default' | 'compact'

type RadioSelectCardsIcon =
  | Icon
  | Omit<string, Icon>
  | {
      name: Icon | Omit<string, Icon>
      color?: string
    }

type RadioSelectCardsItemInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'type' | 'value'
> & { ref?: React.Ref<HTMLInputElement> }

/**
 * Props for individual radio card inputs.
 */
type RadioSelectCardsItem = Unwrap<
  Required<Pick<React.InputHTMLAttributes<HTMLInputElement>, 'value'>> &
    Pick<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & {
      /** Icon to display in the card */
      icon?: RadioSelectCardsIcon
      /** Primary label for the card */
      label: React.ReactNode
      /** Optional helper text rendered under the label */
      description?: React.ReactNode
      /** Optional meta text rendered under the description */
      meta?: React.ReactNode
      /** Whether the option is checked */
      checked?: boolean
      /** Whether the option is checked by default */
      defaultChecked?: boolean
      /** Whether the option is disabled */
      disabled?: boolean
      /** Additional props for the input element */
      inputProps?: RadioSelectCardsItemInputProps
    }
>

type RadioSelectCardsGroup = {
  /** Optional section heading */
  label?: React.ReactNode
  /** Optional section helper text */
  description?: React.ReactNode
  /** Cards rendered inside the section */
  data: RadioSelectCardsItem[]
}

/**
 * Props for the RadioSelectCards component.
 */
type RadioSelectCardsProps = Unwrap<
  {
    name: string
  } & {
    inputProps?: RadioSelectCardsInputProps
  } & Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> & {
      /** Flat list of cards to render when sections are not needed */
      data?: RadioSelectCardsItem[]
      /** Grouped sections of cards for denser gallery layouts */
      groups?: RadioSelectCardsGroup[]
      /** Compact mode for denser layouts */
      density?: RadioSelectCardsDensity
      /** Whether to display the native radio indicator */
      showSelectionIndicator?: boolean
      /** Loader state */
      isLoading?: boolean
      /** External error to display */
      error?: React.ComponentPropsWithoutRef<typeof ErrorMessage>['error']
    }
>

type RadioSelectCardsInputProps = RadioSelectCardsItemInputProps

type RadioSelectCardsOptionProps = RadioSelectCardsItem & {
  $density: RadioSelectCardsDensity
  $showSelectionIndicator: boolean
  inputId: string
  name: string
  sharedInputProps?: RadioSelectCardsInputProps
}

const RadioSelectCard = ({
  icon,
  label,
  description,
  meta,
  checked,
  defaultChecked,
  disabled,
  inputId,
  name,
  value,
  inputProps,
  sharedInputProps,
  $density,
  $showSelectionIndicator,
}: RadioSelectCardsOptionProps) => {
  const titleId = `${inputId}-title`
  const descriptionId = description ? `${inputId}-description` : undefined
  const metaId = meta ? `${inputId}-meta` : undefined
  const ariaDescribedBy = [descriptionId, metaId].filter(Boolean).join(' ')

  const resolvedChecked =
    sharedInputProps?.checked ?? inputProps?.checked ?? checked
  const resolvedDefaultChecked =
    sharedInputProps?.defaultChecked ??
    inputProps?.defaultChecked ??
    defaultChecked
  const isControlled = resolvedChecked !== undefined
  const isDisabled = Boolean(
    sharedInputProps?.disabled ?? inputProps?.disabled ?? disabled
  )

  return (
    <StyledCardLabel $density={$density}>
      <StyledCardHeader>
        <StyledCardLead>
          {icon ? (
            <StyledCardIcon
              $density={$density}
              $selected={Boolean(resolvedChecked)}
            >
              {typeof icon === 'string' && (
                <>{iconLoader(icon as Icon, ICON_SIZE)}</>
              )}
              {typeof icon === 'object' && 'name' in icon && (
                <>{iconLoader(icon.name as Icon, ICON_SIZE, icon.color)}</>
              )}
            </StyledCardIcon>
          ) : null}
          <StyledCardText>
            <StyledCardTitle id={titleId}>{label}</StyledCardTitle>
            {description ? (
              <StyledCardDescription id={descriptionId}>
                {description}
              </StyledCardDescription>
            ) : null}
            {meta ? <StyledCardMeta id={metaId}>{meta}</StyledCardMeta> : null}
          </StyledCardText>
        </StyledCardLead>
        <StyledCardRadio
          $showIndicator={$showSelectionIndicator}
          aria-describedby={ariaDescribedBy || undefined}
          aria-labelledby={titleId}
          {...inputProps}
          {...sharedInputProps}
          checked={isControlled ? Boolean(resolvedChecked) : undefined}
          defaultChecked={isControlled ? undefined : resolvedDefaultChecked}
          disabled={isDisabled}
          id={inputId}
          name={name}
          type="radio"
          value={value}
        />
      </StyledCardHeader>
    </StyledCardLabel>
  )
}

const RadioSelectCards = ({
  data,
  style,
  isLoading,
  error,
  name,
  groups,
  density = 'default',
  showSelectionIndicator = true,
  inputProps: sharedInputProps,
}: RadioSelectCardsProps) => {
  const generatedId = useId()

  const sections =
    groups ??
    (data
      ? [
          {
            data,
          },
        ]
      : [])

  if (isLoading) {
    return (
      <StyledCardsLoader>
        <RingLoader
          data-testid="radio-select-cards-loader"
          color={getColor('purple.800')}
          size={LOADING_ICON_SIZE / LOADING_ICON_RATIO}
        />
      </StyledCardsLoader>
    )
  }

  return (
    <>
      <StyledCardsRoot style={style}>
        {sections.map((section, sectionIndex) => {
          const shouldRenderSectionShell =
            isDefined(section.label) ||
            isDefined(section.description) ||
            section.data.length > 1

          const sectionKey = `${generatedId}-section-${sectionIndex}`

          if (!shouldRenderSectionShell) {
            const item = section.data[0]

            if (!item) return null

            return (
              <StyledCardsGrid
                key={sectionKey}
                $density={density}
                $error={Boolean(error)}
              >
                <RadioSelectCard
                  {...item}
                  $density={density}
                  $showSelectionIndicator={showSelectionIndicator}
                  inputId={item.id ?? `${sectionKey}-item-0`}
                  name={name}
                  sharedInputProps={sharedInputProps}
                />
              </StyledCardsGrid>
            )
          }

          return (
            <StyledCardsSection
              key={sectionKey}
              $density={density}
              $error={Boolean(error)}
            >
              {isDefined(section.label) || isDefined(section.description) ? (
                <StyledCardsSectionHeader>
                  {isDefined(section.label) ? (
                    <StyledCardsSectionTitle>
                      {section.label}
                    </StyledCardsSectionTitle>
                  ) : null}
                  {isDefined(section.description) ? (
                    <StyledCardsSectionDescription>
                      {section.description}
                    </StyledCardsSectionDescription>
                  ) : null}
                </StyledCardsSectionHeader>
              ) : null}
              <StyledCardsGrid $density={density}>
                {section.data.map((item, itemIndex) => (
                  <RadioSelectCard
                    {...item}
                    key={item.id ?? String(item.value)}
                    $density={density}
                    $showSelectionIndicator={showSelectionIndicator}
                    inputId={
                      item.id ??
                      `${sectionKey}-item-${itemIndex}-${String(item.value)}`
                    }
                    name={name}
                    sharedInputProps={sharedInputProps}
                  />
                ))}
              </StyledCardsGrid>
            </StyledCardsSection>
          )
        })}
      </StyledCardsRoot>
      {error && (
        <div>
          <ErrorMessage error={error} />
        </div>
      )}
    </>
  )
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export { RadioSelectCards }
export type {
  RadioSelectCardsDensity,
  RadioSelectCardsGroup,
  RadioSelectCardsItem,
  RadioSelectCardsProps,
}
