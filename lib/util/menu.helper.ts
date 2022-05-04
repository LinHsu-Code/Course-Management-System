import { DynamicNav } from '../model'

const getNameFromPath = (
  path: string,
  navData: DynamicNav[],
  isLast: boolean
): string | undefined => {
  for (let i = 0; i < navData.length; i++) {
    if (navData[i].subNav === undefined) {
      if (navData[i].path === `/${path}`) {
        return navData[i].label
      }
      continue
    } else {
      if (navData[i].path === `/${path}`) {
        if (isLast) {
          return navData[i].subNav?.[0].label
        } else {
          return navData[i].label
        }
      } else {
        const result = getNameFromPath(
          path,
          navData[i].subNav as DynamicNav[],
          isLast
        )
        if (result) {
          return result
        }
        continue
      }
    }
  }
}

export const generateBreadcrumbData = (
  paths: string[],
  navData: DynamicNav[],
  id: string | string[] | undefined,
  userRole: string
): { href: string; label: string | undefined }[] => {
  let menuPaths = paths
  if (typeof id === 'string') {
    menuPaths = [...menuPaths.slice(0, menuPaths.length - 1), id]
  }
  return menuPaths.map((item, index, arr) => {
    const href = arr.slice(0, index + 1).join('/')
    if (/\d+/g.test(item)) {
      return { href, label: 'Detail' }
    } else if (item.indexOf(userRole) !== -1) {
      return { href, label: `CMS ${userRole.toUpperCase()} SYSTEM` }
    } else {
      return {
        href,
        label: getNameFromPath(item, navData, index === arr.length - 1),
      }
    }
  })
}
