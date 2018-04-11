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

Page({
  data: {
    nowTemperature: '',
    nowWeather: '',
    weatherBackground: ''
  },
  onLoad() {
    this._getNowWeatherInformation()
  },
  onPullDownRefreash() {
    this._getNowWeatherInformation(() => {
      wx.stopPullDownRefresh()
    })
  },
  _getNowWeatherInformation(callback) {
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
          let { temp, weather } = result.now
          this.setData({
            nowTemperature: temp,
            nowWeather: weatherMap[weather],
            weatherBackground: `/images/${weather}-bg.png`
          })

          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: weatherColorMap[weather]
          })
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
  }
})
