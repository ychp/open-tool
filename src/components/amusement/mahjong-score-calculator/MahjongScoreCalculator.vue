<template>
  <div>单纯娱乐用的</div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import { Solar, Lunar, LunarYear } from 'lunar-typescript'
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
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()
    lunarDisplay.value = lunar.toString()
    gregorianDisplay.value = formState.selectedDate.format('YYYY-MM-DD')
  } else {
    const lunarDate = Lunar.fromYmd(
      parseInt(formState.lunarYear, 10),
      formState.isLeapMonth
        ? -parseInt(formState.lunarMonth, 10)
        : parseInt(formState.lunarMonth, 10),
      parseInt(formState.lunarDay, 10)
    )

    const gregorianDate = lunarDate.getSolar()
    console.log(lunarDate)
    console.log(gregorianDate)
    gregorianDisplay.value = gregorianDate.toYmd()
    lunarDisplay.value = lunarDate.toString()
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
    var lunarYear = LunarYear.fromYear(Number(newYear))
    const leapMonth = lunarYear.getLeapMonth()
    console.log(leapMonth)
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
