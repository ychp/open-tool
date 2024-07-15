<template>
  <div class="app-container">
    <div :style="{ marginBottom: '16px' }">
      <a-button @click="remvoDuplicate">去重</a-button>
      <a-button @click="sortAsc">正向排序</a-button>
      <a-button @click="sortDesc">逆向排序</a-button>
    </div>
    <a-flex class="input-section">
      <a-textarea
        v-model:value="numberData.numberText"
        placeholder="请输入数字，换行分割"
        :rows="10"
      />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'

interface NumberData {
  numberText: string
}

const numberData = reactive<NumberData>({
  numberText: ''
})

onMounted(() => {})

const remvoDuplicate = async function () {
  const numberArray = parseText2Number(numberData.numberText)
  const uniqueArray = [...new Set(numberArray)]
  numberData.numberText = parseNumber2Text(uniqueArray)
}

const sortAsc = async function () {
  const numberArray = parseText2Number(numberData.numberText)
  numberArray.sort((a, b) => a - b)
  numberData.numberText = parseNumber2Text(numberArray)
}

const sortDesc = async function () {
  const numberArray = parseText2Number(numberData.numberText)
  numberArray.sort((a, b) => b - a)
  numberData.numberText = parseNumber2Text(numberArray)
}

function parseText2Number(text: string) {
  const lines = text.split('\n')
  return lines
    .map((line) => {
      const trimmedLine = line.trim()
      return trimmedLine ? Number(trimmedLine) : null
    })
    .filter((num) => num !== null)
}

function parseNumber2Text(numberArray: Array<Number>) {
  let text = ''
  for (let item in numberArray) {
    text += numberArray[item] + '\n'
  }
  return text
}
</script>

<style scoped>
.app-container {
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* 确保容器至少占据整个视口高度 */
}

.input-section {
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
}
</style>
