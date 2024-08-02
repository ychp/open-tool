<template>
  <div class="app-container">
    <a-flex :vertical="true">
      <div class="operate-description">
        <a-collapse v-model:activeKey="activeKey" collapsible="header">
          <a-collapse-panel key="1" header="功能说明">
            <p>
              1.信息提取: 输入对应的正则表达式, 点击“执行”, 按行提取出匹配部分的信息,
              如果当前行无匹配数据则跳过
            </p>
            <p>2.删除关键字: 填写需要清除的关键字, 多个关键字用英文逗号分割</p>
            <p style="padding-left: 16px">
              2.1.如果操作信息提取时已经填写了关键字, 则在提取信息同时会清除对应的关键字;
            </p>
            <p style="padding-left: 16px">
              2.2.如果已经提取了信息则可通过“删除关键字”按钮基于提取结果删除对应的关键字
            </p>
            <p>3.文本去重: 按行对结果数据进行去重操作</p>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="operate">
        <a-input
          class="input"
          placeholder="请输入需要提取正则表达式"
          type="text"
          v-model:value="extractor.expression"
          style="width: 250px"
        />
        <a-input
          class="input"
          placeholder="请输入需要清除的关键字"
          type="text"
          v-model:value="extractor.clearKeyWord"
          style="width: 200px"
        />
        <a-button class="btn" @click="extractContent">提取</a-button>
        <a-button class="btn" @click="remvoKeyWord">删除关键字</a-button>
        <a-button class="btn" @click="remvoDuplicate">去重</a-button>
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
        <a-textarea
          class="result"
          placeholder="结果文本"
          v-model:value="extractor.result"
          :rows="20"
        />
      </div>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

interface Extractor {
  content: string
  expression: string
  clearKeyWord: string
  result: string
}

const extractor = reactive<Extractor>({
  content: '',
  expression: '',
  clearKeyWord: '',
  result: ''
})

const activeKey = ref(['0'])

const remvoDuplicate = async function () {
  let stringArray = splitText(extractor.result)
  const uniqueArray = [...new Set(stringArray)]
  extractor.result = joinArray(uniqueArray)
}

const extractContent = async function () {
  extractor.result = ''
  if (!extractor.expression || extractor.expression === '') {
    const stringArray = splitText(extractor.content)
    for (let item of stringArray) {
      extractor.result += item + '\n'
    }
  } else {
    const regex = new RegExp(extractor.expression, 'g')
    const match = extractor.content.matchAll(regex)
    for (const item of match) {
      extractor.result += item[0] + '\n'
    }
  }
  remvoKeyWord()
}

const remvoKeyWord = async function () {
  if (!extractor.clearKeyWord || extractor.clearKeyWord === '') {
    return
  }

  let stringArray = splitText(extractor.result)
  let keywords = extractor.clearKeyWord.split(',')
  let newArray: string[] = []
  for (let item of stringArray) {
    for (let keyword of keywords) {
      item = item.replace(keyword, '')
    }
    newArray.push(item)
  }
  extractor.result = joinArray(newArray)
}

function splitText(text: string): Array<string> {
  const lines = text.split('\n')
  let array: string[] = []
  for (let lineIndex in lines) {
    let item = lines[lineIndex]
    item = item.trim()
    if (item) {
      array.push(item)
    }
  }
  return array
}

function joinArray(array: Array<string>) {
  let text = ''
  for (let item in array) {
    text += array[item] + '\n'
  }
  return text
}

const copyResult = async function () {
  await navigator.clipboard.writeText(extractor.result)
}
</script>

<style scoped>
.app-container {
  padding-top: 10px;
}

.operate-description {
  margin-bottom: 16px;
}

.operate {
  margin-bottom: 16px;
}

.operate .btn,
.input {
  margin-right: 10px;
}

.body {
  display: flex;
  margin-top: 10px;
  vertical-align: middle;
  align-items: center;
}

.content {
  width: 45%;
}

.icon {
  margin-left: 16px;
  margin-right: 16px;
}

.result {
  width: 45%;
}
</style>
