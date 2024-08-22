<template>
  <a-list item-layout="horizontal" :data-source="data">
    <template #header>
      <div>
        <a href="https://github.com/ychp/chrome-extensions" target="_blank"
          ><CodeOutlined /> 源代码</a
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
            {{ item.description }}
          </template>
          <template #avatar>
            <a-avatar :src="item.icon" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { CodeOutlined } from '@ant-design/icons-vue'
interface DataItem {
  icon: string
  title: string
  description: string
}
const data: DataItem[] = [
  {
    icon: '/assets/chrome-extensions/multi-session.png',
    title: 'multi-session (开发中)',
    description: '同窗口多登录态组件'
  },
  {
    icon: '/assets/chrome-extensions/tab-sorter.png',
    title: 'tab-sorter',
    description:
      '窗口标签排序，目前支持title按照字典正序排序和倒序排序 以及 LUR，默认title按字典正序排序，可以通过右键插件选项中切换排序类型'
  }
]
</script>
