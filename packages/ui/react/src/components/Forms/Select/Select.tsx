import React, { useCallback } from 'react'
import type {
  Props as SelectPropsBase,
  GroupBase,
  SelectComponentsConfig,
  StylesConfig,
  Theme,
  CSSObjectWithLabel,
} from 'react-select'
import { createFilter } from 'react-select'

import {
  Option,
  SingleValue,
  DropdownIndicator,
  LoadingMessage,
  NoOptionsMessage,
  Placeholder,
} from './CustomComponents'
import { ReactSelect, Container, ReactCreatableSelect } from './Select.styled'
import { ErrorMessage } from 'src/components/Primitives'
import { typedMemo } from 'src/components/type-guards'
import type { Icon } from 'src/icons'

/** Option type for the Select component. */
type OptionProps<T = unknown> = {
  icon?: Icon | Omit<string, Icon>
  iconSize?: number
  value: T
  label: string
  isCreateLink?: boolean
}

/**
 * Props for the Select component.
 */
type SelectProps<TOption> = Omit<
  SelectPropsBase<
    OptionProps<TOption>,
    boolean,
    GroupBase<OptionProps<TOption>>
  >,
  'noOptionsMessage'
> &
  Pick<Parameters<typeof ErrorMessage>[0], 'error'> & {
    /** Ref to the underlying input element (may be callback inputRef or object ref) */
    inputRef?: React.RefObject<HTMLSelectElement>
    /** Options available in the dropdown */
    options: OptionProps<TOption>[]
    /** Public style overrides for placeholder and value */
    publicStyle?: {
      fontStyleValue?: string
      fontStylePlaceholder?: string
    }
    /** If true, disables interactions and search */
    isReadOnly?: boolean
    /** Whether the user can add custom options */
    isCreatable?: boolean
    /** Text to display when there are no options */
    noOptionsMessage?:
      | string
      | ((obj: { inputValue: string }) => React.ReactNode)
    /** Format the label for create option */
    formatCreateLabel?: (inputValue: string) => string
    /** Handle create option */
    onCreateOption?: (inputValue: string) => void
    /** Class name to be applied to the select container */
    className?: string
  }

type SelectComponentProps<TOption> = SelectProps<TOption> & {
  inputRef?: React.Ref<HTMLSelectElement>
  hasError?: boolean
}

const reactSelectCustomComponents = {
  Option,
  SingleValue,
  DropdownIndicator,
  LoadingMessage,
  NoOptionsMessage,
  Placeholder,
  LoadingIndicator: () => null,
}

/**
 * A flexible, reusable Select component based on `react-select`.
 *
 * - Can be used standalone with `value` and `onChange`.
 * - Supports creatable options, custom components, and readonly mode.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
const Select = <TOption,>({
  inputRef,
  error,
  isReadOnly,
  defaultValue,
  options,
  menuIsOpen,
  placeholder,
  isCreatable,
  noOptionsMessage,
  className,
  ...restProps
}: SelectProps<TOption>) => {
  const customStyles: StylesConfig<OptionProps<TOption>> = {
    control: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      boxShadow: 'none',
    }),
    menuList: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: '13px',
      maxHeight: 120,
    }),
    placeholder: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...provided,
      color: error ? '#9198A5' : '#ABB4C5',
      height: '13px',
      fontFamily: 'Roboto',
      fontSize: '13px',
      fontStyle: restProps.publicStyle?.fontStylePlaceholder,
    }),
    valueContainer: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden',
    }),
    input: (provided: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...provided,
      flexShrink: 1,
      minWidth: '2px',
    }),
  }

  const customTheme = useCallback((theme: Theme): Theme => {
    const { colors, ...restTheme } = theme
    return {
      ...restTheme,
      colors: {
        ...colors,
        primary50: '#786efdcc',
        primary: '#786efdcc',
      },
    }
  }, [])

  const customFilter = createFilter({
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
    matchFrom: 'any',
  })

  const SelectComponent = (
    isCreatable && !isReadOnly ? ReactCreatableSelect : ReactSelect
  ) as React.FC<SelectComponentProps<TOption>>

  return (
    <Container>
      <SelectComponent
        inputRef={inputRef}
        classNamePrefix="devopness"
        className={`translate ${className ?? ''}`}
        theme={customTheme}
        components={
          reactSelectCustomComponents as unknown as SelectComponentsConfig<
            OptionProps<TOption>,
            boolean,
            GroupBase<OptionProps<TOption>>
          >
        }
        isSearchable={!isReadOnly}
        menuIsOpen={isReadOnly ? false : menuIsOpen}
        styles={
          customStyles as StylesConfig<
            OptionProps<TOption>,
            boolean,
            GroupBase<OptionProps<TOption>>
          >
        }
        isReadOnly={isReadOnly}
        hasError={Boolean(error)}
        filterOption={customFilter}
        blurInputOnSelect
        defaultValue={defaultValue}
        options={restProps.isLoading ? [] : options}
        placeholder={placeholder ?? 'Select...'}
        noOptionsMessage={
          typeof noOptionsMessage === 'string'
            ? ({ inputValue }: { inputValue: string }) =>
                inputValue
                  ? `No matching items for "${inputValue}"...`
                  : noOptionsMessage
            : noOptionsMessage
        }
        {...restProps}
      />
      {Boolean(error) && <ErrorMessage error={error} />}
    </Container>
  )
}

const memoizedSelect = typedMemo(Select)

export { memoizedSelect as Select }
export type { OptionProps, SelectProps }
