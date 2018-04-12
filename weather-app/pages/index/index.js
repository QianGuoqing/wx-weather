const weatherMap = {
  sunny: '晴天',
  cloudy: '多云',
  overcast: '阴',
  lightrain: '小雨',
  heavyrain: '大雨',
  snow: '雪'
}

const weatherColorMap = {
  sunny: '#cbeefd',
  cloudy: '#deeef6',
  overcast: '#c6ced2',
  lightrain: '#bdd5e1',
  heavyrain: '#c5ccd0',
  snow: '#aae1fc'
}

const HOUR_24 = 24
const HOUR_INTERVAL = 3

Page({
  data: {
    nowTemperature: '',
    nowWeather: '',
    weatherBackground: '',
    weatherByHour: [],
    todayTimeString: '',
    minTemp: '',
    maxTemp: ''
  },
  onLoad() {
    this.setData({
      todayTimeString: this._getTodayTimeString()
    })
    this.getNowWeatherInformation()
  },
  onPullDownRefreash() {
    this.getNowWeatherInformation(() => {
      wx.stopPullDownRefresh()
    })
  },
  onRedirectToFutureWeather() {
    wx.navigateTo({
      url: '/pages/list/list'
    })
  },
  getNowWeatherInformation(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'chengdu'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        // success
        res = res.data
        if (res.code === 200) {
          let result = res.result

          this._getCurrentTimeWeather(result)
          this._getHourlyWeatherForecast(result)
        }
      },
      fail: () => {
        // fail
      },
      complete: () => {
        // complete
        callback && callback()
      }
    })
  },
  _getCurrentTimeWeather(result) {
    let { temp, weather } = result.now
    let { minTemp, maxTemp } = result.today
    this.setData({
      nowTemperature: temp,
      nowWeather: weatherMap[weather],
      weatherBackground: `/images/${weather}-bg.png`,
      minTemp,
      maxTemp
    })

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },
  _getHourlyWeatherForecast(result) {
    let forecast = result.forecast
    let weatherByHour = []
    for (let i = 0; i < HOUR_24; i += HOUR_INTERVAL) {
      weatherByHour.push({
        hour: (new Date().getHours() + i) % 24 + '时',
        icon: `/images/${forecast[i / HOUR_INTERVAL].weather}-icon.png`,
        temperature: `${forecast[i / HOUR_INTERVAL].temp}°`
      })
      weatherByHour[0].hour = '现在'
    }
    this.setData({ weatherByHour })
  },
  _getTodayTimeString() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return  `${year} - ${month} - ${day} 今天` 
  }
})
