import type { TargetNodeTreeDTO } from '@/types'
import { ref } from 'vue'

// Record<KeyType, ValueType>
const nodeRulesS = ref<Record<string, TargetNodeTreeDTO[]>>({})

const clear = () => {
  // 清空所有数据
  nodeRulesS.value = {}
}

// 设置规则节点
const setNodeRules = (categoryId: string, rules: TargetNodeTreeDTO[]) => {
  nodeRulesS.value[categoryId] = rules
}

// 获取规则节点
const getNodeRules = (categoryId: string) => {
  return nodeRulesS.value?.[categoryId] || []
}

const store = { nodeRulesS, setNodeRules, getNodeRules, clear }

export const useNodeRulesStore = () => store
