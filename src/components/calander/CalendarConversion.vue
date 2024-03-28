<template>
  <div>
    <a-form
      :model="formState"
      name="advanced-search"
      class="ant-advanced-search-form"
      layout="inline"
      autocomplete=""
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item>
        <a-radio-group v-model:value="formState.calendarType">
          <a-radio-button value="gregorian">公历</a-radio-button>
          <a-radio-button value="lunar">农历</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <!-- 公历日期选择器 -->
      <a-form-item v-if="formState.calendarType === 'gregorian'">
        <a-date-picker v-model:value="formState.selectedDate" />
      </a-form-item>

      <!-- 农历日期选择器（示例中仅显示年月日，额外闰月字段需要自行添加） -->
      <a-form-item v-else>
        <!-- 这里可以根据需要添加对农历年、月、日和是否闰月的输入处理 -->
        <a-input v-model:value="formState.lunarYear" placeholder="农历年" />
        <a-input v-model:value="formState.lunarMonth" placeholder="农历月" />
        <a-input v-model:value="formState.lunarDay" placeholder="农历日" />
        <!-- 假设闰月逻辑是通过另一个字段控制的 -->
        <a-switch
          v-model:value="formState.isLeapMonth"
          checked-children="闰月"
          un-checked-children="平月"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">查询</a-button>
      </a-form-item>
    </a-form>

    <div class="search-result-list">
      <a-row :gutter="30">
        <a-col :span="6" style="text-align: left"> 公历: {{ gregorianDisplay }} </a-col>
        <a-col :span="6" style="text-align: left"> 农历: {{ lunarDisplay }} </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import chineseLunar from 'chinese-lunar'
import dayjs, { Dayjs } from 'dayjs'

interface FormState {
  calendarType: string
  selectedDate: Dayjs
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  isLeapMonth: boolean
}
const formState = reactive<FormState>({
  calendarType: 'gregorian', // 默认值为公历
  selectedDate: dayjs(),
  lunarYear: dayjs().year(),
  lunarMonth: 1,
  lunarDay: 1,
  isLeapMonth: false
})

const gregorianDisplay = ref('')
const lunarDisplay = ref('')

const onFinish = () => {
  const date = formState.selectedDate.toDate()
  if (formState.calendarType === 'gregorian') {
    const lunar = chineseLunar.solarToLunar(date)
    lunarDisplay.value = chineseLunar.format(lunar, 'Y-M-d')
    gregorianDisplay.value = formState.selectedDate.format('YYYY-MM-DD')
  } else {
    const gregorianDate = chineseLunar.lunarToSolar(
      formState.lunarYear,
      formState.lunarMonth,
      formState.lunarDay,
      formState.isLeapMonth
    )
    gregorianDisplay.value = dayjs(gregorianDate).format('YYYY-MM-DD')
    const lunar = chineseLunar.solarToLunar(gregorianDate)
    lunarDisplay.value = chineseLunar.format(lunar, 'Y-M-d')
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

onMounted(() => {
  onFinish() // 默认执行一次转换，以显示今天的日期信息
})
</script>
<style scoped>
.search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
  background-color: #fafafa;
  text-align: center;
  min-height: 500px;
  padding: 16px 15px 0px 15px;
}
</style>
