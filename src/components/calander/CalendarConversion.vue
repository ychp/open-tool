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
        <a-date-picker v-model:value="formState.selectedDate" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">查询</a-button>
      </a-form-item>
    </a-form>

    <div class="search-result-list">
      <a-row :gutter="30">
        <a-col :span="5" style="text-align: left"> 公历: {{ gregorianDisplay }} </a-col>
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
}
const formState = reactive<FormState>({
  calendarType: 'gregorian', // 默认值为公历
  selectedDate: dayjs()
})

const gregorianDisplay = ref('')
const lunarDisplay = ref('')

const onFinish = () => {
  const date = formState.selectedDate.toDate()
  const lunar = chineseLunar.solarToLunar(date)
  console.log(lunar)
  lunarDisplay.value = chineseLunar.format(lunar, 'YMd')
  gregorianDisplay.value = formState.selectedDate.format('YYYY-MM-DD')
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
