// main.js
const app = getApp()

Page({

    data: {
      showDialog: false,      // 控制活动详情弹窗显示
      showSuccessDialog: false, // 控制报名成功弹窗显示
      showModal: false,
      showActivityModal: false,
      showSignupModal: false,
      showAgreementModal: false, // 控制入会管理要求弹窗显示
      showSecretaryModal: false, // 控制秘书处弹窗显示
      agreementRead: false,    // 控制入会管理要求复选框状态
      name: '',
      phone: '',
      // 动态活动数据
      activities: [],
      currentActivity: {},
      // 人才培养方案相关数据
      moreInfoTitle: '',
      moreInfoContent: '',
      moreInfoImage: '',
      moreInfoDetailContent: '',
      moreInfoContactInfo: ''
    },
    // 显示活动详情弹窗
  showModal: function() {
    this.setData({
      showModal: true
    });
  },
  showActivityModal: function(e) {
    const index = e.currentTarget.dataset.index;
    const activity = this.data.activities[index];
    
    // 设置页面禁止滚动（不自动滚动到顶部，保持当前位置）
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    });
    
    this.setData({
      currentActivity: activity,
      showActivityModal: true
    });
  },
  // 隐藏活动详情弹窗
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  hideActivityModal: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    });
    
    this.setData({
      showActivityModal: false
    });
  },
  // 检查手机号是否已注册
  checkPhoneRegistered: function(phone) {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      // 查询注册表，检查手机号是否已注册（关闭状态验证）
      db.collection('reg_table').where({
        phone: phone
        // 不再检查status状态，只要手机号存在即视为已注册
      }).get().then(res => {
        resolve(res.data && res.data.length > 0)
      }).catch(err => {
        console.error('查询注册用户失败:', err)
        resolve(false) // 查询失败时默认未注册
      })
    })
  },
//添加报名用户
add_user(name,number){
    db.collection("participants").add({
        data:(
            name,
            number
        )
    })
},
  // 显示报名表单弹窗 - 添加日期验证和注册检查
  showSignupModal: function() {
    const currentActivity = this.data.currentActivity;
    
    // 检查活动是否有日期字段
    if (currentActivity && currentActivity.date) {
      // 解析日期字符串（假设格式为 "YYYY-MM-DD" 或 "YYYY/MM/DD"）
      const activityDateStr = currentActivity.date.replace(/\//g, '-');
      const activityDate = new Date(activityDateStr);
      const now = new Date();
      
      // 如果报名日期小于等于现在日期，提示报名时间已过
      if (activityDate <= now) {
        wx.showToast({
          title: '报名时间已过',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }
    
    // 直接显示报名表单，在提交时检查注册状态
    this.setData({
      showActivityModal: false,
      showSignupModal: true
    });
  },
  // 隐藏报名表单弹窗
  hideSignupModal: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    });
    
    this.setData({
      showSignupModal: false
    });
  },
  
  // 显示秘书处弹窗
  showSecretaryModal: function() {
    // 设置页面禁止滚动（不自动滚动到顶部，保持当前位置）
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    });
    
    this.setData({
      showSecretaryModal: true
    });
  },
  
  // 隐藏秘书处弹窗
  hideSecretaryModal: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    });
    
    this.setData({
      showSecretaryModal: false
    });
  },
  
  // 显示入会管理要求告知窗口
  showAgreementModal: function() {
    // 禁用页面滚动
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    
    this.setData({
      showAgreementModal: true,
      agreementRead: false
    });
  },
  
  // 隐藏入会管理要求告知窗口
  hideAgreementModal: function() {
    this.setData({
      showAgreementModal: false,
      agreementRead: false
    });
  },
  
  // 切换入会管理要求复选框状态
  toggleAgreementRead: function() {
    this.setData({
      agreementRead: !this.data.agreementRead
    });
  },
  
  // 确认入会管理要求并跳转到注册页面
  confirmAgreement: function() {
    if (!this.data.agreementRead) {
      return;
    }
    this.setData({
      showAgreementModal: false,
      agreementRead: false
    });
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  
  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，仅用于阻止事件冒泡
    return;
  },
  
  // 姓名输入处理
  onNameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  
  // 手机号输入处理
  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  
  // 提交报名
  submitSignup: function() {
    const { name, phone } = this.data;
    
    // 简单验证
    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    // 检查手机号是否已注册
    wx.showLoading({
      title: '验证中...',
    });
    
    this.checkPhoneRegistered(phone).then(isRegistered => {
      wx.hideLoading();
      
      if (isRegistered) {
        // 已注册用户，提交报名
        wx.showLoading({
          title: '提交中...',
        });
        
        // 获取当前活动名称
        const activityName = this.data.currentActivity.title || "活动";
        const signupTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        // 将报名数据写入participants数据库
        const db = wx.cloud.database();
        db.collection('participants').add({
          data: {
            name: name,
            phone: phone,
            activityName: activityName,
            signupTime: signupTime,
            createTime: new Date()
          },
          success: (res) => {
            wx.hideLoading();
            
            // 恢复页面滚动
            wx.setPageStyle({
              style: {
                overflow: 'visible'
              }
            });
            
            this.setData({
              showSignupModal: false,
              name: '',
              phone: ''
            });
            
            wx.showToast({
              title: '报名成功！',
              icon: 'success',
              duration: 2000
            });
            
            console.log('报名数据已写入数据库:', res);
          },
          fail: (err) => {
            wx.hideLoading();
            wx.showToast({
              title: '报名失败，请重试',
              icon: 'none'
            });
            console.error('写入数据库失败:', err);
          }
        });
      } else {
        // 未注册用户，提示去注册
        wx.showModal({
          title: '提示',
          content: '您输入的手机号未注册，请先完成注册后再报名活动',
          confirmText: '去注册',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.setData({
                showSignupModal: false
              });
              // 显示入会管理要求告知窗口
              this.showAgreementModal();
            }
          }
        });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '验证失败，请重试',
        icon: 'none'
      });
    });
  },
  
  onLoad: function() {
    // 页面加载时的逻辑
    console.log('页面加载完成');
  },
    // 显示活动详情弹窗
    showDialog: function() {
      this.setData({
        showDialog: true
      });
      // 禁止页面滚动
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    
    // 隐藏活动详情弹窗
    hideDialog: function() {
      this.setData({
        showDialog: false
      });
    },
    
    // 显示报名成功弹窗
    showSuccessDialog: function() {
      this.setData({
        showSuccessDialog: true
      });
      // 禁止页面滚动
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    
    // 隐藏报名成功弹窗
    hideSuccessDialog: function() {
      this.setData({
        showSuccessDialog: false
      });
    },
    
    // 阻止点击弹窗内容时触发遮罩层事件
    preventMaskClick: function(e) {
      e.stopPropagation();
    },
    
    // 处理报名按钮点击
    handleSignup: function() {
      // 先关闭活动详情弹窗
      this.hideDialog();
      
      // 模拟报名处理（这里可以替换为实际的API调用）
      setTimeout(() => {
        // 显示报名成功弹窗
        this.showSuccessDialog();
      }, 300); // 添加短暂延迟，使交互更自然
    },





  onLoad: function (options) {
    // 页面加载完成
    this.loadActivities()
    this.loadMainPageData()
  },

  // 加载主页面数据
  loadMainPageData: function() {
    const db = wx.cloud.database()
    
    // 加载所有活动数据，按sort字段排序，sort越小越靠前，如果没有sort字段则按num字段排序
    db.collection("activities").orderBy('sort', 'asc').orderBy('num', 'desc').get().then(res => {
      console.log('主页面数据加载成功:', res.data)
      
      if (res.data && res.data.length > 0) {
        // 过滤显示的活动（display不为false）
        const activities = res.data.filter(item => item.display !== false)
        
        this.setData({
          activities: activities
        })
      }
    })
    
    // 加载人才培养方案数据
    db.collection("more_information").get().then(res => {
        console.log('更多信息数据加载成功:', res.data)
        
        if (res.data && res.data.length > 0) {
          const moreInfo = res.data[0]
          
          this.setData({
            moreInfoTitle: moreInfo.title,
            moreInfoContent: moreInfo.content,
            moreInfoImage: moreInfo.image,
            moreInfoDetailContent: moreInfo.detailContent,
            moreInfoContactInfo: moreInfo.contactInfo
          })
        }
      })
    .catch(err => {
      console.error('加载主页面数据失败:', err)
    })
  },

  // 图片加载成功
  onImageLoad: function(e) {
    console.log('图片加载成功:', e.detail)
  },

  // 图片加载失败
  onImageError: function(e) {
    console.log('图片加载失败:', e.detail)
    // 可以设置默认图片
    const index = e.currentTarget.dataset.index
    if (index !== undefined) {
      const key = `activities[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    }
  },

  onShow: function () {
    // 页面显示时更新数据
  },

  // 搜索输入处理
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: ''
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

    wx.showLoading({
      title: '搜索中...'
    })

    // 这里可以调用搜索API
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `搜索"${searchText}"`,
        icon: 'none'
      })
    }, 1000)
  },

  // 功能卡片导航
  navigateToPage: function(e) {
    const page = e.currentTarget.dataset.page
    
    // 专委会页面直接跳转
    if (page === 'committee') {
      wx.navigateTo({
        url: '/pages/committee/committee'
      })
      return
    }
    
    // 转化中心页面直接跳转
    if (page === 'transform') {
      wx.navigateTo({
        url: '/pages/transform/transform'
      })
      return
    }
    // 求是书院页面直接跳转
    if (page === 'Former site of Qiushi Academy') {
        wx.navigateTo({
          url: '/pages/Former site of Qiushi Academy/Former site of Qiushi Academy'
        })
        return
      }
    // 秘书处显示弹窗
    if (page === 'secretary') {
      this.showSecretaryModal();
      return;
    }
    
    const pageMap = {
      'academy': {
        title: '求是书院',
        desc: '人才培养和学术交流平台'
      }
    }

    const pageInfo = pageMap[page]
    if (pageInfo) {
      wx.showModal({
        title: pageInfo.title,
        content: pageInfo.desc,
        showCancel: false,
        confirmText: '我知道了'
      })
    }
  },

  // 加载活动数据
  loadActivities: function() {
    wx.showLoading({
      title: '加载活动数据...'
    })

    // 从云数据库加载活动数据
    const db = app.getDB()
    if (db) {
      // 尝试从云数据库获取活动数据，按sort字段排序，sort越小越靠前
      db.collection('activities').orderBy('sort', 'asc').limit(10).get()
        .then(res => {
          wx.hideLoading()
          if (res.data && res.data.length > 0) {
            // 使用云数据库的数据
            this.setData({
              activities: res.data
            })
            console.log('从云数据库加载活动数据成功:', res.data.length + '条')
          } else {
            console.log('云数据库中暂无活动数据，使用默认数据')
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('加载云数据库活动数据失败，使用默认数据:', err)
          // 失败时使用默认数据
        })
    } else {
      wx.hideLoading()
      console.log('云数据库未初始化，使用默认数据')
    }
  },

  // 查看更多活动
  viewMoreActivities: function(e) {
    const page = e.currentTarget.dataset.page
   if (page === 'latest activity') {
    wx.navigateTo({
      url: '/pages/latest activity/latest activity'
    })
    return
  }
  },

  // 查看活动详情
  viewActivityDetail: function(e) {
    const activityId = e.currentTarget.dataset.id
    const activity = this.data.activities.find(item => item.id == activityId)
    
    if (activity) {
      wx.showModal({
        title: activity.title,
        content: `时间：${activity.date}\n地点：${activity.location}\n\n${activity.description}`,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '我要报名',
        success: (res) => {
          if (res.confirm) {
            // 对于活动列表中的报名，直接提示用户需要注册
            wx.showModal({
              title: '提示',
              content: '请先完成注册后再报名活动',
              confirmText: '去注册',
              cancelText: '取消',
              success: (res) => {
                if (res.confirm) {
                  // 显示入会管理要求告知窗口
                  this.showAgreementModal();
                }
              }
            })
          }
        }
      })
    }
  },

  // 报名活动
  registerActivity: function(activityId) {
    wx.showLoading({
      title: '报名中...'
    })

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '报名成功',
        content: '您已成功报名此活动，我们将通过短信或邮件通知您相关信息。',
        showCancel: false,
        confirmText: '确定'
      })
    }, 1500)
  },

  // 查看人才培养方案 - 从数据库动态加载
  viewTalentProgram: function() {
    wx.showModal({
      title: this.data.moreInfoTitle || '人才培养方案',
      content: this.data.moreInfoDetailContent || '博士联盟致力于为成员提供全方位的人才培养计划，包括学术指导、职业发展、创新创业等多个方面的支持。\n\n主要内容：\n• 学术研究指导\n• 职业规划咨询\n• 创新项目孵化\n• 国际交流机会\n• 产学研合作',
      showCancel: true,
      cancelText: '关闭',
      confirmText: '了解更多',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: this.data.moreInfoContactInfo || '获取更多详细资料，请联系：秘书长何忠成：18917688962（微信同号）',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 底部导航 - 首页
  navigateToHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  // 底部导航 - 联盟介绍
  navigateToAlliance: function() {
    wx.navigateTo({
      url: '/pages/alliance/alliance'
    })
  },

  // 底部导航 - 活动详情
  navigateToActivities: function() {
    wx.navigateTo({
      url: '/pages/latest activity/latest activity'
    })
  },

  // 底部导航 - 我的
  navigateToMine: function() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },

  // 打开活动链接
  openActivityLink: function() {
    const currentActivity = this.data.currentActivity;
    
    if (!currentActivity || !currentActivity.gzhlink) {
      wx.showToast({
        title: '链接不存在',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    const link = currentActivity.gzhlink;
    
    // 判断链接类型并处理
    if (link.startsWith('http://') || link.startsWith('https://')) {
      // 网页链接 - 直接跳转到webview页面
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(link)
      });
    } else if (link.startsWith('/')) {
      // 小程序内部页面路径
      wx.navigateTo({
        url: link
      });
    } else {
      wx.showToast({
        title: '链接格式不支持',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 联盟介绍',
      path: '/pages/main/main',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 如果秘书处弹窗或最新活动弹窗显示，则禁止下拉刷新
    if (this.data.showSecretaryModal || this.data.showActivityModal) {
      wx.stopPullDownRefresh()
      return
    }
    
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadActivities()
    this.loadMainPageData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success',
        duration: 1000
      })
    }, 1500)
  },

  // 触底加载更多
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多...'
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '暂无更多内容',
        icon: 'none'
      })
    }, 1000)
  }
})