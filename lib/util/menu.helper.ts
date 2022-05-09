import { DynamicNav } from '../model'

export const bfsOne = (
  source: DynamicNav[],
  value: string,
  queue: { parent: DynamicNav[]; node: DynamicNav }[] = [],
  parent: DynamicNav[] = []
): DynamicNav[] | undefined => {
  source.forEach((item) => {
    queue.push({ parent: parent, node: item })
  })
  while (!!queue.length) {
    const next = queue.shift()
    if (next) {
      const { parent, node } = next
      if (node.path === value && !node.isNotPage) {
        if (parent.slice(-1)[0].path === node.path) {
          parent.pop()
        }
        parent.push(node)
        return parent
      }
      if (!!node.subNav) {
        return bfsOne(node.subNav, value, queue, [...parent, node])
      }
    }
  }
}
