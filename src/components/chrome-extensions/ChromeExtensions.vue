<template>
  <a-list item-layout="horizontal" :data-source="data">
    <template #header>
      <div style="width: 100%; display: flex; align-items: center; justify-content: center">
        <a href="https://github.com/ychp/chrome-extensions" target="_blank"
          ><CodeOutlined /> Chrome Extensions 源代码</a
        >
      </div>
    </template>
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            {{ item.title }}
          </template>
          <template #description>
            <div v-html="item.description"></div>
          </template>
          <template #avatar>
            <a-avatar
              :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }"
              :src="item.icon"
            />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { CodeOutlined } from '@ant-design/icons-vue'
import multiSession from '@/assets/images/multi-session.png'
import tabSorter from '@/assets/images/tab-sorter.png'

interface DataItem {
  icon: string
  title: string
  description: string
}
const data: DataItem[] = [
  // {
  //   icon: multiSession,
  //   title: 'multi-session (开发中)',
  //   description: '同窗口多登录态组件'
  // },
  {
    icon: tabSorter,
    title: '标签排序 tab-sorter',
    description:
      '<p>目前支持三种模式的排序(默认为1,切换排序方式,可以通过右键插件选项中切换):</p>' +
      '<p style="padding-left: 16px;">1.根据title按照字典正序排序</p>' +
      '<p style="padding-left: 16px;">2.根据title按照字典倒序排序</p>' +
      '<p style="padding-left: 16px;">3.LUR</p>'
  }
]
</script>
