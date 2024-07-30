<template>
  <a-card title="文本比对">
    <a-textarea
      v-model:value="textDifference.leftText"
      placeholder="Enter text on the left"
      :rows="15"
      style="width: 49%"
      @change="compareTexts"
    />
    <a-textarea
      v-model:value="textDifference.rightText"
      placeholder="Enter text on the right"
      :rows="15"
      style="width: 49%; float: right"
      @change="compareTexts"
    />

    <div class="comparison-container">
      <div
        class="text-container"
        @mouseover="highlightText(true)"
        @mouseout="highlightText(false)"
        v-html="textDifference.formattedLeftText"
      ></div>
      <div
        class="text-container"
        @mouseover="highlightText(true)"
        @mouseout="highlightText(false)"
        v-html="textDifference.formattedRightText"
      ></div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import dmp from 'diff-match-patch'

interface TextDifference {
  leftText: string
  rightText: string
  formattedLeftText: string
  formattedRightText: string
  hoveredLine: number
}

const textDifference = reactive<TextDifference>({
  leftText: '',
  rightText: '',
  formattedLeftText: '',
  formattedRightText: '',
  hoveredLine: -1
})

// 比较两边的文本内容
function compareTexts(): void {
  const dmpInstance: any = new dmp() // 使用类型断言
  const diffsLeft = dmpInstance.diff_main(textDifference.leftText, textDifference.rightText)
  dmpInstance.diff_cleanupEfficiency(diffsLeft) // 清理差异以提高可读性
  textDifference.formattedLeftText = formatDiffs(diffsLeft, false, true)

  const diffsRight = dmpInstance.diff_main(textDifference.rightText, textDifference.leftText)
  dmpInstance.diff_cleanupSemantic(diffsRight) // 清理差异以提高可读性
  textDifference.formattedRightText = formatDiffs(diffsLeft, true, false)
}

function formatDiffs(diffs: any[], added: boolean, removed: boolean): string {
  return diffs
    .map((diff) => {
      if (diff[0] === 1) {
        if (added) {
          return `<span style="background-color: lightgreen;">${diff[1]}</span>`
        }
        return ''
      } else if (diff[0] === -1) {
        if (removed) {
          return `<span style="background-color: lightcoral;">${diff[1]}</span>`
        }
        return ''
      } else {
        return diff[1]
      }
    })
    .join('')
}

// 鼠标悬停事件
function highlightText(isHovering: boolean, lineIndex?: number): void {
  if (isHovering) {
    textDifference.hoveredLine = lineIndex!
  } else {
    textDifference.hoveredLine = -1
  }
}
</script>

<style scoped>
.comparison-container {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.text-container {
  width: 49%;
  white-space: pre-wrap;
}
</style>
