<template>
  <div class="app-container">
    <a-flex :vertical="true">
      <div class="operate-description"></div>
      <div class="operate">
        <div class="operate-codition">
          <a-radio-group v-model:value="stringOperation.operationType">
            <a-radio id="merge" value="merge">合并</a-radio>
            <a-radio id="split" value="split">拆分</a-radio>
          </a-radio-group>
          分隔符:
          <a-select
            id="delimiter"
            style="width: 100px"
            v-model:value="stringOperation.delimiter"
            placeholder="选择分隔符"
          >
            <a-select-option value=",">, (逗号)</a-select-option>
            <a-select-option value=";">; (分号)</a-select-option>
            <a-select-option value="|">| (竖线)</a-select-option>
          </a-select>
          <a-checkbox
            id="operateQuotes"
            class="cb"
            v-if="stringOperation.operationType === 'split'"
            v-model:checked="stringOperation.operateQuotes"
            >去除首尾引号</a-checkbox
          >
          <a-checkbox
            id="operateQuotes"
            class="cb"
            v-if="stringOperation.operationType === 'merge'"
            v-model:checked="stringOperation.operateQuotes"
            >追加首尾引号</a-checkbox
          >
          <a-checkbox id="removeSpace" class="cb" v-model:checked="stringOperation.removeSpace"
            >去除首尾空格</a-checkbox
          >
          <a-checkbox
            id="removeDuplicate"
            class="cb"
            v-if="stringOperation.operationType === 'split'"
            v-model:checked="stringOperation.removeDuplicate"
          >
            结果去重
          </a-checkbox>
        </div>
        <div class="operate-btn">
          <a-button id="operate" class="btn" @click="operate">执行</a-button>
          <a-button id="copyResult" class="btn" @click="copyResult">复制结果</a-button>
        </div>
      </div>
      <div class="body">
        <a-textarea
          id="content"
          class="content"
          v-model:value="stringOperation.source"
          placeholder="请输入原始文本"
          :rows="20"
        />
        <span class="icon">=></span>
        <a-textarea
          id="result"
          class="result"
          placeholder="结果文本"
          v-model:value="stringOperation.result"
          :rows="20"
        />
      </div>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { copyToClipboard } from '@/components/common/clipboard'

interface StringOperation {
  operationType: string
  delimiter: string
  operateQuotes: boolean
  removeSpace: boolean
  removeDuplicate: boolean
  source: string
  dealStringArray: Array<string>
  result: string
}

const stringOperation = reactive<StringOperation>({
  operationType: 'merge',
  delimiter: ',',
  operateQuotes: true,
  removeSpace: true,
  removeDuplicate: true,
  source: '',
  dealStringArray: [],
  result: ''
})

const operate = async function () {
  console.log(stringOperation)
  if (stringOperation.operationType === 'merge') {
    merge()
  }
  if (stringOperation.operationType === 'split') {
    split()
  }
}

const merge = async function () {
  stringOperation.dealStringArray = splitText(stringOperation.source, '\n')
  removeSpace()
  operateQuotes()
  stringOperation.result = stringOperation.dealStringArray.join(stringOperation.delimiter)
}

const split = async function () {
  stringOperation.dealStringArray = splitText(stringOperation.source, stringOperation.delimiter)
  operateQuotes()
  removeSpace()
  remvoDuplicate()
  stringOperation.result = stringOperation.dealStringArray.join('\n')
}

const removeSpace = function () {
  if (!stringOperation.removeSpace) {
    return
  }
  stringOperation.dealStringArray.forEach((item, index) => {
    stringOperation.dealStringArray[index] = item.trim()
  })
}
const operateQuotes = function () {
  if (!stringOperation.operateQuotes) {
    return
  }
  if (stringOperation.operationType === 'merge') {
    stringOperation.dealStringArray.forEach((item, index) => {
      stringOperation.dealStringArray[index] = '"' + item + '"'
    })
  }
  if (stringOperation.operationType === 'split') {
    stringOperation.dealStringArray.forEach((item, index) => {
      if (item.startsWith('"')) {
        item = item.substring(1)
      }
      if (item.endsWith('"')) {
        item = item.substring(0, item.length - 1)
      }
      stringOperation.dealStringArray[index] = item
    })
  }
}

const remvoDuplicate = async function () {
  if (!stringOperation.removeDuplicate) {
    return
  }
  const uniqueArray = [...new Set(stringOperation.dealStringArray)]
  stringOperation.dealStringArray = uniqueArray
}

function splitText(text: string, delimiter: string): Array<string> {
  const lines = text.split(delimiter)
  let array: string[] = []
  for (let lineIndex in lines) {
    let item = lines[lineIndex]
    if (item) {
      array.push(item)
    }
  }
  return array
}

const copyResult = async function () {
  copyToClipboard(stringOperation.result)
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

.cb {
  margin-left: 16px;
}

.operate-btn {
  margin-top: 16px;
  display: flex;
  justify-content: right;
  align-items: end;
}
</style>
