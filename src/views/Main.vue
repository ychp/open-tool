<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="state.collapsed" collapsible>
      <div class="logo" v-if="state.collapsed">YZ</div>
      <div class="logo-big" v-else>Y Z</div>
      <a-menu
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :openKeys="state.openKeys"
        :items="items"
        @openChange="onOpenChange"
        @click="handleMenuClick"
      >
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ minHeight: '100vh' }">
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '500px'
        }"
      >
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <p>
          © 2024 Create By 云止.
          <a-button type="link" href="https://github.com/ychp/open-tool" target="_blank"
            ><CodeOutlined />源代码</a-button
          >
        </p>
        <a-button type="link" href="https://beian.miit.gov.cn/" target="_blank"
          >备案号: 浙ICP备2024102079号-2</a-button
        >
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  CodeOutlined,
  CalendarOutlined,
  FieldBinaryOutlined,
  FieldStringOutlined,
  ControlOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  selectedKeys: ['Homepage'],
  openKeys: ['Calander'],
  rootSubmenuKeys: ['Calander', 'NumberUtils', 'StringUtils', 'CodeGenerator'],
  collapsed: false
})

// 根据当前路由设置 selectedKeys 和 openKeys
function setMenuStateFromRoute() {
  let selectedKey = 'Homepage'
  let openKey = ''

  switch (route.name) {
    case 'TimestampConversion':
    case 'CalendarConversion':
    case 'HolidayLookup':
      selectedKey = route.name
      openKey = 'Calander'
      break
    case 'NumberDeal':
    case 'MathCalculator':
      selectedKey = route.name
      openKey = 'NumberUtils'
      break
    case 'StringCommonUtils':
    case 'StringJoinAndSplit':
    case 'TextDifference':
      selectedKey = route.name
      openKey = 'StringUtils'
      break
    case 'GenerateByTable':
    case 'GenerateBySQL':
      selectedKey = route.name
      openKey = 'CodeGenerator'
      break
    case 'ChromeExtensions':
      selectedKey = route.name
      break
    // 其他情况...
    default:
      selectedKey = 'Homepage'
      openKey = ''
  }

  state.selectedKeys = [selectedKey]
  state.openKeys = [openKey]
}

// 在组件挂载时调用函数
onMounted(() => {
  setMenuStateFromRoute()
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
    icon: () => h(HomeOutlined),
    label: '主页',
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
    key: 'NumberUtils',
    icon: () => h(FieldBinaryOutlined),
    label: '数字工具',
    children: [
      {
        key: 'NumberDeal',
        label: '数字去重&排序',
        to: '/number-tool'
      },
      {
        key: 'MathCalculator',
        label: '简单计算器',
        to: '/math-calculator'
      }
    ]
  },
  {
    key: 'StringUtils',
    icon: () => h(FieldStringOutlined),
    label: '文本工具',
    children: [
      {
        key: 'StringCommonUtils',
        label: '文本处理工具',
        to: '/string-common-utils'
      },
      {
        key: 'StringJoinAndSplit',
        label: '文本合并切分',
        to: '/string-join-and-split'
      }
      // ,
      // {
      //   key: 'TextDifference',
      //   label: '文本比对',
      //   to: '/text-difference'
      // }
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
  },
  {
    key: 'ChromeExtensions',
    icon: () => h(ControlOutlined),
    label: '谷歌浏览器插件',
    to: '/chrome-extensions'
  }
])
</script>
<style>
.logo {
  height: 55px;
  background: rgb(0, 130, 237);
  color: #fff;
  font-weight: bold;
  font-style: italic;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  display: flex;
}

.logo-big {
  height: 55px;
  background: rgb(0, 130, 237);
  color: #fff;
  font-weight: bold;
  font-style: italic;
  align-items: center;
  justify-content: center;
  font-size: 45px;
  display: flex;
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

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.footer {
  text-align: center;
}

.width-80 {
  width: 120px;
}

.width-120 {
  width: 120px;
}

.width-240 {
  width: 240px;
}

.width-360 {
  width: 360px;
}
</style>
