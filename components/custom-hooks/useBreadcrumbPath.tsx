import { useRouterPath } from './useRouterPath'
import { toPascalCase } from '../../lib/util'
export const useBreadcrumbPath = () => {
  const route = useRouterPath()
  console.log(route)
  const removeQuestionMark = route.replace(/\?/g, '/')
  const removeEquals = removeQuestionMark.replace(/\=/g, '/')
  const pathToPascalCase = toPascalCase(removeEquals)
  console.log(pathToPascalCase.split('/'))
  return pathToPascalCase.split('/')
}
