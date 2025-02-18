import medCodeMap from './medCodeMap.json'

// 将 medCodeMap 转换为 CSS 到类名的映射
export const cssToMedMap = new Map<string[], string>()

// 预处理 CSS 规则
Object.entries(medCodeMap).forEach(([className, cssValue]) => {
  const rules = cssValue.split('\n')
    .map(rule => rule.trim())
    .filter(Boolean)
    .map(rule => rule.replace(/;$/, ''))
  cssToMedMap.set(rules, className)
})

// 检查类名是否存在于 medCodeMap 中
export function hasClassName(className: string): boolean {
  return Object.prototype.hasOwnProperty.call(medCodeMap, className)
}

// 检查样式是否匹配规则集
export function matchRules(style: Record<string, string>, rules: string[]): boolean {
  const styleStrings = new Set<string>()

  // 处理所有样式
  Object.entries(style).forEach(([key, value]) => {
    styleStrings.add(`${key}:${value}`)
  })

  return rules.every(rule => styleStrings.has(rule))
}

// 移除匹配的样式
export function removeMatchedStyles(style: Record<string, string>, rules: string[]): void {
  const toDelete: string[] = []

  // 找出需要删除的属性
  Object.entries(style).forEach(([key, value]) => {
    if (rules.includes(`${key}:${value}`)) {
      toDelete.push(key)
    }
  })

  // 删除匹配的属性
  toDelete.forEach((key) => {
    delete style[key]
  })
}

// 尝试匹配所有可能的类
export function tryMatchClasses(style: Record<string, string>): string[] {
  const matchedClasses: string[] = []
  const remainingStyles = { ...style }

  // 尝试匹配所有类
  for (const [rules, className] of cssToMedMap.entries()) {
    if (matchRules(remainingStyles, rules)) {
      matchedClasses.push(className)
      removeMatchedStyles(remainingStyles, rules)
    }
  }

  return matchedClasses
}
