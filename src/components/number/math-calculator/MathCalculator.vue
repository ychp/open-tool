<template>
  <div class="app-container">
    <a-flex :vertical="true">
      <div>
        <a-input
          id="input"
          placeholder="请输入计算公式"
          type="text"
          v-model:value="calculator.formula"
          style="width: 200px"
        />
        <a-button class="btn" @click="calculate">计算</a-button>
      </div>
      <div class="result">
        <span>{{ calculator.result }}</span>
      </div>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import * as math from 'mathjs'

interface Calculator {
  formula: string
  result: string
}

const calculator = reactive<Calculator>({
  formula: '',
  result: ''
})

const calculate = async function () {
  try {
    calculator.result = math.evaluate(calculator.formula)
  } catch (error) {
    throw new Error(`Failed to evaluate formula: ${error}`)
  }
}
</script>

<style scoped>
.app-container {
  padding-top: 10px;
  min-height: 100vh; /* 确保容器至少占据整个视口高度 */
}
.btn {
  margin-left: 10px;
}

.result {
  margin-top: 10px;
}
</style>
