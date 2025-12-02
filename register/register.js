// register.js
const app = getApp()

Page({
  data: {
    formData: {
      name: '',
      gender: 'male',
      phone: '',
      birthDate: '',
      school: '',
      graduateDate: '',
      major: '',
      willingness: '',
      referralCode: '',
      workUnit: ''
    },
    uploadedImage: '',
    uploadedImageUrl: '', // 云存储图片URL
    isSubmitting: false,
    showPrivacyModal: false // 隐私政策弹窗显示状态
  },

  onLoad: function (options) {
    // 页面加载完成
    console.log('注册页面加载完成')
    // 检查云开发环境是否正常
    this.checkCloudEnv()
  },

  // 检查云开发环境
  checkCloudEnv: function() {
    if (!wx.cloud) {
      wx.showModal({
        title: '环境异常',
        content: '当前微信版本过低，无法使用云开发功能，请升级微信后重试',
        showCancel: false
      })
      return false
    }
    return true
  },

  // 表单输入事件处理
  onNameInput: function(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },

  onGenderChange: function(e) {
    this.setData({
      'formData.gender': e.detail.value
    })
  },

  onPhoneInput: function(e) {  
    this.setData({
      'formData.phone': e.detail.value
    })
  },

  onBirthDateChange: function(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    })
  },

  onSchoolInput: function(e) {
    this.setData({
      'formData.school': e.detail.value
    })
  },

  onGraduateDateChange: function(e) {
    this.setData({
      'formData.graduateDate': e.detail.value
    })
  },

  onMajorInput: function(e) {
    this.setData({
      'formData.major': e.detail.value
    })
  },

  onWillingnessInput: function(e) {
    this.setData({
      'formData.willingness': e.detail.value
    })
  },

  onReferralCodeInput: function(e) {
    this.setData({
      'formData.referralCode': e.detail.value
    })
  },

  onWorkUnitInput: function(e) {
    this.setData({
      'formData.workUnit': e.detail.value
    })
  },

  // 选择图片上传
  chooseImage: function() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        self.setData({
          uploadedImage: tempFilePaths[0]
        })
        // 立即上传到云存储
        self.uploadImageToCloud(tempFilePaths[0])
      },
      fail: function() {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 上传图片到云存储
  uploadImageToCloud: function(filePath) {
    const self = this
    wx.showLoading({
      title: '上传中...'
    })
    
    // 生成唯一的文件名
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000)
    const fileExtension = filePath.split('.').pop()
    const cloudPath = `register-images/${timestamp}_${random}.${fileExtension}`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        wx.hideLoading()
        console.log('图片上传成功:', res.fileID)
        self.setData({
          uploadedImageUrl: res.fileID
        })
        wx.showToast({
          title: '图片上传成功',
          icon: 'success'
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('图片上传失败:', err)
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
      }
    })
  },

  // 表单验证
  validateForm: function() {
    const { formData } = this.data
    
    // 检查云开发环境
    if (!this.checkCloudEnv()) {
      return false
    }
    
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }
    
    // 姓名长度验证
    if (formData.name.trim().length < 2 || formData.name.trim().length > 20) {
      wx.showToast({
        title: '姓名长度应在2-20字符之间',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.phone.trim()) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
      return false
    }
    
    // 手机号码格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.school.trim()) {
      wx.showToast({
        title: '请输入毕业院校',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.major.trim()) {
      wx.showToast({
        title: '请输入专业',
        icon: 'none'
      })
      return false
    }
    
    if (!formData.workUnit.trim()) {
      wx.showToast({
        title: '请输入工作单位',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 检查手机号是否已注册
  checkPhoneExists: function(phone) {
    return new Promise((resolve, reject) => {
      const db = app.getDB()
      // 模拟错误：删除括号导致语法错误
      db.collection('reg_table')
        .where({
          phone: phone
        })
        .count()
        .then(res => {
          resolve(res.total > 0)
        })
        .catch(err => {
          console.error('查询手机号失败:', err)
          reject(err)
        })
    })
  },

  // 显示隐私政策弹窗
  showPrivacyModal: function() {
    if (!this.validateForm()) {
      return
    }
    
    // 禁止页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    })
    
    this.setData({
      showPrivacyModal: true
    })
  },

  // 同意隐私政策
  agreePrivacyPolicy: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    })
    
    this.setData({
      showPrivacyModal: false
    })
    this.submitRegistration()
  },

  // 拒绝隐私政策
  disagreePrivacyPolicy: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    })
    
    this.setData({
      showPrivacyModal: false
    })
    wx.showToast({
      title: '您需要同意隐私政策才能注册',
      icon: 'none'
    })
  },

  // 提交注册到云数据库
  submitRegistration: function() {
    this.setData({ isSubmitting: true })
    
    wx.showLoading({
      title: '验证中...'
    })

    // 先检查手机号是否已注册
    this.checkPhoneExists(this.data.formData.phone)
      .then(exists => {
        if (exists) {
          wx.hideLoading()
          this.setData({ isSubmitting: false })
          wx.showModal({
            title: '提示',
            content: '该手机号已注册，请使用其他手机号或联系管理员',
            showCancel: false
          })
          return Promise.reject('手机号已存在')
        }
        
        // 手机号不存在，继续注册流程
        wx.showLoading({
          title: '注册中...'
        })
        
        // 准备提交的数据
        const submitData = {
          ...this.data.formData,
          uploadedImageUrl: this.data.uploadedImageUrl,
          createTime: new Date(),
          updateTime: new Date(),
          status: 'pending', // 注册状态：pending-待审核，approved-已通过，rejected-已拒绝
          registrationId: 'REG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) // 生成注册ID
        }

        // 写入云数据库
        const db = app.getDB()
        return db.collection('reg_table').add({
          data: submitData
        })
      })
      .then(res => {
        wx.hideLoading()
        this.setData({ isSubmitting: false })
        
        console.log('注册数据写入成功:', res)
        wx.showModal({
          title: '注册成功',
          content: '您的注册申请已提交，请等待审核结果。我们将通过您提供的联系方式通知您审核结果。',
          showCancel: false,
          confirmText: '确定',
          success: () => {
            // 清空表单数据
            this.setData({
              formData: {
                name: '',
                gender: 'male',
                phone: '',
                birthDate: '',
                school: '',
                graduateDate: '',
                major: '',
                willingness: '',
                referralCode: '',
                workUnit: ''
              },
              uploadedImage: '',
              uploadedImageUrl: ''
            })
            
            // 跳转到首页
            wx.navigateBack({
              delta: 1
            })
          }
        })
        
      })
      .catch(err => {
        if (err === '手机号已存在') {
          return // 已处理过的错误
        }
        
        wx.hideLoading()
        this.setData({ isSubmitting: false })
        
        console.error('注册失败:', err)
        let errorMsg = '注册失败，请稍后重试'
        
        if (err.errCode) {
          switch(err.errCode) {
            case -502001:
              errorMsg = '数据库写入失败，请稍后重试'
              break
            case -501005:
              errorMsg = '网络连接超时，请检查网络'
              break
            case -501000:
              errorMsg = '权限不足，请联系管理员'
              break
            default:
              errorMsg = `注册失败 (错误代码: ${err.errCode})`
          }
        }
        
        wx.showModal({
          title: '注册失败',
          content: errorMsg + '，是否重试？',
          confirmText: '重试',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.onRegister()
            }
          }
        })
      })
  },

  // 取消注册
  onCancel: function() {
    wx.showModal({
      title: '提示',
      content: '确定要取消注册吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})
