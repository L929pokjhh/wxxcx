// committee.js
const app = getApp()

Page({
  data: {
    searchText: '',
    
  },

  onLoad: function (options) {
    console.log('专委会页面加载')
    this.loadCommitteeData()
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  // 搜索输入处理
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
    this.filterCommittees(e.detail.value)
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: ''
    })
    this.filterCommittees('')
  },
 // 功能卡片导航
 navigateToPage: function(e) {
    const page = e.currentTarget.dataset.page
    
    // 专委会页面直接跳转
    //汽车产业与技术专委会
    if (page === 'automobile industry') {
        wx.navigateTo({
          url: '/pages/automobile industry/automobile industry'
        })
        return
      }
     //人工智能专委会
     if (page === 'artificial intelligence') {
        wx.navigateTo({
          url: '/pages/artificial intelligence/artificial intelligence'
        })
        return
      }
    //新材料专委会
    if (page === 'new material') {
        wx.navigateTo({
          url: '/pages/new material/new material'
        })
        return
      }
    //智慧农业专委会
    if (page === 'intelligent agriculture') {
        wx.navigateTo({
          url: '/pages/intelligent agriculture/intelligent agriculture'
        })
        return
      }
    //投融资专委会
    if (page === 'investment and financing') {
        wx.navigateTo({
          url: '/pages/investment and financing/investment and financing'
        })
        return
      }
    //低空经济专委会
    if (page === 'low altitude economy') {
        wx.navigateTo({
          url: '/pages/low altitude economy/low altitude economy'
        })
        return
      }
    //清洁能源专委会
    if (page === 'clean energy') {
        wx.navigateTo({
          url: '/pages/clean energy/clean energy'
        })
        return
      }
    //经济法制专委会
    if (page === 'economic legal system') {
        wx.navigateTo({
          url: '/pages/economic legal system/economic legal system'
        })
        return
      }
    //艺术专委会
    if (page === 'art committee') {
        wx.navigateTo({
          url: '/pages/art committee/art committee'
        })
        return
      }
 },



  // 过滤专委会
  filterCommittees: function(searchText) {
    if (!searchText.trim()) {
      // 显示所有专委会
      this.loadCommitteeData()
      return
    }

   

    const filteredCommittees = allCommittees.filter(committee => 
      committee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      committee.description.toLowerCase().includes(searchText.toLowerCase())
    )

    this.setData({
      committees: filteredCommittees
    })
  },

  // 执行搜索
  performSearch: function() {
    const { searchText } = this.data
    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
      return
    }
    this.filterCommittees(searchText)
  },

  // 加载专委会数据
  loadCommitteeData: function() {
    // 从云数据库加载专委会数据
    const db = app.getDB()
    if (db) {
      db.collection('committees').orderBy('id', 'asc').get()
        .then(res => {
          if (res.data && res.data.length > 0) {
            console.log('从云数据库加载专委会数据成功')
            this.setData({
              committees: res.data
            })
          } else {
            console.log('使用默认专委会数据')
          }
        })
        .catch(err => {
          console.log('加载专委会数据失败，使用默认数据:', err)
        })
    }
  },

  // 专委会卡片点击
  onCommitteeCardTap: function(e) {
    const committeeId = e.currentTarget.dataset.id
    const committee = this.data.committees.find(item => item.id === committeeId)
    
    if (committee) {
      wx.showModal({
        title: committee.name,
        content: committee.description + '\n\n联系我们获取更多信息和服务支持。',
        showCancel: true,
        cancelText: '关闭',
        confirmText: '联系我们',
        success: (res) => {
          if (res.confirm) {
            wx.showModal({
              title: '联系方式',
              content: '获取更多详细资料，请联系：\n\n微信：chenchenchen_000\n\n电话：18917686962',
              showCancel: false,
              confirmText: '我知道了'
            })
          }
        }
      })
    }
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 显示联系我们弹窗
  showContactModal: function() {
    wx.showModal({
      title: '联系我们',
      content: '请联系：秘书长何忠成：18917688962（微信同号）',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#007AFF'
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 专委会',
      path: '/pages/committee/committee',
      imageUrl: '/images/share-committee.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadCommitteeData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success'
      })
    }, 1500)
  }
})
