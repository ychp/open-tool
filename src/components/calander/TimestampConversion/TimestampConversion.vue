<template>
  <div>
    <a-form
      :model="formState"
      name="advanced-search"
      class="ant-advanced-search-form"
      layout="inline"
      autocomplete="false"
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
        <a-select v-model:value="formState.lunarYear" style="width: 120px">
          <template v-for="item in 100" :key="item">
            <a-select-option :value="`${item + 1970}`">{{ item + 1970 }}</a-select-option>
          </template>
        </a-select>
        <a-select v-model:value="formState.lunarMonth" style="width: 60px">
          <template v-for="item in 12" :key="item">
            <a-select-option :value="`${item}`">{{ item }}</a-select-option>
          </template>
        </a-select>
        <a-select v-model:value="formState.lunarDay" style="width: 60px">
          <template v-for="item in 30" :key="item">
            <a-select-option :value="`${item}`">{{ item }}</a-select-option>
          </template>
        </a-select>
        <!-- 假设闰月逻辑是通过另一个字段控制的 -->
        <a-switch
          v-model:checked="formState.isLeapMonth"
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
import { ref, reactive, onMounted, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'

interface FormState {
  calendarType: string
  selectedDate: Dayjs
  lunarYear: string
  lunarMonth: string
  lunarDay: string
  isLeapMonth: boolean
}
const formState = reactive<FormState>({
  calendarType: 'gregorian', // 默认值为公历
  selectedDate: dayjs(),
  lunarYear: '2023',
  lunarMonth: '1',
  lunarDay: '1',
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
      parseInt(formState.lunarYear, 10),
      parseInt(formState.lunarMonth, 10),
      parseInt(formState.lunarDay, 10),
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
  formState.lunarYear = dayjs().year() + ''
  onFinish() // 默认执行一次转换，以显示今天的日期信息
})

watch(
  [() => formState.lunarYear, () => formState.lunarMonth],
  ([newYear, newMonth], [oldYear, oldMonth]) => {
    // 检查所选年份是否有闰月，以及所选月份是否为该闰月
    const leapMonth = chineseLunar.leapMonthOfYear(newYear)
    if (leapMonth && parseInt(newMonth, 10) === leapMonth) {
      if (formState.isLeapMonth === true) {
        return
      }
      // 如果当前选择的月份是闰月，则弹窗提示用户
      Modal.confirm({
        title: '查询闰月',
        content: `检测到${newYear}年的${newMonth}月是闰月，您想查询闰${newMonth}月吗？`,
        onOk() {
          // 如果用户选择是，则将isLeapMonth切换为true
          formState.isLeapMonth = true
        },
        onCancel() {
          // 如果用户选择否，可以选择不做任何事，或者根据需要调整逻辑
          console.log('用户选择了不查询闰月')
        }
      })
    }
  },
  { deep: true, immediate: false }
)
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
