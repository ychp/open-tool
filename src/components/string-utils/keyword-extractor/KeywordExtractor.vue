<template>
  <div class="app-container">
    <a-flex :vertical="true">
      <div>
        <a-input
          id="input"
          placeholder="请输入需要提取正则表达式"
          type="text"
          v-model:value="extractor.expression"
          style="width: 250px"
        />
        <a-input
          id="input"
          placeholder="请输入需要在结果中清除的关键字"
          type="text"
          v-model:value="extractor.clearStr"
          style="margin-left: 10px; width: 200px"
        />
        <a-button class="btn" @click="extractContent">提取</a-button>
        <a-button class="btn" @click="copyResult">复制结果</a-button>
      </div>
      <div class="body">
        <a-textarea
          class="content"
          v-model:value="extractor.content"
          placeholder="请输入原始文本"
          :rows="20"
        />
        <a-label class="icon">=></a-label>
        <a-textarea class="result" v-model:value="extractor.result" :rows="20" disabled />
      </div>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

interface Extractor {
  content: string
  expression: string
  clearStr: string
  result: string
}

const extractor = reactive<Extractor>({
  content: '',
  expression: '',
  clearStr: '',
  result: ''
})

const extractContent = async function () {
  extractor.result = ''
  const regex = new RegExp(extractor.expression, 'g')
  const match = extractor.content.matchAll(regex)
  for (const item of match) {
    console.log(item[0])
    console.log(extractor.clearStr)
    console.log(item[0].replace(extractor.clearStr, ''))
    extractor.result += item[0].replace(extractor.clearStr, '') + '\n'
  }
}

const copyResult = async function () {
  await navigator.clipboard.writeText(extractor.result)
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

.body {
  display: flex;
  margin-top: 10px;
  vertical-align: middle;
  align-items: center;
}

.content {
  width: 40%;
}

.icon {
  margin-left: 16px;
  margin-right: 16px;
}

.result {
  width: 40%;
}
</style>
