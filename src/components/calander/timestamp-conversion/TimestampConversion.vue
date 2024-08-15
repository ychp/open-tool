<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="timestamp-formart" header="时间戳转换" class="panel">
      <a-row class="card-row">
        <a-col class="card-col width-120"> 时间戳(毫秒) </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="timestamp-input"
            placeholder="输入时间戳"
            type="number"
            v-model:value="dateInfo.timestamp"
            @blur="updateAllFields('timestamp')"
            @pressEnter="updateAllFields('timestamp')"
            style="width: 160px"
          />
          <a-tooltip title="获取互联网北京时间">
            <a-button
              type="ghost"
              shape="circle"
              :loading="iconLoading"
              :icon="h(SyncOutlined)"
              @click="fetchInternetTime"
              size="small"
              style="margin-left: 10px"
            />
          </a-tooltip>
        </a-col>
        <a-col class="card-col width-120"> 年-月-日 时:分:秒 </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="datetime-input"
            type="text"
            v-model:value="dateInfo.dateTimeStr"
            @blur="updateAllFields('dateTime')"
            @pressEnter="updateAllFields('dateTime')"
            style="width: 180px"
          />
        </a-col>
        <a-col class="card-col width-120"> 年-月-日 </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="date-input"
            type="text"
            v-model:value="dateInfo.dateStr"
            @blur="updateAllFields('date')"
            @pressEnter="updateAllFields('date')"
            style="width: 160px"
          />
        </a-col>
        <a-col class="card-col width-120"> 年月日 </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="date-ymd-input"
            type="text"
            v-model:value="dateInfo.dateStrYMd"
            @blur="updateAllFields('dateYMd')"
            @pressEnter="updateAllFields('dateYMd')"
            style="width: 180px"
          />
        </a-col>
      </a-row>
    </a-collapse-panel>
    <a-collapse-panel key="timestamp-convert" header="时间转秒/毫秒" class="panel">
      <a-row class="card-row">
        <a-col class="card-col width-360">
          <a-input
            id="cal-timestamp-input"
            placeholder="日时分秒，输入格式为 1d3h15m30s"
            type="text"
            v-model:value="timeInfo.timeStr"
            @blur="calTime()"
            @pressEnter="calTime()"
            style="width: 260px"
          />
        </a-col>
        <a-col class="card-col width-80"> 秒(s) </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="seconds-input"
            type="number"
            v-model:value="timeInfo.seconds"
            style="width: 160px"
            disabled
          />
        </a-col>
        <a-col class="card-col width-80"> 毫秒(ms) </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="millis-input"
            type="number"
            v-model:value="timeInfo.milli"
            style="width: 160px"
            disabled
          />
        </a-col>
      </a-row>
    </a-collapse-panel>
    <a-collapse-panel key="date-cal" header="时间计算" class="panel">
      <a-row class="card-row">
        <a-col class="card-col width-120"> 开始时间 </a-col>
        <a-col class="card-col width-240">
          <a-date-picker
            id="start-date"
            v-model:value="dateCalculateInfo.startDate"
            placement="topLeft"
            @change="refreshDateCal()"
          />
        </a-col>
      </a-row>
      <a-row class="card-row">
        <a-col class="card-col width-120"> 截止 </a-col>
        <a-col class="card-col width-360">
          <a-date-picker
            id="end-date"
            v-model:value="dateCalculateInfo.endDate"
            @change="diffDays()"
            placement="topLeft"
          /><span style="margin-left: 5px">相差 {{ dateCalculateInfo.diffDays }} 天</span>
        </a-col>
        <a-col class="card-col width-120"> 增加 </a-col>
        <a-col class="card-col width-240">
          <a-input
            id="day-input"
            type="number"
            v-model:value="dateCalculateInfo.calDays"
            @blur="calDate()"
            @pressEnter="calDate()"
            style="width: 100px"
          /><span style="margin-left: 5px"
            >天后为 {{ moment(dateCalculateInfo.calDate.toDate()).format('YYYY-MM-DD') }}</span
          >
        </a-col>
      </a-row>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted, reactive, watch, ref, h } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import dayjs, { Dayjs } from 'dayjs'

const activeKey = ref(['timestamp-formart', 'timestamp-convert', 'date-cal'])

watch(activeKey, (val) => {
  console.log(val)
})

const iconLoading = ref<boolean>(false)

interface DateInfo {
  timestamp: Number
  dateTimeStr: string
  dateStr: string
  dateStrYMd: string
}

const dateInfo = reactive<DateInfo>({
  timestamp: Date.now(),
  dateTimeStr: moment().format('YYYY-MM-DD HH:mm:ss'),
  dateStr: moment().format('YYYY-MM-DD'),
  dateStrYMd: moment().format('YYYYMMDD')
})

interface TimeInfo {
  timeStr: string
  seconds: Number
  milli: Number
}

const timeInfo = reactive<TimeInfo>({
  timeStr: '',
  seconds: 0,
  milli: 0
})

interface DateCalculateInfo {
  startDate: Dayjs
  endDate: Dayjs
  diffDays: Number
  calDays: Number
  calDate: Dayjs
}

const dateCalculateInfo = reactive<DateCalculateInfo>({
  startDate: dayjs(),
  endDate: dayjs(),
  diffDays: 0,
  calDays: 0,
  calDate: dayjs()
})

onMounted(() => {
  fetchInternetTime()
})

const fetchInternetTime = async () => {
  try {
    iconLoading.value = true
    const response = await axios.get('http://worldtimeapi.org/api/ip')
    const dateTime = response.data.datetime
    dateInfo.timestamp = moment(dateTime).unix() * 1000
    updateAllFields('timestamp')
  } catch (error) {
    console.error('Failed to fetch internet time:', error)
  } finally {
    iconLoading.value = false
  }
}

const updateAllFields = async function (fieldType: 'timestamp' | 'dateTime' | 'date' | 'dateYMd') {
  let updatedTimestamp = 0

  if (fieldType === 'dateTime') {
    console.log('dateTimeStr:', dateInfo.dateTimeStr)
    if (dateInfo.dateTimeStr) {
      const dateObj = moment(dateInfo.dateTimeStr, 'YYYY-MM-DD HH:mm:ss')
      if (dateObj.isValid()) {
        updatedTimestamp = dateObj.toDate().valueOf()
      }
    }
  } else if (fieldType === 'timestamp') {
    updatedTimestamp = Number(dateInfo.timestamp)
    console.log('timestamp:', dateInfo.timestamp)
  } else if (fieldType === 'date') {
    console.log('dateStr:', dateInfo.dateStr)
    if (dateInfo.dateStr) {
      const dateObj = moment(dateInfo.dateStr, 'YYYY-MM-DD')
      if (dateObj.isValid()) {
        updatedTimestamp = dateObj.toDate().valueOf()
      }
    }
  } else if (fieldType === 'dateYMd') {
    console.log('dateYMd:', dateInfo.dateStrYMd)
    if (dateInfo.dateStrYMd) {
      const dateObj = moment(dateInfo.dateStrYMd, 'YYYYMMDD')
      if (dateObj.isValid()) {
        updatedTimestamp = dateObj.toDate().valueOf()
      }
    }
  }

  if (fieldType !== 'timestamp') {
    if (dateInfo.timestamp && +dateInfo.timestamp > 0) {
      dateInfo.timestamp = updatedTimestamp
    } else {
      dateInfo.timestamp = 0
    }
  }
  if (fieldType !== 'dateTime') {
    if (updatedTimestamp > 0) {
      dateInfo.dateTimeStr = moment.unix(updatedTimestamp / 1000).format('YYYY-MM-DD HH:mm:ss')
    } else {
      dateInfo.dateTimeStr = ''
    }
  }

  if (fieldType !== 'date') {
    if (updatedTimestamp > 0) {
      dateInfo.dateStr = moment.unix(updatedTimestamp / 1000).format('YYYY-MM-DD')
    } else {
      dateInfo.dateStr = ''
    }
  }

  if (fieldType !== 'dateYMd') {
    if (updatedTimestamp > 0) {
      dateInfo.dateStrYMd = moment.unix(updatedTimestamp / 1000).format('YYYYMMDD')
    } else {
      dateInfo.dateStrYMd = ''
    }
  }
}

const calTime = async function () {
  console.log(timeInfo)
  const { days, hours, minutes, seconds } = parseDuration(timeInfo.timeStr)
  timeInfo.seconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
  timeInfo.milli = Number(timeInfo.seconds) * 1000
}

const refreshDateCal = async function () {
  diffDays()
  calDate()
}

const diffDays = async function () {
  const start = dateCalculateInfo.startDate.toDate()
  const end = dateCalculateInfo.endDate.toDate()
  dateCalculateInfo.diffDays = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
}

const calDate = async function () {
  const calDate = dateCalculateInfo.startDate.add(Number(dateCalculateInfo.calDays), 'days')
  dateCalculateInfo.calDate = calDate
}

function parseDuration(durationStr: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const regex = /(\d+)(d|h|m|s)/g
  let match
  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0

  while ((match = regex.exec(durationStr)) !== null) {
    const value = parseInt(match[1], 10)
    switch (match[2]) {
      case 'd':
        days += value
        break
      case 'h':
        hours += value
        break
      case 'm':
        minutes += value
        break
      case 's':
        seconds += value
        break
    }
  }

  // 将所有单位转换成秒，然后反向计算出天、小时、分钟和秒
  let totalSeconds = seconds + minutes * 60 + hours * 3600 + days * 86400
  days = Math.floor(totalSeconds / 86400)
  totalSeconds %= 86400
  hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  minutes = Math.floor(totalSeconds / 60)
  seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}
</script>

<style scoped>
.card-row {
  padding-left: 10px;
}

.card-col {
  margin-top: 16px;
  margin-bottom: 16px;
  line-height: 30px;
}

.title {
  width: 120px;
}

.input-240 {
  width: 240px;
}

.input-500 {
  width: 500px;
}

.text-center {
  text-align: center;
}
</style>
