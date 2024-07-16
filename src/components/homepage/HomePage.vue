<template>
  <a-card class="calendar-card">
    <template #title>
      <Text strong>今日信息</Text>
    </template>
    <a-row class="row">
      <a-col :span="24" class="date col">
        {{ todayInfo.today.getYear() }} 年 {{ todayInfo.today.getMonth() }} 月
        {{ todayInfo.today.getDay() }} 日
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="24" class="date col">周{{ todayInfo.today.getWeekInChinese() }}</a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="24" class="date col">农历 {{ todayInfo.today.getLunar().toString() }}</a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="24" class="count-down col"
        >距离周末还有 {{ todayInfo.leftDaysByWeekend }} 天</a-col
      >
    </a-row>
  </a-card>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { Solar, Lunar, LunarYear } from 'lunar-typescript'

interface TodayInfo {
  today: Solar
  leftDaysByWeekend: number
  leftDaysByHoliday: Array<number>
}
const todayInfo = reactive<TodayInfo>({
  today: Solar.fromDate(new Date()),
  leftDaysByWeekend: 0,
  leftDaysByHoliday: []
})

onMounted(() => {
  todayInfo.leftDaysByWeekend = 5 - todayInfo.today.getWeek()
})
</script>

<style scoped>
.calendar-card {
  width: 50%;
  margin-right: 16px;
  margin-bottom: 16px;
}

.calendar-card .row {
  margin-top: 16px;
  /* background-color: #000; */
}

.col {
  text-align: center;
}

.date {
  font-size: 24px;
}

.count-down {
  font-size: 18px;
}
</style>
