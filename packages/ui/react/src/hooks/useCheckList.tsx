// Since Product Fruits is a third-party library and its types are not defined, we need to disable some eslint rules to avoid errors.
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from 'react'

const checklistContainerId = 'checklist-container'
const hiddenContainerId = 'hidden-container'

type ChecklistProps = {
  id: number
  name: string
  description: string
  state: string
  title: string
  items: {
    id: string
    description: string | undefined
    internalId: string | undefined
    state: string
    title: Record<string, string>
  }[]
}

/**
 * Custom hook to manage the onboarding checklist state and Product Fruits injection.
 */
const useChecklist = (checklistId: string) => {
  const [
    checklistOpened,
    setChecklistOpened,
  ] = useState(false)
  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  // All `window.productFruits.api...` calls is from Product Fruits JS API, for more information see: https://help.productfruits.com/en/article/javascript-api-overview
  const checklists: ChecklistProps[] =
    window.productFruits?.api?.checklists?.getChecklists()
  // This line is needed to avoid errors when checklists is undefined
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const currentChecklist = checklists?.find(
    (checklist: ChecklistProps) => String(checklist.id) === checklistId
  )
  const checklistData = {
    currentItem: currentChecklist?.items.find((item) => item.state === 'open'),
  }

  const openChecklist = () => {
    window.productFruits?.api?.checklists?.injectToElement(
      checklistId,
      document.body.querySelector(`#${checklistContainerId}`)
    )
    setChecklistOpened(true)
  }

  const closeChecklist = () => {
    window.productFruits?.api?.checklists?.injectToElement(
      checklistId,
      document.body.querySelector(`#${hiddenContainerId}`)
    )
    setChecklistOpened(false)
  }

  const handleToggleChecklist = () => {
    if (!checklistOpened) openChecklist()
    else closeChecklist()

    window.productFruits?.api?.checklists?.listen(
      'item-launched',
      closeChecklist
    )
  }

  useEffect(() => {
    window.productFruitsReady = () => {
      setIsLoading(false)
    }
  }, [])

  return {
    checklistOpened,
    handleToggleChecklist,
    checklistData,
    isLoading,
  }
}

export { useChecklist, checklistContainerId, hiddenContainerId }
export type { ChecklistProps }
