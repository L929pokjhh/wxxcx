//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '同心济世博士联盟',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息
    showAgreementModal: false, // 显示告知窗口
    agreementRead: false // 是否已阅读协议
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  // 跳转到注册页面
  goToRegister: function() {
    this.setData({
      showAgreementModal: true
    })
  },

  // 确认阅读协议
  confirmAgreement: function() {
    if (!this.data.agreementRead) {
      wx.showToast({
        title: '请先阅读并同意入会管理要求',
        icon: 'none'
      })
      return
    }
    
    this.setData({
      showAgreementModal: false,
      agreementRead: false // 重置状态
    })
    
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  // 取消注册
  cancelAgreement: function() {
    this.setData({
      showAgreementModal: false,
      agreementRead: false
    })
  },

  // 切换阅读状态
  toggleAgreementRead: function() {
    this.setData({
      agreementRead: !this.data.agreementRead
    })
  },

  // 查看更多信息
  viewInfo: function() {
    wx.navigateTo({
      url: '/pages/main/main'
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
