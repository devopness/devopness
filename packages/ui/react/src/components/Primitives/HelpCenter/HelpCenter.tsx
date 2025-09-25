import Draggable from 'react-draggable'
import { ProductFruits } from 'react-product-fruits'

import {
  ChecklistContainer,
  ChecklistLaunch,
  Hidden,
  Text,
} from './HelpCenter.styled'
import { ConditionalWrapper } from 'src/components/helpers'
import {
  useChecklist,
  checklistContainerId,
  hiddenContainerId,
} from 'src/hooks'
import { iconLoader } from 'src/icons'

/**
 * Props for the HelpCenter component.
 */
type HelpCenterProps = {
  /**
   * Product Fruits workspace code.
   * It must match the workspace configured in your Product Fruits project.
   */
  workspaceCode: string

  /**
   * Product Fruits checklist code.
   * It must match the checklist configured in your Product Fruits project.
   */
  checklistId: string

  /**
   * Current user information. Used for personalization in Product Fruits.
   */
  user: {
    name: string
    email: string
  } | null
}

/**
 * HelpCenter component integrates with **Product Fruits** to display
 * an onboarding checklist and a draggable launcher button.
 *
 * - Renders a draggable button for toggling the onboarding checklist.
 * - Uses Product Fruits API to inject and manage the checklist.
 *
 * @example
 * ```tsx
 * <HelpCenter
 *   workspaceCode={process.env.PRODUCT_FRUITS_WORKSPACE_ID}
 *   user={{ name: 'Willian', email: 'willian@example.com' }}
 * />
 * ```
 */
const HelpCenter = ({ workspaceCode, user, checklistId }: HelpCenterProps) => {
  const { handleToggleChecklist, checklistOpened, isLoading } =
    useChecklist(checklistId)

  // This is a workaround for onDrag event, because the onClick event is trigged when the user drag the button
  // So is needed to check if the user is dragging the button or not, by checking the mouseDown and mouseUp position
  // If the mouseDown and mouseUp position are the same, then the user is not dragging the button
  // Also, for touch devices, is needed to check the touchStart and touchEnd position, because mouseDown and mouseUp are not trigged on touch devices
  let mouseDownX = 0
  let mouseUpX = 0
  const handleMouseDown = (clientX: number) => (mouseDownX = clientX)
  const handleMouseUp = (clientX: number) => {
    mouseUpX = clientX
    const isButtonTapped = mouseDownX === mouseUpX
    if (isButtonTapped) handleToggleChecklist()
  }

  if (!user || !workspaceCode) return null

  return (
    <>
      <Hidden id={hiddenContainerId} />

      <ConditionalWrapper
        condition={!isLoading}
        wrapper={(children) => children}
      >
        <Draggable axis="x">
          <ChecklistContainer id={checklistContainerId}>
            <ChecklistLaunch
              onMouseDown={(e) => handleMouseDown(e.clientX)}
              onTouchStart={(e) => handleMouseDown(e.changedTouches[0].clientX)}
              onTouchEnd={(e) => {
                handleMouseUp(e.changedTouches[0].clientX)
              }}
              onMouseUp={(e) => {
                handleMouseUp(e.clientX)
              }}
            >
              <Text>
                {checklistOpened ? iconLoader('close', 24) : 'Onboarding'}
              </Text>
            </ChecklistLaunch>
          </ChecklistContainer>
        </Draggable>
      </ConditionalWrapper>

      <ProductFruits
        workspaceCode={workspaceCode}
        language="en"
        user={{
          username: user.name,
          email: user.email,
        }}
        lifeCycle="neverUnmount"
      />
    </>
  )
}

export { HelpCenter }

export type { HelpCenterProps }
