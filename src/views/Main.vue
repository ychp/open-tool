<template>
  <a-layout>
    <a-layout-sider style="background: #fff">
      <div class="logo"></div>
      <a-menu
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        :openKeys="state.openKeys"
        :items="items"
        @openChange="onOpenChange"
        @click="handleMenuClick"
      >
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '600px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { ProfileOutlined, CodeOutlined, CalendarOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const state = reactive({
  selectedKeys: ['Homepage'],
  openKeys: ['Calander'],
  rootSubmenuKeys: ['Calander', 'CodeGenerator']
})

const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)
  if (!latestOpenKey || state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}

const handleMenuClick = (info: any) => {
  if (info.item && info.item.to) {
    console.log(info.item)
    router.push(info.item.to)
  }
}

const items = ref([
  {
    key: 'Homepage',
    icon: () => h(ProfileOutlined),
    label: '简介',
    to: '/'
  },
  {
    key: 'Calander',
    icon: () => h(CalendarOutlined),
    label: '时间工具',
    children: [
      {
        key: 'TimestampConversion',
        label: '时间戳转换',
        to: '/timestamp-convert'
      },
      {
        key: 'CalendarConversion',
        label: '公历、农历转换',
        to: '/calendar-convert'
      },
      {
        key: 'HolidayLookup',
        label: '节假日查询',
        to: '/holiday-lookup'
      }
    ]
  },
  {
    key: 'CodeGenerator',
    icon: () => h(CodeOutlined),
    label: '代码生成',
    children: [
      {
        key: 'GenerateByTable',
        label: '基于表结构生成代码',
        to: '/generate-by-table'
      },
      {
        key: 'GenerateBySQL',
        label: '基于SQL生成代码',
        to: '/generate-by-sql'
      }
    ]
  }
  // {
  //   key: 'Amusement',
  //   icon: () => h(CodeOutlined),
  //   label: '娱乐',
  //   children: [
  //     {
  //       key: 'MahjongScoreCalculator',
  //       label: '麻将分数计算器',
  //       to: '/mahjong-score'
  //     }
  //   ]
  // }
])
</script>
<style>
.logo {
  height: 32px;
  background: rgba(83, 59, 235, 0.3);
  margin: 16px;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
