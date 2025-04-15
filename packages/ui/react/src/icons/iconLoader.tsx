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
import { GoGitCommit, GoKey, GoPasskeyFill, GoSkip } from 'react-icons/go'
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

const bitbucketSVG = getImageAssetUrl('icons_svgs/bitbucket.svg')
const bitbucketWhiteSVG = getImageAssetUrl('icons_svgs/bitbucket-white.svg')
const cSharpSVG = getImageAssetUrl('icons_svgs/c-sharp.svg')
const dockerSVG = getImageAssetUrl('icons_svgs/docker.svg')
const dotnetCoreSVG = getImageAssetUrl('icons_svgs/dotnetcore.svg')
const dotnetCoreAspnetCoreSVG = getImageAssetUrl(
  'icons_svgs/dotnetcore-aspnetcore.svg'
)
const githubSVG = getImageAssetUrl('icons_svgs/github.svg')
const githubWhiteSVG = getImageAssetUrl('icons_svgs/github-white.svg')
const gitlabSVG = getImageAssetUrl('icons_svgs/gitlab.svg')
const htmlSVG = getImageAssetUrl('icons_svgs/html.svg')
const nodejsSVG = getImageAssetUrl('icons_svgs/nodejs.svg')
const phpSVG = getImageAssetUrl('icons_svgs/php.svg')
const phpLaravelSVG = getImageAssetUrl('icons_svgs/php-laravel.svg')
const pythonSVG = getImageAssetUrl('icons_svgs/python.svg')
const pythonDjangoSVG = getImageAssetUrl('icons_svgs/python-django.svg')
const pythonFlaskSVG = getImageAssetUrl('icons_svgs/python-flask.svg')
const pythonFastAPISVG = getImageAssetUrl('icons_svgs/python-fastapi.svg')
const ubuntuSVG = getImageAssetUrl('icons_svgs/ubuntu.svg')
const centosSVG = getImageAssetUrl('icons_svgs/centos.svg')
const awsSVG = getImageAssetUrl('icons_svgs/aws.svg')
const gcpSVG = getImageAssetUrl('icons_svgs/gcp.svg')
const azureSVG = getImageAssetUrl('icons_svgs/azure.svg')
const digitaloceanSVG = getImageAssetUrl('icons_svgs/digitalocean.svg')
const typeHierarchySubSVG = getImageAssetUrl(
  'icons_svgs/type-hierarchy-sub.svg'
)
const typeHierarchySuperSVG = getImageAssetUrl(
  'icons_svgs/type-hierarchy-super.svg'
)
const javaSVG = getImageAssetUrl('icons_svgs/java.svg')
const rubySVG = getImageAssetUrl('icons_svgs/ruby.svg')
const mdOutlineShieldLockSVG = getImageAssetUrl(
  'icons_svgs/outline-shield-lock.svg'
)

const devopnessSymbolSVG = getImageAssetUrl('logo-symbol-devopness.svg')

const iconList = [
  { type: 'icon', accessor: 'link', component: AiOutlineLink },
  { type: 'icon', accessor: 'unlink', component: BiUnlink },
  { type: 'icon', accessor: 'tag', component: PiTagDuotone },
  { type: 'icon', accessor: 'help', component: BsQuestionCircleFill },
  { type: 'icon', accessor: 'key', component: GoKey },
  { type: 'icon', accessor: 'skip', component: GoSkip },
  { type: 'icon', accessor: 'pending', component: MdPending },
  { type: 'icon', accessor: 'loading', component: CircleBubble },
  { type: 'icon', accessor: 'server', component: FaServer },
  { type: 'icon', accessor: 'self-hosted', component: FaServer },
  { type: 'icon', accessor: 'sortIcon', component: FaSort },
  { type: 'icon', accessor: 'add', component: MdAdd },
  { type: 'icon', accessor: 'plus', component: FaPlus },
  { type: 'icon', accessor: 'downArrow', component: MdKeyboardArrowDown },
  { type: 'icon', accessor: 'upArrow', component: MdKeyboardArrowUp },
  { type: 'icon', accessor: 'leftArrow', component: MdKeyboardArrowLeft },
  { type: 'icon', accessor: 'rightArrow', component: MdKeyboardArrowRight },
  { type: 'icon', accessor: 'config', component: FaCog },
  { type: 'icon', accessor: 'userCheck', component: FaUserCheck },
  { type: 'icon', accessor: 'userClock', component: FaUserClock },
  { type: 'icon', accessor: 'userTimes', component: FaUserTimes },
  { type: 'icon', accessor: 'warningCloud', component: PiCloudWarningBold },
  { type: 'icon', accessor: 'error', component: MdError },
  { type: 'icon', accessor: 'warning', component: MdWarning },
  { type: 'icon', accessor: 'success', component: MdCheckCircle },
  { type: 'icon', accessor: 'alarmOn', component: MdAlarmOn },
  { type: 'icon', accessor: 'dragHandle', component: MdDragHandle },
  { type: 'icon', accessor: 'delete', component: MdDelete },
  { type: 'icon', accessor: 'edit', component: MdEdit },
  { type: 'icon', accessor: 'lockOpen', component: FaLockOpen },
  { type: 'icon', accessor: 'lock', component: FaLock },
  { type: 'icon', accessor: 'eye2Line', component: RiEye2Line },
  { type: 'icon', accessor: 'cubes', component: FaCubes },
  { type: 'icon', accessor: 'security', component: MdSecurity },
  { type: 'icon', accessor: 'fillGearFill', component: BsFillGearFill },
  { type: 'icon', accessor: 'devices', component: MdDevices },
  { type: 'icon', accessor: 'logout', component: FiLogOut },
  { type: 'icon', accessor: 'codeBadge', component: DiCodeBadge },
  { type: 'icon', accessor: 'logout', component: FiLogOut },
  { type: 'icon', accessor: 'snooze', component: MdSnooze },
  { type: 'icon', accessor: 'timeroff', component: MdTimerOff },
  { type: 'icon', accessor: 'deploy', component: AiOutlineDeploymentUnit },
  { type: 'icon', accessor: 'outlineCheck', component: AiOutlineCheck },
  { type: 'icon', accessor: 'filledCheck', component: RiShieldCheckFill },
  { type: 'icon', accessor: 'settings', component: MdSettings },
  { type: 'icon', accessor: 'branch', component: FiGitBranch },
  { type: 'icon', accessor: 'commit', component: GoGitCommit },
  { type: 'icon', accessor: 'user', component: MdPersonOutline },
  { type: 'icon', accessor: 'copy', component: FaCopy },
  { type: 'icon', accessor: 'outlineCopy', component: FaRegCopy },
  { type: 'icon', accessor: 'lens', component: MdLens },
  { type: 'icon', accessor: 'more', component: MdMoreHoriz },
  { type: 'icon', accessor: 'launch', component: GrLaunch },
  { type: 'icon', accessor: 'connect', component: GrConnect },
  { type: 'icon', accessor: 'cloudServer', component: AiOutlineCloudServer },
  { type: 'icon', accessor: 'gitBranch', component: FiGitBranch },
  { type: 'icon', accessor: 'outlineServer', component: FiServer },
  { type: 'icon', accessor: 'storage', component: FaDatabase },
  { type: 'icon', accessor: 'mapPinLine', component: RiMapPinLine },
  { type: 'icon', accessor: 'outlineSafety', component: AiOutlineSafety },
  { type: 'icon', accessor: 'plusCircle', component: FiPlusCircle },
  { type: 'icon', accessor: 'riTeamLine', component: RiTeamLine },
  {
    type: 'icon',
    accessor: 'aiOutlineDollarCircle',
    component: AiOutlineDollarCircle,
  },
  { type: 'icon', accessor: 'network', component: LiaNetworkWiredSolid },
  { type: 'icon', accessor: 'subnet', component: ImTree },
  { type: 'icon', accessor: 'mdGroup', component: MdGroup },
  { type: 'icon', accessor: 'faGlobe', component: FaGlobe },
  { type: 'icon', accessor: 'openInNewWindow', component: RxOpenInNewWindow },
  { type: 'image', accessor: 'github', component: githubSVG },
  { type: 'image', accessor: 'github-white', component: githubWhiteSVG },
  { type: 'image', accessor: 'gitlab', component: gitlabSVG },
  { type: 'image', accessor: 'bitbucket', component: bitbucketSVG },
  { type: 'image', accessor: 'bitbucket-white', component: bitbucketWhiteSVG },
  { type: 'image', accessor: 'docker', component: dockerSVG },
  { type: 'image', accessor: 'c-sharp', component: cSharpSVG },
  { type: 'image', accessor: 'dotnetcore', component: dotnetCoreSVG },
  {
    type: 'image',
    accessor: 'dotnetcore-aspnetcore',
    component: dotnetCoreAspnetCoreSVG,
  },
  { type: 'image', accessor: 'html', component: htmlSVG },
  { type: 'image', accessor: 'nodejs', component: nodejsSVG },
  { type: 'image', accessor: 'php', component: phpSVG },
  { type: 'image', accessor: 'php-laravel', component: phpLaravelSVG },
  { type: 'image', accessor: 'python', component: pythonSVG },
  { type: 'image', accessor: 'python-django', component: pythonDjangoSVG },
  { type: 'image', accessor: 'python-flask', component: pythonFlaskSVG },
  { type: 'image', accessor: 'python-fastapi', component: pythonFastAPISVG },
  { type: 'image', accessor: 'ubuntu', component: ubuntuSVG },
  { type: 'image', accessor: 'centos', component: centosSVG },
  { type: 'image', accessor: 'aws', component: awsSVG },
  { type: 'image', accessor: 'azure', component: azureSVG },
  { type: 'image', accessor: 'digitalocean', component: digitaloceanSVG },
  { type: 'image', accessor: 'gcp', component: gcpSVG },
  { type: 'image', accessor: 'parent', component: typeHierarchySubSVG },
  { type: 'image', accessor: 'children', component: typeHierarchySuperSVG },
  { type: 'image', accessor: 'java', component: javaSVG },
  { type: 'image', accessor: 'ruby', component: rubySVG },
  { type: 'image', accessor: 'shieldLock', component: mdOutlineShieldLockSVG },
  { type: 'image', accessor: 'devopness', component: devopnessSymbolSVG },
  { type: 'icon', accessor: 'close', component: GrClose },
  { type: 'icon', accessor: 'eye', component: IoMdEye },
  { type: 'icon', accessor: 'eyeOff', component: IoMdEyeOff },
  { type: 'icon', accessor: 'passkey', component: GoPasskeyFill },
  { type: 'icon', accessor: 'info', component: MdInfo },
  { type: 'icon', accessor: 'description', component: MdOutlineDescription },
  { type: 'icon', accessor: 'terminal', component: BsTerminal },
  { type: 'icon', accessor: 'treeView', component: PiTreeView },
  { type: 'icon', accessor: 'folder', component: MdOutlineFolder },
] as const

/**
 * Lists all valid icon accessors
 */
type Icon = (typeof iconList)[number]['accessor']

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

export type { Icon }
export { iconLoader, iconList }
