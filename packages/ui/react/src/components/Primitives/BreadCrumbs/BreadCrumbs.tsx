import { useEffect, useMemo, useState } from 'react'

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

enum BreadCrumbLogoTheme {
  Purple = 'purple',
  Dark = 'dark',
}

type BreadCrumbOption = DropdownOption & {
  list?: DropdownOption[]
  onClick: () => void | Promise<void>
}

type RenderedCrumb = BreadCrumbOption & {
  queue: number
  zIndex: number
}

type BreadCrumbsProps = {
  navigateCrumbs: BreadCrumbOption[]
  backgroundColor: string
  animationHideAndResizeImage?: boolean
  theme?: BreadCrumbLogoTheme
  imageOnClick: () => void
  isLoading?: boolean
  showLogoCrumb?: boolean
  hasAdjacentBrand?: boolean
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
      <LogoContainer onClick={onClick}>
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
              onClick={crumb.onClick}
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
          {!!crumb.list?.length && (
            <ContentIconArrow $zIndex={total - index}>
              <Dropdown
                id={`breadcrumb-dropdown-${index}`}
                options={crumb.list}
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
                onSelect={setSelectedCrumb}
              />
            </ContentIconArrow>
          )}
        </NodeContentContainer>
        <div
          className="arrow-head"
          style={{ display: 'contents' }}
        >
          <ArrowHead
            onClick={crumb.onClick}
            fill="white"
            stroke="#c7cedb"
          />
        </div>
      </CrumbWrapper>
    </CrumbContainer>
  )
}

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
