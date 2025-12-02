// 页面逻辑
Page({
    data: {
      modalVisible: false,
      loading: true,
      activities: [], // 存储活动数据
      currentActivityType: null,
      showAgreementModal: false, // 显示告知窗口
      agreementRead: false // 是否已阅读协议
    },

    onLoad: function (options) {
        // 页面加载完成
        this.loadActivities();
    },

    /**
     * 加载活动数据 - 动态加载所有活动
     */
    loadActivities: function() {
        const db = wx.cloud.database();
        
        // 显示加载状态
        wx.showLoading({
            title: '加载中...'
        });

        // 获取所有活动数据，按sort字段排序，sort越小越靠前
        db.collection('activities')
          .orderBy('sort', 'asc')
          .get()
          .then(res => {
              console.log('获取活动数据成功:', res.data);
              
              if (res.data && res.data.length > 0) {
                  // 处理活动数据，添加索引和类型
                  const activities = res.data.map((item, index) => {
                      return {
                          id: item._id || index + 1,
                          type: item.type || `activity${index + 1}`,
                          title: item.title || '',
                          image: item.image || '',
                          date: item.date || item.data || '',
                          location: item.location || '',
                          content: item.content || '',
                          gzhlink: item.gzhlink || '', // 公众号链接
                          show: item.show !== false // 默认显示，除非明确设置为false
                      };
                  });
                  
                  this.setData({
                      activities: activities,
                      loading: false
                  });
              } else {
                  console.warn('活动数据为空');
                  this.setData({ loading: false });
              }
          })
          .catch(err => {
              console.error('获取活动数据失败:', err);
              this.setData({ loading: false });
              
              // 显示错误提示
              wx.showToast({
                  title: '数据加载失败',
                  icon: 'none',
                  duration: 2000
              });
          })
          .finally(() => {
              wx.hideLoading();
          });
    },

    /**
     * 页面显示时的处理
     */
    onShow: function () {
        // 页面显示时可以检查数据是否需要刷新
        if (!this.data.loading && this.data.activities.length === 0) {
            this.loadActivities();
        }
    },

    


    /**
     * 下拉刷新处理
     */
    onPullDownRefresh: function () {
        this.loadActivities();
        
        // 完成下拉刷新
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000);
    },

    /**
     * 图片加载成功处理
     */
    onImageLoad: function(e) {
        console.log('图片加载成功:', e.detail);
    },

    /**
     * 图片加载失败处理 - 优化错误处理
     */
    onImageError: function(e) {
        console.log('图片加载失败:', e.detail);
        
        const dataset = e.currentTarget.dataset;
        const index = dataset.index;
        const type = dataset.type; // 区分是哪个图片字段
        
        if (index !== undefined) {
            const key = `activities[${index}].image`;
            this.setData({
                [key]: '/images/default-goods-image.png'
            });
        }
    },

    /**
     * 重新加载数据
     */
    reloadData: function() {
        this.setData({ loading: true });
        this.loadActivities();
    },

    /**
     * 显示弹框
     */
    showModal: function(e) {
        const dataset = e.currentTarget.dataset;
        const activityId = dataset.id;
        const activityType = dataset.type;
        
        // 设置页面禁止滚动（不自动滚动到顶部，保持当前位置）
        wx.setPageStyle({
            style: {
                overflow: 'hidden'
            }
        });
        
        this.setData({
            modalVisible: true,
            currentActivityId: activityId,
            currentActivityType: activityType
        });
    },
    
    /**
     * 隐藏弹框
     */
    hideModal: function() {
        // 恢复页面滚动
        wx.setPageStyle({
            style: {
                overflow: 'visible'
            }
        });
        
        this.setData({
            modalVisible: false
        });
    },
    
    /**
     * 阻止弹框内容点击事件冒泡
     */
    preventTap: function() {
        // 阻止事件冒泡，防止点击内容区域关闭弹框
        return false;
    },
    
    /**
     * 报名按钮点击事件 - 优化后的处理逻辑
     */
    signUp: function() {
        const { currentActivityId, currentActivityType } = this.data;
        
        if (!currentActivityId) {
            wx.showToast({
                title: '活动信息错误',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        // 检查用户是否已注册手机号
        this.checkUserRegistration()
            .then(isRegistered => {
                if (isRegistered) {
                    // 用户已注册，直接报名
                    this.submitSignUp(currentActivityId, currentActivityType);
                } else {
                    // 用户未注册，显示告知窗口
                    this.setData({
                        showAgreementModal: true
                    });
                }
            })
            .catch(err => {
                console.error('检查用户注册状态失败:', err);
                wx.showToast({
                    title: '系统错误，请重试',
                    icon: 'none',
                    duration: 2000
                });
            });
    },

    /**
     * 检查用户是否已注册手机号
     */
    checkUserRegistration: function() {
        return new Promise((resolve, reject) => {
            // 获取用户手机号（这里需要根据实际业务逻辑获取）
            // 假设从本地存储获取用户信息
            const userInfo = wx.getStorageSync('userInfo');
            
            if (!userInfo || !userInfo.phone) {
                resolve(false); // 用户未注册
                return;
            }

            // 检查手机号是否在注册表中
            const db = wx.cloud.database();
            db.collection('reg_table')
                .where({
                    phone: userInfo.phone,
                    status: 'approved' // 只检查已通过审核的注册
                })
                .count()
                .then(res => {
                    resolve(res.total > 0);
                })
                .catch(err => {
                    console.error('查询注册表失败:', err);
                    reject(err);
                });
        });
    },

    /**
     * 确认阅读协议
     */
    confirmAgreement: function() {
        if (!this.data.agreementRead) {
            wx.showToast({
                title: '请先阅读并同意入会管理要求',
                icon: 'none'
            });
            return;
        }
        
        this.setData({
            showAgreementModal: false,
            agreementRead: false // 重置状态
        });
        
        // 跳转到注册页面
        wx.navigateTo({
            url: '/pages/register/register'
        });
    },

    /**
     * 取消注册
     */
    cancelAgreement: function() {
        this.setData({
            showAgreementModal: false,
            agreementRead: false
        });
    },

    /**
     * 切换阅读状态
     */
    toggleAgreementRead: function() {
        this.setData({
            agreementRead: !this.data.agreementRead
        });
    },

    /**
     * 提交报名信息到数据库
     */
    submitSignUp: function(activityId, activityType) {
        return new Promise((resolve, reject) => {
            const db = wx.cloud.database();
            
            // 获取用户信息
            wx.getUserProfile({
                desc: '用于报名活动',
                success: (userRes) => {
                    const signUpData = {
                        activityId: activityId,
                        activityType: activityType,
                        userInfo: userRes.userInfo,
                        signUpTime: new Date(),
                        status: 'pending' // 报名状态
                    };

                    // 添加报名记录到数据库
                    db.collection('activity_signups')
                        .add({
                            data: signUpData
                        })
                        .then(res => {
                            console.log('报名记录添加成功:', res);
                            resolve(res);
                        })
                        .catch(err => {
                            console.error('添加报名记录失败:', err);
                            reject(err);
                        });
                },
                fail: (err) => {
                    console.error('获取用户信息失败:', err);
                    reject(err);
                }
            });
        });
    },

    /**
     * 处理链接点击事件 - 直接跳转
     */
    onLinkClick: function(e) {
        const link = e.currentTarget.dataset.link;
        if (link) {
            // 直接跳转到外部链接
            wx.showModal({
                title: '打开链接',
                content: '即将在浏览器中打开公众号文章链接',
                success: (res) => {
                    if (res.confirm) {
                        // 使用web-view组件直接打开链接
                        wx.navigateTo({
                            url: `/pages/webview/webview?url=${encodeURIComponent(link)}`
                        });
                    }
                }
            });
        }
    },

    /**
     * 页面卸载时的清理工作
     */
    onUnload: function() {
        // 清理定时器等资源
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
    },

    /**
     * 页面隐藏时的处理
     */
    onHide: function() {
        // 隐藏弹框
        if (this.data.modalVisible) {
            this.setData({
                modalVisible: false
            });
        }
        // 隐藏告知窗口
        if (this.data.showAgreementModal) {
            this.setData({
                showAgreementModal: false,
                agreementRead: false
            });
        }
    }
})