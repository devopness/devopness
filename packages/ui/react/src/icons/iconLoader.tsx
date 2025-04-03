import {
  AiOutlineCheck,
  AiOutlineCloudServer,
  AiOutlineDeploymentUnit,
  AiOutlineDollarCircle,
  AiOutlineLink,
  AiOutlineSafety,
} from 'react-icons/ai'
import { BiUnlink } from 'react-icons/bi'
import {
  BsFillGearFill,
  BsQuestionCircleFill,
  BsTerminal,
} from 'react-icons/bs'
import { DiCodeBadge } from 'react-icons/di'
import {
  FaCog,
  FaCopy,
  FaCubes,
  FaDatabase,
  FaGlobe,
  FaLock,
  FaLockOpen,
  FaPlus,
  FaRegCopy,
  FaServer,
  FaSort,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
} from 'react-icons/fa'
import { FiGitBranch, FiLogOut, FiPlusCircle, FiServer } from 'react-icons/fi'
import {
  GoGitCommit,
  GoKey,
  GoOrganization,
  GoPasskeyFill,
  GoSkip,
} from 'react-icons/go'
import { GrClose, GrConnect, GrLaunch } from 'react-icons/gr'
import { ImTree } from 'react-icons/im'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { LiaNetworkWiredSolid } from 'react-icons/lia'
import {
  MdAdd,
  MdAlarmOn,
  MdCheckCircle,
  MdDelete,
  MdDevices,
  MdDragHandle,
  MdEdit,
  MdError,
  MdGroup,
  MdInfo,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
  MdLens,
  MdMoreHoriz,
  MdOutlineDescription,
  MdOutlineFolder,
  MdPending,
  MdPersonOutline,
  MdSecurity,
  MdSettings,
  MdSnooze,
  MdTimerOff,
  MdWarning,
} from 'react-icons/md'
import { PiCloudWarningBold, PiTagDuotone, PiTreeView } from 'react-icons/pi'
import {
  RiEye2Line,
  RiMapPinLine,
  RiShieldCheckFill,
  RiTeamLine,
} from 'react-icons/ri'
import { RxOpenInNewWindow } from 'react-icons/rx'

import { CircleBubble } from './CircleBubble'
import { getImageAssetUrl } from './getImageAssetUrl'
import type { Icon } from './types'

const awsSVG = getImageAssetUrl('icons_svgs/aws.svg')
const azureSVG = getImageAssetUrl('icons_svgs/azure.svg')
const bitbucketSVG = getImageAssetUrl('icons_svgs/bitbucket.svg')
const bitbucketWhiteSVG = getImageAssetUrl('icons_svgs/bitbucket-white.svg')
const centosSVG = getImageAssetUrl('icons_svgs/centos.svg')
const cSharpSVG = getImageAssetUrl('icons_svgs/c-sharp.svg')
const devopnessSymbolSVG = getImageAssetUrl('logo-symbol-devopness.svg')
const digitaloceanSVG = getImageAssetUrl('icons_svgs/digitalocean.svg')
const dockerSVG = getImageAssetUrl('icons_svgs/docker.svg')
const dotnetCoreAspnetCoreSVG = getImageAssetUrl(
  'icons_svgs/dotnetcore-aspnetcore.svg'
)
const dotnetCoreSVG = getImageAssetUrl('icons_svgs/dotnetcore.svg')
const gcpSVG = getImageAssetUrl('icons_svgs/gcp.svg')
const githubSVG = getImageAssetUrl('icons_svgs/github.svg')
const githubWhiteSVG = getImageAssetUrl('icons_svgs/github-white.svg')
const gitlabSVG = getImageAssetUrl('icons_svgs/gitlab.svg')
const htmlSVG = getImageAssetUrl('icons_svgs/html.svg')
const javaSVG = getImageAssetUrl('icons_svgs/java.svg')
const mdOutlineShieldLockSVG = getImageAssetUrl(
  'icons_svgs/outline-shield-lock.svg'
)
const nodejsSVG = getImageAssetUrl('icons_svgs/nodejs.svg')
const phpLaravelSVG = getImageAssetUrl('icons_svgs/php-laravel.svg')
const phpSVG = getImageAssetUrl('icons_svgs/php.svg')
const pythonDjangoSVG = getImageAssetUrl('icons_svgs/python-django.svg')
const pythonFastAPISVG = getImageAssetUrl('icons_svgs/python-fastapi.svg')
const pythonFlaskSVG = getImageAssetUrl('icons_svgs/python-flask.svg')
const pythonSVG = getImageAssetUrl('icons_svgs/python.svg')
const rubySVG = getImageAssetUrl('icons_svgs/ruby.svg')
const typeHierarchySubSVG = getImageAssetUrl(
  'icons_svgs/type-hierarchy-sub.svg'
)
const typeHierarchySuperSVG = getImageAssetUrl(
  'icons_svgs/type-hierarchy-super.svg'
)
const ubuntuSVG = getImageAssetUrl('icons_svgs/ubuntu.svg')

const iconList = [
  // UI Elements
  { type: 'icon', accessor: 'add', component: MdAdd },
  { type: 'icon', accessor: 'alarm', component: MdAlarmOn },
  { type: 'icon', accessor: 'arrowDown', component: MdKeyboardArrowDown },
  { type: 'icon', accessor: 'arrowLeft', component: MdKeyboardArrowLeft },
  { type: 'icon', accessor: 'arrowRight', component: MdKeyboardArrowRight },
  { type: 'icon', accessor: 'arrowUp', component: MdKeyboardArrowUp },
  { type: 'icon', accessor: 'branch', component: FiGitBranch },
  { type: 'image', accessor: 'children', component: typeHierarchySuperSVG },
  { type: 'icon', accessor: 'checkOutline', component: AiOutlineCheck },
  { type: 'icon', accessor: 'circlePlus', component: FiPlusCircle },
  { type: 'icon', accessor: 'close', component: GrClose },
  { type: 'icon', accessor: 'cloudWarning', component: PiCloudWarningBold },
  { type: 'icon', accessor: 'code', component: DiCodeBadge },
  { type: 'icon', accessor: 'cog', component: FaCog },
  { type: 'icon', accessor: 'commit', component: GoGitCommit },
  { type: 'icon', accessor: 'connect', component: GrConnect },
  { type: 'icon', accessor: 'copy', component: FaCopy },
  { type: 'icon', accessor: 'copyOutline', component: FaRegCopy },
  { type: 'icon', accessor: 'cubes', component: FaCubes },
  {
    type: 'icon',
    accessor: 'currencyCircle',
    component: AiOutlineDollarCircle,
  },
  { type: 'icon', accessor: 'database', component: FaDatabase },
  { type: 'icon', accessor: 'delete', component: MdDelete },
  { type: 'icon', accessor: 'deploy', component: AiOutlineDeploymentUnit },
  { type: 'icon', accessor: 'description', component: MdOutlineDescription },
  { type: 'icon', accessor: 'devices', component: MdDevices },
  { type: 'icon', accessor: 'drag', component: MdDragHandle },
  { type: 'icon', accessor: 'edit', component: MdEdit },
  { type: 'icon', accessor: 'error', component: MdError },
  { type: 'icon', accessor: 'eyeClosed', component: IoMdEyeOff },
  { type: 'icon', accessor: 'eyeOpen', component: IoMdEye },
  { type: 'icon', accessor: 'eyeOutline', component: RiEye2Line },
  { type: 'icon', accessor: 'folder', component: MdOutlineFolder },
  { type: 'icon', accessor: 'gear', component: BsFillGearFill },
  { type: 'icon', accessor: 'globe', component: FaGlobe },
  { type: 'icon', accessor: 'group', component: MdGroup },
  { type: 'icon', accessor: 'help', component: BsQuestionCircleFill },
  { type: 'icon', accessor: 'info', component: MdInfo },
  { type: 'icon', accessor: 'key', component: GoKey },
  { type: 'icon', accessor: 'launch', component: GrLaunch },
  { type: 'icon', accessor: 'lens', component: MdLens },
  { type: 'icon', accessor: 'link', component: AiOutlineLink },
  { type: 'icon', accessor: 'loading', component: CircleBubble },
  { type: 'icon', accessor: 'lock', component: FaLock },
  { type: 'icon', accessor: 'lockOpen', component: FaLockOpen },
  { type: 'icon', accessor: 'logout', component: FiLogOut },
  { type: 'icon', accessor: 'mapPin', component: RiMapPinLine },
  { type: 'icon', accessor: 'moreHorizontal', component: MdMoreHoriz },
  { type: 'icon', accessor: 'network', component: LiaNetworkWiredSolid },
  { type: 'icon', accessor: 'openInNewWindow', component: RxOpenInNewWindow },
  { type: 'icon', accessor: 'organization', component: GoOrganization },
  { type: 'image', accessor: 'parent', component: typeHierarchySubSVG },
  { type: 'icon', accessor: 'passkey', component: GoPasskeyFill },
  { type: 'icon', accessor: 'pending', component: MdPending },
  { type: 'icon', accessor: 'plus', component: FaPlus },
  { type: 'icon', accessor: 'remove', component: MdDelete },
  { type: 'icon', accessor: 'security', component: MdSecurity },
  { type: 'icon', accessor: 'server', component: FaServer },
  { type: 'icon', accessor: 'serverCloud', component: AiOutlineCloudServer },
  { type: 'icon', accessor: 'serverOutline', component: FiServer },
  { type: 'icon', accessor: 'serverPrivate', component: FaServer },
  { type: 'icon', accessor: 'settings', component: MdSettings },
  { type: 'icon', accessor: 'shield', component: AiOutlineSafety },
  { type: 'icon', accessor: 'shieldCheck', component: RiShieldCheckFill },
  { type: 'icon', accessor: 'shieldLock', component: mdOutlineShieldLockSVG },
  { type: 'icon', accessor: 'skip', component: GoSkip },
  { type: 'icon', accessor: 'snooze', component: MdSnooze },
  { type: 'icon', accessor: 'sort', component: FaSort },
  { type: 'icon', accessor: 'success', component: MdCheckCircle },
  { type: 'icon', accessor: 'tag', component: PiTagDuotone },
  { type: 'icon', accessor: 'team', component: RiTeamLine },
  { type: 'icon', accessor: 'terminal', component: BsTerminal },
  { type: 'icon', accessor: 'timerOff', component: MdTimerOff },
  { type: 'icon', accessor: 'tree', component: ImTree },
  { type: 'icon', accessor: 'treeView', component: PiTreeView },
  { type: 'icon', accessor: 'unlink', component: BiUnlink },
  { type: 'icon', accessor: 'user', component: MdPersonOutline },
  { type: 'icon', accessor: 'userAdd', component: FaUserCheck },
  { type: 'icon', accessor: 'userPending', component: FaUserClock },
  { type: 'icon', accessor: 'userRemove', component: FaUserTimes },
  { type: 'icon', accessor: 'warning', component: MdWarning },

  // Technology/Brand icons
  { type: 'image', accessor: 'aws', component: awsSVG },
  { type: 'image', accessor: 'azure', component: azureSVG },
  { type: 'image', accessor: 'bitbucket', component: bitbucketSVG },
  { type: 'image', accessor: 'bitbucket-white', component: bitbucketWhiteSVG },
  { type: 'image', accessor: 'c-sharp', component: cSharpSVG },
  { type: 'image', accessor: 'centos', component: centosSVG },
  { type: 'image', accessor: 'devopness', component: devopnessSymbolSVG },
  { type: 'image', accessor: 'digitalocean', component: digitaloceanSVG },
  { type: 'image', accessor: 'docker', component: dockerSVG },
  { type: 'image', accessor: 'dotnet-core', component: dotnetCoreSVG },
  {
    type: 'image',
    accessor: 'dotnet-core-aspnet',
    component: dotnetCoreAspnetCoreSVG,
  },
  { type: 'image', accessor: 'gcp', component: gcpSVG },
  { type: 'image', accessor: 'github', component: githubSVG },
  { type: 'image', accessor: 'github-white', component: githubWhiteSVG },
  { type: 'image', accessor: 'gitlab', component: gitlabSVG },
  { type: 'image', accessor: 'html', component: htmlSVG },
  { type: 'image', accessor: 'java', component: javaSVG },
  { type: 'image', accessor: 'nodejs', component: nodejsSVG },
  { type: 'image', accessor: 'php', component: phpSVG },
  { type: 'image', accessor: 'php-laravel', component: phpLaravelSVG },
  { type: 'image', accessor: 'python', component: pythonSVG },
  { type: 'image', accessor: 'python-django', component: pythonDjangoSVG },
  { type: 'image', accessor: 'python-fastapi', component: pythonFastAPISVG },
  { type: 'image', accessor: 'python-flask', component: pythonFlaskSVG },
  { type: 'image', accessor: 'ruby', component: rubySVG },
  { type: 'image', accessor: 'ubuntu', component: ubuntuSVG },

  // @deprecated icons - will be removed in next version
  {
    type: 'deprecated-icon',
    accessor: 'aiOutlineDollarCircle',
    component: AiOutlineDollarCircle,
    newAcessor: 'currencyCircle',
  },
  {
    type: 'deprecated-icon',
    accessor: 'checkCircle',
    component: MdCheckCircle,
    newAcessor: 'success',
  },
  {
    type: 'deprecated-icon',
    accessor: 'downArrow',
    component: MdKeyboardArrowDown,
    newAcessor: 'arrowDown',
  },
  {
    type: 'deprecated-icon',
    accessor: 'eye',
    component: IoMdEye,
    newAcessor: 'eyeOpen',
  },
  {
    type: 'deprecated-icon',
    accessor: 'eye2Line',
    component: RiEye2Line,
    newAcessor: 'eyeOutline',
  },
  {
    type: 'deprecated-icon',
    accessor: 'eyeOff',
    component: IoMdEyeOff,
    newAcessor: 'eyeClosed',
  },
  {
    type: 'deprecated-icon',
    accessor: 'faGlobe',
    component: FaGlobe,
    newAcessor: 'globe',
  },
  {
    type: 'deprecated-icon',
    accessor: 'fillGearFill',
    component: BsFillGearFill,
    newAcessor: 'gear',
  },
  {
    type: 'deprecated-icon',
    accessor: 'leftArrow',
    component: MdKeyboardArrowLeft,
    newAcessor: 'arrowLeft',
  },
  {
    type: 'deprecated-icon',
    accessor: 'mdGroup',
    component: MdGroup,
    newAcessor: 'group',
  },
  {
    type: 'deprecated-icon',
    accessor: 'outlineCheck',
    component: AiOutlineCheck,
    newAcessor: 'checkOutline',
  },
  {
    type: 'deprecated-icon',
    accessor: 'outlineSafety',
    component: AiOutlineSafety,
    newAcessor: 'shield',
  },
  {
    type: 'deprecated-icon',
    accessor: 'plusCircle',
    component: FiPlusCircle,
    newAcessor: 'circlePlus',
  },
  {
    type: 'deprecated-icon',
    accessor: 'rightArrow',
    component: MdKeyboardArrowRight,
    newAcessor: 'arrowRight',
  },
  {
    type: 'deprecated-icon',
    accessor: 'riTeamLine',
    component: RiTeamLine,
    newAcessor: 'team',
  },
  {
    type: 'deprecated-icon',
    accessor: 'self-hosted',
    component: FaServer,
    newAcessor: 'serverPrivate',
  },
  {
    type: 'deprecated-icon',
    accessor: 'upArrow',
    component: MdKeyboardArrowUp,
    newAcessor: 'arrowUp',
  },
  {
    type: 'deprecated-icon',
    accessor: 'userTimes',
    component: FaUserTimes,
    newAcessor: 'userRemove',
  },
  {
    type: 'deprecated-icon',
    accessor: 'warningCloud',
    component: PiCloudWarningBold,
    newAcessor: 'cloudWarning',
  },
] as const

/**
 * Maps deprecated icon names to their new names.
 *
 * This object helps migrate from old icon names to new ones by providing
 * a lookup table where:
 * - Keys are the old/deprecated icon names
 * - Values are the new icon names that should be used instead
 *
 * @example
 * // The object looks like this:
 * {
 *   'downArrow': 'arrowDown',
 *   'eye': 'eyeOpen',
 *   // ... more mappings
 * }
 *
 * @example
 * // Usage:
 * const newName = deprecatedToNewIconMap['downArrow'] // returns 'arrowDown'
 */
const deprecatedToNewIconMap = iconList
  // Step 1: Filter to only get deprecated icons
  .filter((icon): icon is DeprecatedIcon => icon.type === 'deprecated-icon')
  // Step 2: Create an object from the filtered list
  .reduce<DeprecatedToNewIconMap>(
    (acc, icon) => ({
      ...acc,
      [icon.accessor]: icon.newAcessor,
    }),
    {} as DeprecatedToNewIconMap
  )

type DeprecatedIcon = Extract<
  (typeof iconList)[number],
  { type: 'deprecated-icon' }
>

type DeprecatedToNewIconMap = {
  [K in DeprecatedIcon['accessor']]: Extract<
    DeprecatedIcon,
    // Filter to only get the icon with the matching accessor
    { accessor: K }
  >['newAcessor']
}

const ICON_MIN_SIZE = 12

const iconLoader = (
  accessorName?: Icon,
  size = 13,
  color = '',
  opacity = 1,
  label = ''
): React.JSX.Element => {
  /**
   * If no acessorName is provided,
   * avoid searching iconList and
   * return empty React.Fragment
   */
  if (accessorName === undefined) {
    return <></>
  }

  const Icon = iconList.find(({ accessor }) => accessor === accessorName)

  switch (Icon?.type) {
    case 'icon':
      return (
        <Icon.component
          aria-label={label}
          opacity={opacity}
          size={size}
          color={color}
        />
      )
    case 'image':
      return (
        <img
          aria-label={label}
          width={`${Math.max(size, ICON_MIN_SIZE).toString()}px`}
          height={`${Math.max(size, ICON_MIN_SIZE).toString()}px`}
          src={Icon.component}
        />
      )
    default:
      return (
        <img
          aria-label={label}
          width={`${Math.max(size, ICON_MIN_SIZE).toString()}px`}
          height={`${Math.max(size, ICON_MIN_SIZE).toString()}px`}
          src={getImageAssetUrl(`icons_svgs/${String(accessorName)}.svg`)}
        />
      )
  }
}

export { deprecatedToNewIconMap, iconLoader, iconList }
