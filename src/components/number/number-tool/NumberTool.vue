<template>
  <div class="app-container">
    <div class="operate">
      <a-button id="remvoDuplicate" class="btn" @click="remvoDuplicate">去重</a-button>
      <a-button id="sortAsc" class="btn" @click="sortAsc">正向排序</a-button>
      <a-button id="sortDesc" class="btn" @click="sortDesc">逆向排序</a-button>
    </div>
    <a-flex class="input-section">
      <a-textarea
        id="numberText"
        v-model:value="numberData.numberText"
        placeholder="请输入数字，换行分割"
        :rows="20"
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
  numberArray.sort((a, b) => Number(a) - Number(b))
  numberData.numberText = parseNumber2Text(numberArray)
}

const sortDesc = async function () {
  const numberArray = parseText2Number(numberData.numberText)
  numberArray.sort((a, b) => Number(b) - Number(a))
  numberData.numberText = parseNumber2Text(numberArray)
}

function parseText2Number(text: string): Array<Number> {
  const lines = text.split('\n')
  let numberArray = []
  for (let lineIndex in lines) {
    let item = lines[lineIndex]
    item = item.trim()
    if (item) {
      numberArray.push(Number(item))
    }
  }
  return numberArray
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
}

.operate {
  margin-bottom: 16px;
}

.operate .btn {
  margin-right: 10px;
}

.input-section {
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
}
</style>
