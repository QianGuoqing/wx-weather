const WEEK_LENGTH = 7
const dayMap = [
  '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
]

Page({
  data: {
    futureWeather: [1, 2, 3, 4, 5, 6, 7],
  },
  onLoad() {
    this._requestFutureWeather()
  },
  onPullDownRefreash() {
    this._requestFutureWeather(() => {
      wx.stopPullDownRefresh()
    })
  },
  _requestFutureWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: 'chengdu',
        time: Date.now()
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        // success
        res = res.data
        let result = res.result
        this._getFutureWeather(result)
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        callback && callback()
      }
    })
  },
  _getFutureWeather(result) {
    let futureWeather = []
    for (let i = 0; i < WEEK_LENGTH; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      futureWeather.push({
        day: dayMap[(date.getDay() + i) % 7],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        minTemp: result[(date.getDay() + i) % 7].minTemp,
        maxTemp: result[(date.getDay() + i) % 7].maxTemp,
        icon: `/images/${result[i].weather}-icon.png`
      })
    }

    this.setData({ futureWeather })
  }
})