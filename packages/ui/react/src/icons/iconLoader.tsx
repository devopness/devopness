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
  { type: 'icon', name: 'add', component: MdAdd },
  { type: 'icon', name: 'alarm', component: MdAlarmOn },
  { type: 'icon', name: 'arrowDown', component: MdKeyboardArrowDown },
  { type: 'icon', name: 'arrowLeft', component: MdKeyboardArrowLeft },
  { type: 'icon', name: 'arrowRight', component: MdKeyboardArrowRight },
  { type: 'icon', name: 'arrowUp', component: MdKeyboardArrowUp },
  { type: 'icon', name: 'checkOutline', component: AiOutlineCheck },
  { type: 'image', name: 'children', component: typeHierarchySuperSVG },
  { type: 'icon', name: 'close', component: GrClose },
  { type: 'icon', name: 'cloudWarning', component: PiCloudWarningBold },
  { type: 'icon', name: 'codeBadge', component: DiCodeBadge },
  { type: 'icon', name: 'commit', component: GoGitCommit },
  { type: 'icon', name: 'config', component: FaCog },
  { type: 'icon', name: 'connect', component: GrConnect },
  { type: 'icon', name: 'copy', component: FaCopy },
  { type: 'icon', name: 'copyOutline', component: FaRegCopy },
  { type: 'icon', name: 'cubes', component: FaCubes },
  { type: 'icon', name: 'currencyCircle', component: AiOutlineDollarCircle },
  { type: 'icon', name: 'delete', component: MdDelete },
  { type: 'icon', name: 'deploy', component: AiOutlineDeploymentUnit },
  { type: 'icon', name: 'description', component: MdOutlineDescription },
  { type: 'icon', name: 'devices', component: MdDevices },
  { type: 'icon', name: 'dragHandle', component: MdDragHandle },
  { type: 'icon', name: 'edit', component: MdEdit },
  { type: 'icon', name: 'error', component: MdError },
  { type: 'icon', name: 'eyeClosed', component: IoMdEyeOff },
  { type: 'icon', name: 'eyeOpen', component: IoMdEye },
  { type: 'icon', name: 'eyeOutline', component: RiEye2Line },
  { type: 'icon', name: 'folder', component: MdOutlineFolder },
  { type: 'icon', name: 'gear', component: BsFillGearFill },
  { type: 'icon', name: 'gitBranch', component: FiGitBranch },
  { type: 'icon', name: 'globe', component: FaGlobe },
  { type: 'icon', name: 'group', component: MdGroup },
  { type: 'icon', name: 'help', component: BsQuestionCircleFill },
  { type: 'icon', name: 'info', component: MdInfo },
  { type: 'icon', name: 'key', component: GoKey },
  { type: 'icon', name: 'launch', component: GrLaunch },
  { type: 'icon', name: 'lens', component: MdLens },
  { type: 'icon', name: 'link', component: AiOutlineLink },
  { type: 'icon', name: 'loading', component: CircleBubble },
  { type: 'icon', name: 'lock', component: FaLock },
  { type: 'icon', name: 'lockOpen', component: FaLockOpen },
  { type: 'icon', name: 'logout', component: FiLogOut },
  { type: 'icon', name: 'mapPin', component: RiMapPinLine },
  { type: 'icon', name: 'more', component: MdMoreHoriz },
  { type: 'icon', name: 'network', component: LiaNetworkWiredSolid },
  { type: 'icon', name: 'openInNewWindow', component: RxOpenInNewWindow },
  { type: 'icon', name: 'organization', component: GoOrganization },
  { type: 'image', name: 'parent', component: typeHierarchySubSVG },
  { type: 'icon', name: 'passkey', component: GoPasskeyFill },
  { type: 'icon', name: 'pending', component: MdPending },
  { type: 'icon', name: 'plus', component: FaPlus },
  { type: 'icon', name: 'plusCircle', component: FiPlusCircle },
  { type: 'icon', name: 'remove', component: MdDelete },
  { type: 'icon', name: 'security', component: MdSecurity },
  { type: 'icon', name: 'server', component: FaServer },
  { type: 'icon', name: 'serverCloud', component: AiOutlineCloudServer },
  { type: 'icon', name: 'serverOutline', component: FiServer },
  { type: 'icon', name: 'settings', component: MdSettings },
  { type: 'icon', name: 'shield', component: RiShieldCheckFill },
  { type: 'icon', name: 'shieldLock', component: mdOutlineShieldLockSVG },
  { type: 'icon', name: 'shieldOutline', component: AiOutlineSafety },
  { type: 'icon', name: 'skip', component: GoSkip },
  { type: 'icon', name: 'snooze', component: MdSnooze },
  { type: 'icon', name: 'sort', component: FaSort },
  { type: 'icon', name: 'storage', component: FaDatabase },
  { type: 'icon', name: 'subnet', component: ImTree },
  { type: 'icon', name: 'success', component: MdCheckCircle },
  { type: 'icon', name: 'tag', component: PiTagDuotone },
  { type: 'icon', name: 'teamOutline', component: RiTeamLine },
  { type: 'icon', name: 'terminal', component: BsTerminal },
  { type: 'icon', name: 'treeView', component: PiTreeView },
  { type: 'icon', name: 'unlink', component: BiUnlink },
  { type: 'icon', name: 'user', component: MdPersonOutline },
  { type: 'icon', name: 'warning', component: MdWarning },

  // Technology/Brand icons
  { type: 'image', name: 'aws', component: awsSVG },
  { type: 'image', name: 'azure', component: azureSVG },
  { type: 'image', name: 'bitbucket', component: bitbucketSVG },
  { type: 'image', name: 'c-sharp', component: cSharpSVG },
  { type: 'image', name: 'centos', component: centosSVG },
  { type: 'image', name: 'devopness', component: devopnessSymbolSVG },
  { type: 'image', name: 'digitalocean', component: digitaloceanSVG },
  { type: 'image', name: 'docker', component: dockerSVG },
  { type: 'image', name: 'dotnetcore', component: dotnetCoreSVG },
  {
    type: 'image',
    name: 'dotnetcore-aspnetcore',
    component: dotnetCoreAspnetCoreSVG,
  },
  { type: 'image', name: 'gcp', component: gcpSVG },
  { type: 'image', name: 'github', component: githubSVG },
  { type: 'image', name: 'gitlab', component: gitlabSVG },
  { type: 'image', name: 'html', component: htmlSVG },
  { type: 'image', name: 'java', component: javaSVG },
  { type: 'image', name: 'nodejs', component: nodejsSVG },
  { type: 'image', name: 'php', component: phpSVG },
  { type: 'image', name: 'php-laravel', component: phpLaravelSVG },
  { type: 'image', name: 'python', component: pythonSVG },
  { type: 'image', name: 'python-django', component: pythonDjangoSVG },
  { type: 'image', name: 'python-fastapi', component: pythonFastAPISVG },
  { type: 'image', name: 'python-flask', component: pythonFlaskSVG },
  { type: 'image', name: 'ruby', component: rubySVG },
  { type: 'icon', name: 'self-hosted', component: FaServer },
  { type: 'image', name: 'ubuntu', component: ubuntuSVG },

  // @deprecated icons - will be removed in next version
  {
    type: 'deprecated-icon',
    name: 'aiOutlineDollarCircle',
    component: AiOutlineDollarCircle,
    newName: 'currencyCircle',
  },
  {
    type: 'deprecated-icon',
    name: 'alarmOn',
    component: MdAlarmOn,
    newName: 'alarm',
  },
  {
    type: 'deprecated-image',
    name: 'bitbucket-white',
    component: bitbucketWhiteSVG,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'checkCircle',
    component: MdCheckCircle,
    newName: 'success',
  },
  {
    type: 'deprecated-icon',
    name: 'cloudServer',
    component: AiOutlineCloudServer,
    newName: 'serverCloud',
  },
  {
    type: 'deprecated-icon',
    name: 'downArrow',
    component: MdKeyboardArrowDown,
    newName: 'arrowDown',
  },
  {
    type: 'deprecated-icon',
    name: 'eye',
    component: IoMdEye,
    newName: 'eyeOpen',
  },
  {
    type: 'deprecated-icon',
    name: 'eye2Line',
    component: RiEye2Line,
    newName: 'eyeOutline',
  },
  {
    type: 'deprecated-icon',
    name: 'eyeOff',
    component: IoMdEyeOff,
    newName: 'eyeClosed',
  },
  {
    type: 'deprecated-icon',
    name: 'faGlobe',
    component: FaGlobe,
    newName: 'globe',
  },
  {
    type: 'deprecated-icon',
    name: 'filledCheck',
    component: RiShieldCheckFill,
    newName: 'shieldCheck',
  },
  {
    type: 'deprecated-icon',
    name: 'fillGearFill',
    component: BsFillGearFill,
    newName: 'gear',
  },
  {
    type: 'deprecated-image',
    name: 'github-white',
    component: githubWhiteSVG,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'leftArrow',
    component: MdKeyboardArrowLeft,
    newName: 'arrowLeft',
  },
  {
    type: 'deprecated-icon',
    name: 'mapPinLine',
    component: RiMapPinLine,
    newName: 'mapPin',
  },
  {
    type: 'deprecated-icon',
    name: 'mdGroup',
    component: MdGroup,
    newName: 'group',
  },
  {
    type: 'deprecated-icon',
    name: 'outlineCheck',
    component: AiOutlineCheck,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'outlineCopy',
    component: FaRegCopy,
    newName: 'copyOutline',
  },
  {
    type: 'deprecated-icon',
    name: 'outlineSafety',
    component: AiOutlineSafety,
    newName: 'shieldOutline',
  },
  {
    type: 'deprecated-icon',
    name: 'outlineServer',
    component: FiServer,
    newName: 'serverOutline',
  },
  {
    type: 'deprecated-icon',
    name: 'rightArrow',
    component: MdKeyboardArrowRight,
    newName: 'arrowRight',
  },
  {
    type: 'deprecated-icon',
    name: 'riTeamLine',
    component: RiTeamLine,
    newName: 'teamOutline',
  },
  {
    type: 'deprecated-icon',
    name: 'sortIcon',
    component: FaSort,
    newName: 'sort',
  },
  {
    type: 'deprecated-icon',
    name: 'timeroff',
    component: MdTimerOff,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'upArrow',
    component: MdKeyboardArrowUp,
    newName: 'arrowUp',
  },
  {
    type: 'deprecated-icon',
    name: 'userCheck',
    component: FaUserCheck,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'userClock',
    component: FaUserClock,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'userTimes',
    component: FaUserTimes,
    newName: undefined,
  },
  {
    type: 'deprecated-icon',
    name: 'warningCloud',
    component: PiCloudWarningBold,
    newName: 'cloudWarning',
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
      [icon.name]: icon.newName,
    }),
    {} as DeprecatedToNewIconMap
  )

type DeprecatedIcon = Extract<
  (typeof iconList)[number],
  { type: 'deprecated-icon' }
>

type DeprecatedToNewIconMap = {
  [K in DeprecatedIcon['name']]: Extract<
    DeprecatedIcon,
    // Filter to only get the icon with the matching accessor
    { name: K }
  >['newName']
}

const ICON_MIN_SIZE = 12

const iconLoader = (
  name?: Icon,
  size = 13,
  color = '',
  opacity = 1,
  label = ''
): React.JSX.Element => {
  /**
   * If no name is provided,
   * avoid searching iconList and
   * return empty React.Fragment
   */
  if (name === undefined) {
    return <></>
  }

  const Icon = iconList.find((icon) => icon.name === name)

  switch (Icon?.type) {
    case 'deprecated-icon':
    case 'icon':
      return (
        <Icon.component
          aria-label={label}
          opacity={opacity}
          size={size}
          color={color}
        />
      )
    case 'deprecated-image':
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
          src={getImageAssetUrl(`icons_svgs/${String(name)}.svg`)}
        />
      )
  }
}

export { deprecatedToNewIconMap, iconLoader, iconList }
