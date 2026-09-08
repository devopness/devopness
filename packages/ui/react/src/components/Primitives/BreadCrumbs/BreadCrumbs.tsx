import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'

import { useMediaQuery } from '@mui/material'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { ArrowHead } from 'src/components/Primitives/ArrowHead'
import type { DropdownOption } from 'src/components/Primitives/Dropdown'
import { Dropdown } from 'src/components/Primitives/Dropdown'
import { Tooltip } from 'src/components/Primitives/Tooltip'
import { getImageAssetUrl } from 'src/icons'
import { iconLoader } from 'src/icons'

import {
  Background,
  Border,
  Container,
  ContentBadge,
  ContentIconArrow,
  CrumbContainer,
  CrumbText,
  CrumbWrapper,
  Crumbs,
  LogoContainer,
  LogoContent,
  LogoImage,
  LoadingLine,
  NodeContent,
  NodeContentContainer,
} from './BreadCrumbs.styled'

const DROPDOWN_ICON_SIZE = 24

const handleKeyboardActivation = (
  event: KeyboardEvent,
  onClick: () => void | Promise<void>
) => {
  if (event.key !== 'Enter' && event.key !== ' ') return

  event.preventDefault()
  void onClick()
}

/** Available logo treatments for the leading breadcrumb. */
enum BreadCrumbLogoTheme {
  Purple = 'purple',
  Dark = 'dark',
}

/**
 * Describes a breadcrumb item and its optional dropdown alternatives.
 *
 * The UI package renders the breadcrumb and invokes `onClick`; route
 * generation and navigation should remain in the consuming application.
 */
type BreadCrumbOption = DropdownOption & {
  /** Alternative breadcrumb items displayed in the item's dropdown. */
  list?: DropdownOption[]
  /** Called when the breadcrumb item or its separator is clicked. */
  onClick: () => void | Promise<void>
}

/** Breadcrumb item data enriched with animation and layering metadata. */
type RenderedCrumb = BreadCrumbOption & {
  /** Stagger position used by the entry animation. */
  queue: number
  /** Layering order used when breadcrumb items overlap. */
  zIndex: number
}

type BreadCrumbsProps = {
  /** Breadcrumb items rendered from left to right. */
  navigateCrumbs: BreadCrumbOption[]
  /** Background color of the breadcrumb bar. */
  backgroundColor: string
  /** Shrinks the logo to its compact form when breadcrumb navigation is active. */
  animationHideAndResizeImage?: boolean
  /** Logo theme used by the leading breadcrumb. */
  theme?: BreadCrumbLogoTheme
  /** Called when the leading logo breadcrumb is clicked. */
  imageOnClick: () => void
  /** Displays the loading indicator below the breadcrumb bar. */
  isLoading?: boolean
  /** Hides the leading logo breadcrumb when set to `false`. */
  showLogoCrumb?: boolean
  /** Adds spacing for a brand displayed immediately before the breadcrumbs. */
  hasAdjacentBrand?: boolean
  /** Builds tooltip text for each breadcrumb item. */
  getTooltipTitle?: (label: string, index: number) => string
}

const borderVariants: Variants = {
  hidden: { x: '-100%' },
  show: {
    x: '0%',
    transition: { type: 'spring', stiffness: 25, damping: 10 },
  },
  hide: {
    x: '100%',
    transition: { type: 'spring', stiffness: 90, damping: 20 },
  },
}

const backgroundVariants: Variants = {
  hidden: { x: '-100%' },
  show: {
    x: '0%',
    transition: { type: 'spring', stiffness: 30, delay: 0.1 },
  },
  hide: { opacity: 0, transition: { duration: 0.3 } },
}

const getLogoUrls = (theme: BreadCrumbLogoTheme) =>
  theme === BreadCrumbLogoTheme.Dark
    ? {
        compact: getImageAssetUrl('logo_devopness_symbol_dark.png'),
        expanded: getImageAssetUrl('logo_devopness_complete_dark.png'),
      }
    : {
        compact: getImageAssetUrl('logo-symbol-devopness.svg'),
        expanded: getImageAssetUrl('logo-devopness-primary.svg'),
      }

const CrumbLogo = ({
  theme,
  compact,
  onClick,
}: {
  theme: BreadCrumbLogoTheme
  compact: boolean
  onClick: () => void
}) => {
  const urls = getLogoUrls(theme)

  return (
    <Tooltip
      title={compact ? 'All organizations' : ''}
      placement="bottom-end"
      disableHover={!compact}
    >
      <LogoContainer
        role="button"
        tabIndex={0}
        aria-label="Home"
        onClick={onClick}
        onKeyDown={(event) => handleKeyboardActivation(event, onClick)}
      >
        <LogoContent>
          <LogoImage
            $src={urls.compact}
            $expandedSrc={urls.expanded}
            $compact={compact}
          />
        </LogoContent>
        <ArrowHead
          fill="white"
          stroke="#c7cedb"
        />
      </LogoContainer>
    </Tooltip>
  )
}

const Crumb = ({
  crumb,
  index,
  total,
  isLeadingWithoutLogo,
  getTooltipTitle,
}: {
  crumb: RenderedCrumb
  index: number
  total: number
  isLeadingWithoutLogo: boolean
  getTooltipTitle: (label: string, index: number) => string
}) => {
  const [selectedCrumb, setSelectedCrumb] = useState<DropdownOption>(crumb)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const isPresent = useIsPresent()

  const handleDropdownOptionSelect = useCallback(
    async (option: DropdownOption) => {
      setSelectedCrumb(option)
      await option.onClick?.()
    },
    []
  )

  const dropdownOptions = useMemo(
    () =>
      crumb.list?.map((option) => ({
        ...option,
        onClick: () => handleDropdownOptionSelect(option),
      })) ?? [],
    [crumb.list, handleDropdownOptionSelect]
  )

  useEffect(() => {
    setSelectedCrumb(crumb)
  }, [crumb])

  const variants: Variants = {
    hidden: {
      scale: 0.5,
      x: `-${(index + 1) * 100}%`,
      originX: 0,
      originY: '50%',
    },
    show: {
      scale: 1,
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 22,
        delay: 0.15 * crumb.queue,
      },
    },
    hide: {
      scale: 0.5,
      x: `-${(index + 1) * 100}%`,
      transition: {
        type: 'spring',
        stiffness: 25,
        delay: 0.3 + 0.1 * (total - index - 1),
      },
    },
  }

  const contentAnimation = isPresent
    ? 'show'
    : {
        opacity: 0,
        transition: {
          duration: 0.3,
          delay: 0.2 * Math.max(total - index - 1, 0),
        },
      }
  const label = selectedCrumb.label ?? ''
  const badge = selectedCrumb.badge
  const contentIconAnimationVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.25 + 0.12 * crumb.queue,
      },
    },
    hide: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }
  const contentLabelAnimationVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.45 + 0.12 * crumb.queue,
      },
    },
    hide: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }
  const handleCrumbClick = selectedCrumb.onClick ?? crumb.onClick

  return (
    <CrumbContainer
      $last={total === index + 1 && isPresent}
      $zIndex={crumb.zIndex}
      $isLeadingWithoutLogo={isLeadingWithoutLogo}
      $shrinkWeight={total - index + 1}
      as={motion.article}
      variants={variants}
      initial="hidden"
      animate="show"
      exit="hide"
    >
      <CrumbWrapper>
        <NodeContentContainer>
          <Tooltip title={getTooltipTitle(label, index)}>
            <NodeContent
              key={index + (crumb?.label || '')}
              $order={index}
              $zIndex={total - index}
              role="button"
              tabIndex={0}
              aria-label={label}
              onClick={handleCrumbClick}
              onKeyDown={(event) =>
                handleKeyboardActivation(event, handleCrumbClick)
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`icon-${label}-${crumb?.label ?? ''}`}
                  style={{ opacity: 0 }}
                  variants={contentIconAnimationVariants}
                  initial="hidden"
                  animate={contentAnimation}
                  exit="hide"
                >
                  {badge &&
                    (badge.icon ? (
                      <ContentBadge $backgroundColor={badge.backgroundColor}>
                        {iconLoader(badge.name, badge.size || 14)}
                      </ContentBadge>
                    ) : (
                      <ContentBadge
                        $backgroundColor={badge.backgroundColor}
                        $color={badge.color}
                      >
                        {label[0] ?? null}
                      </ContentBadge>
                    ))}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${label}`}
                  style={{ opacity: 0, minWidth: 0 }}
                  variants={contentLabelAnimationVariants}
                  initial="hidden"
                  animate={contentAnimation}
                  exit="hide"
                >
                  <CrumbText>{label}</CrumbText>
                </motion.div>
              </AnimatePresence>
            </NodeContent>
          </Tooltip>
          {dropdownOptions.length > 0 && (
            <ContentIconArrow $zIndex={total - index}>
              <Dropdown
                id={`breadcrumb-dropdown-${index}`}
                options={dropdownOptions}
                anchorType="content"
                content={
                  <span>
                    {iconLoader(
                      isDropdownOpen ? 'arrowUp' : 'arrowDown',
                      DROPDOWN_ICON_SIZE
                    )}
                  </span>
                }
                onToggle={({ isOpen }) => setIsDropdownOpen(isOpen)}
              />
            </ContentIconArrow>
          )}
        </NodeContentContainer>
        <div
          className="arrow-head"
          style={{ display: 'contents' }}
        >
          <ArrowHead
            onClick={handleCrumbClick}
            onKeyDown={(event) =>
              handleKeyboardActivation(event, handleCrumbClick)
            }
            aria-label={`Navigate to ${label}`}
            fill="white"
            stroke="#c7cedb"
          />
        </div>
      </CrumbWrapper>
    </CrumbContainer>
  )
}

/**
 * Animated breadcrumb navigation for hierarchical application routes.
 *
 * The component is presentation-focused: pass already-generated breadcrumb
 * data and keep routing, route matching, and navigation handlers in the
 * consuming application.
 *
 * @example
 * ```tsx
 * <BreadCrumbs
 *   backgroundColor="#ffffff"
 *   imageOnClick={() => navigate('/organizations')}
 *   navigateCrumbs={[
 *     {
 *       label: 'Projects',
 *       onClick: () => navigate('/projects'),
 *     },
 *     {
 *       label: 'Production',
 *       onClick: () => navigate('/projects/production'),
 *       badge: {
 *         icon: true,
 *         name: 'server',
 *         backgroundColor: '#4285f4',
 *       },
 *     },
 *   ]}
 * />
 * ```
 */
const BreadCrumbs = ({
  navigateCrumbs,
  backgroundColor,
  animationHideAndResizeImage = false,
  theme = BreadCrumbLogoTheme.Purple,
  imageOnClick,
  isLoading = false,
  showLogoCrumb = true,
  hasAdjacentBrand = false,
  getTooltipTitle = (label) => label,
}: BreadCrumbsProps) => {
  const [renderedCrumbs, setRenderedCrumbs] = useState<RenderedCrumb[]>([])
  const isNarrow = useMediaQuery('(max-width: 900px)')
  const visibleCrumbs = useMemo(
    () =>
      isNarrow && navigateCrumbs.length > 2
        ? navigateCrumbs.slice(-2)
        : navigateCrumbs,
    [isNarrow, navigateCrumbs]
  )

  useEffect(() => {
    const diff = visibleCrumbs.length - renderedCrumbs.length
    setRenderedCrumbs(
      visibleCrumbs.map((crumb, index) => ({
        ...crumb,
        queue: diff > 0 ? Math.max(index + diff - visibleCrumbs.length, 0) : 0,
        zIndex:
          diff > 0
            ? visibleCrumbs.length - index
            : (renderedCrumbs[index]?.zIndex ?? visibleCrumbs.length - index),
      }))
    )
  }, [visibleCrumbs])

  return (
    <Container>
      <AnimatePresence>
        <Background
          key={backgroundColor}
          $color={backgroundColor}
          variants={backgroundVariants}
          initial="hidden"
          animate="show"
          exit="hide"
        />
      </AnimatePresence>
      <Crumbs
        id="container-breadcrumb"
        $hasLogoCrumb={showLogoCrumb}
        $hasAdjacentBrand={hasAdjacentBrand}
      >
        {showLogoCrumb && (
          <CrumbLogo
            theme={theme}
            compact={animationHideAndResizeImage}
            onClick={imageOnClick}
          />
        )}
        <AnimatePresence>
          {renderedCrumbs.map((crumb, index) => (
            <Crumb
              key={`crumb${index + 1}`}
              crumb={crumb}
              index={index + 1}
              total={
                showLogoCrumb
                  ? renderedCrumbs.length + 1
                  : renderedCrumbs.length
              }
              isLeadingWithoutLogo={
                (!showLogoCrumb || hasAdjacentBrand) && index === 0
              }
              getTooltipTitle={getTooltipTitle}
            />
          ))}
        </AnimatePresence>
      </Crumbs>
      <AnimatePresence>
        <Border
          $isLoading={isLoading}
          variants={borderVariants}
          initial="hidden"
          animate="show"
          exit="hide"
        />
      </AnimatePresence>
      <AnimatePresence>
        <LoadingLine
          $isLoading={isLoading}
          initial={{ left: 0, width: '15%' }}
          animate={{ translateX: ['-80%', '650%'] }}
          transition={{
            type: 'spring',
            repeatType: 'reverse',
            repeat: Infinity,
          }}
        />
      </AnimatePresence>
    </Container>
  )
}

export { BreadCrumbs }
export { BreadCrumbLogoTheme, BreadCrumbLogoTheme as ImageThemes }
export type { BreadCrumbOption, BreadCrumbsProps, RenderedCrumb }
