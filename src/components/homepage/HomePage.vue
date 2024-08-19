<template>
  <a-flex :vertical="false">
    <a-card class="calendar-card">
      <template #title>
        <Text strong>日历</Text>
      </template>
      <a-row class="row" style="margin-bottom: 20px">
        <a-col :span="8" class="col single-date">
          <a-input type="number" v-model:value="todayInfo.year" /> 年
        </a-col>
        <a-col :span="8" class="col single-date">
          <a-select class="month" bordered v-model:value="todayInfo.month" size="large">
            <option :value="i" :key="`option-${i}`" v-for="i in 12">{{ i }}</option>
          </a-select>
          月
        </a-col>
        <a-col :span="8" class="col single-date">
          <a-input v-model:value="todayInfo.day" /> 日
        </a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="24" class="col full-date">
          公历 {{ todayInfo.today.getYear() }}年 {{ todayInfo.today.getMonth() }}月
          {{ todayInfo.today.getDay() }}日 星期{{ todayInfo.today.getWeekInChinese() }}
          {{ todayInfo.today.getXingZuo() }}座
        </a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="24" class="col day">
          <a-button @click="prevDay"><CaretLeftFilled height="50" /></a-button>
          <span style="width: 100px; margin-left: 10px; margin-right: 10px">{{
            todayInfo.today.getDay()
          }}</span>
          <a-button @click="nextDay"><CaretRightFilled /></a-button>
        </a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="24" class="col lunar">
          农历 {{ todayInfo.today.getLunar().getYearInChinese() }}年{{
            todayInfo.today.getLunar().getMonthInChinese()
          }}月{{ todayInfo.today.getLunar().getDayInChinese() }}
        </a-col>
      </a-row>
    </a-card>
    <a-card class="holiday-card">
      <template #title>
        <Text strong>假期倒计时</Text>
      </template>
      <a-row class="row" v-for="{ name, leftDays } in todayInfo.leftDaysByOther" :key="name">
        <a-col :span="24" class="count-down col"
          >距离 {{ name }} 还有 <span style="color: red">{{ leftDays }}</span> 天
        </a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="24" class="count-down col" v-if="todayInfo.leftDaysByWeekend > 0">
          距离周末还有 {{ todayInfo.leftDaysByWeekend }} 天
        </a-col>
        <a-col :span="24" class="count-down col" v-if="todayInfo.leftDaysByWeekend == 0">
          明天就周末了，再坚持一下。
        </a-col>
        <a-col :span="24" class="count-down col" v-if="todayInfo.leftDaysByWeekend == -1">
          今天周末啦！！！
        </a-col>
        <a-col :span="24" class="count-down col" v-if="todayInfo.leftDaysByWeekend == -2">
          明天要上班，惊不惊喜，意不意外 ->.->
        </a-col>
      </a-row>
      <a-row class="row" v-for="{ name, leftDays } in todayInfo.leftDaysByHoliday" :key="name">
        <a-col :span="24" class="count-down col">距离 {{ name }} 还有 {{ leftDays }} 天 </a-col>
      </a-row>
    </a-card>
  </a-flex>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { Solar, HolidayUtil } from 'lunar-typescript'
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons-vue'

interface TodayInfo {
  today: Solar
  year: number
  month: number
  day: number
  leftDaysByWeekend: number
  leftDaysByOther: Array<HolidayInfo>
  leftDaysByHoliday: Array<HolidayInfo>
}

interface HolidayInfo {
  name: string
  date: Solar
  leftDays: number
}

const todayInfo = reactive<TodayInfo>({
  today: Solar.fromDate(new Date()),
  year: Solar.fromDate(new Date()).getYear(),
  month: Solar.fromDate(new Date()).getMonth(),
  day: Solar.fromDate(new Date()).getDay(),
  leftDaysByWeekend: 0,
  leftDaysByOther: [],
  leftDaysByHoliday: []
})

onMounted(() => {
  refreshDate()
})

const prevDay = async () => {
  todayInfo.today = todayInfo.today.next(-1)
  refreshDate()
}

const nextDay = async () => {
  todayInfo.today = todayInfo.today.next(1)
  refreshDate()
}

const refreshDate = async () => {
  todayInfo.year = todayInfo.today.getYear()
  todayInfo.month = todayInfo.today.getMonth()
  todayInfo.day = todayInfo.today.getDay()
  todayInfo.leftDaysByOther = []
  const domain = window.location.hostname
  if (domain.includes('yingchengpeng.com')) {
    todayInfo.leftDaysByOther.push(
      reactive<HolidayInfo>({
        name: '2024-09-26',
        date: Solar.fromYmd(2024, 9, 26),
        leftDays:
          Solar.fromYmd(2024, 9, 26).subtract(
            Solar.fromYmd(
              todayInfo.today.getYear(),
              todayInfo.today.getMonth(),
              todayInfo.today.getDay()
            )
          ) - 1
      })
    )
  }
  calHolidayCountDown()
}

const calHolidayCountDown = async () => {
  const currentWeek = todayInfo.today.getWeek()
  todayInfo.leftDaysByWeekend = currentWeek == 0 ? -2 : 5 - currentWeek
  let holidays = HolidayUtil.getHolidays(todayInfo.today.getYear())
  holidays = holidays.filter((item) => !item.isWork())

  const groupedHolidays = new Map<string, Solar[]>()
  holidays.forEach((holiday) => {
    const name = holiday.getName()
    if (!groupedHolidays.has(name)) {
      groupedHolidays.set(name, [])
    }
    groupedHolidays.get(name)!.push(Solar.fromDate(new Date(holiday.getDay())))
  })

  // 在每个组中找到 day 最小的数据
  let holidayInfos = Array.from(groupedHolidays.entries()).map(([name, holidays]) => {
    const earliestHoliday = holidays.reduce((prev, curr) =>
      prev ? (prev.isBefore(curr) ? prev : curr) : curr
    )
    return reactive<HolidayInfo>({
      name: name,
      date: earliestHoliday,
      leftDays: 0
    })
  })

  holidayInfos = holidayInfos.sort((pre, next) => {
    if (pre.date < next.date) {
      return -1
    }
    if (pre.date > next.date) {
      return 1
    }
    return 0
  })

  holidayInfos = holidayInfos.filter((holiday) => holiday.date > todayInfo.today)
  for (let holiday of holidayInfos) {
    holiday.leftDays =
      holiday.date.subtract(
        Solar.fromYmd(
          todayInfo.today.getYear(),
          todayInfo.today.getMonth(),
          todayInfo.today.getDay()
        )
      ) - 1
  }

  todayInfo.leftDaysByHoliday = holidayInfos
}
</script>

<style scoped>
.calendar-card {
  width: 40%;
  min-width: 500px;
  max-width: 550px;
  height: 450px;
  margin-right: 16px;
  margin-bottom: 16px;
}

.calendar-card .row {
  margin-top: 16px;
}

.calendar-card .row .col {
  text-align: center;
}

.single-date {
  font-size: 20px;
}

.single-date input {
  border: 1px solid #d7d9e0;
  box-sizing: border-box;
  padding: 7px;
  border-radius: 6px;
  line-height: 1;
  position: relative;
  background: #ffffff;
  width: 80px;
  margin-right: 6px;
  text-align: center;
  font-size: 20px;
  outline: none;
}
.single-date .month {
  border-radius: 6px;
  position: relative;
  width: 80px;
  margin-right: 6px;
  text-align: center;
  font-size: 20px;
}

.count-down {
  font-size: 18px;
}

.full-date,
.lunar {
  font-size: 16px;
}

.day {
  font-size: 80px;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day button {
  border: none;
  padding: 0px;
  width: 60px;
  color: red;
  height: 60px;
  line-height: 50px;
  font-size: 45px;
  text-align: center;
}

.holiday-card {
  width: 45%;
  max-width: 500px;
}
</style>
