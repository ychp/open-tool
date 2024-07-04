<template>
  <div class="app-container">
    <!-- 展示互联网当前时间 -->
    <div class="internet-time-display">
      <span>
        北京时间: {{ dateInfo.internetCurrentDateTime }} ({{ dateInfo.internetCurrentTimeStamp }})

        <a-button type="primary" shape="circle" @click="fetchInternetTime">
          <template #icon><SyncOutlined /></template>
        </a-button>
      </span>
    </div>
    <!-- 时间戳和日期时间输入组件 -->
    <div class="input-section">
      <a-row>
        <a-col :span="6" class="item">
          <label for="timestamp-input">时间戳(毫秒)</label>
          <a-input
            id="timestamp-input"
            placeholder="输入时间戳"
            type="number"
            v-model:value="dateInfo.timestamp"
            @blur="updateAllFields('timestamp')"
            @pressEnter="updateAllFields('timestamp')"
            style="width: 200px"
          />
        </a-col>
        <a-col :span="6" class="item">
          <label for="datetime-input">年-月-日 时:分:秒</label>
          <a-input
            id="datetime-input"
            type="text"
            v-model:value="dateInfo.dateTimeStr"
            @blur="updateAllFields('dateTime')"
            @pressEnter="updateAllFields('dateTime')"
            style="width: 200px"
          />
        </a-col>
        <a-col :span="6" class="item">
          <label for="datetime-input">年-月-日</label>
          <a-input
            id="datetime-input"
            type="text"
            v-model:value="dateInfo.dateStr"
            @blur="updateAllFields('date')"
            @pressEnter="updateAllFields('date')"
            style="width: 120px"
          />
        </a-col>
        <a-col :span="6" class="item">
          <label for="datetime-input">年月日</label>
          <a-input
            id="datetime-input"
            type="text"
            v-model:value="dateInfo.dateStrYMd"
            @blur="updateAllFields('dateYMd')"
            @pressEnter="updateAllFields('dateYMd')"
            style="width: 120px"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted, reactive } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'
import moment from 'moment'

interface DateInfo {
  timestamp: Number
  dateTimeStr: string
  dateStr: string
  dateStrYMd: string
  internetCurrentTimeStamp: Number
  internetCurrentDateTime: string
}

const dateInfo = reactive<DateInfo>({
  timestamp: Date.now(),
  dateTimeStr: moment().format('YYYY-MM-DD HH:mm:ss'),
  dateStr: moment().format('YYYY-MM-DD'),
  dateStrYMd: moment().format('YYYYMMDD'),
  internetCurrentTimeStamp: Date.now(),
  internetCurrentDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
})

onMounted(() => {
  fetchInternetTime()
})

const fetchInternetTime = async () => {
  try {
    const response = await axios.get('http://worldtimeapi.org/api/ip')
    const dateTime = response.data.datetime
    dateInfo.internetCurrentTimeStamp = moment(dateTime).unix() * 1000
    dateInfo.internetCurrentDateTime = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    console.error('Failed to fetch internet time:', error)
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
    if (dateInfo.timestamp && dateInfo.timestamp > 0) {
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
</script>

<style scoped>
.app-container {
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* 确保容器至少占据整个视口高度 */
}

.internet-time-display {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
}

.input-section {
  flex-direction: column;
  width: 100%;
  /* max-width: 400px; 设置最大宽度以适应不同屏幕尺寸 */
}

.input-section .item {
  padding-left: 10px;
  padding-right: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}
</style>
