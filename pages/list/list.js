import { getTopics } from "../../utils/api.js";
import { getDateDiff } from '../../utils/util.js';

Page({
    //页面数据
    data: {
        postsList: [], //帖子数据
        hidden: false, //loading
        page: 1, //页面
        tab: 'all', //主题
        scrollHeight: '' //设备高度
    },
    onLoad: function () {
        console.log('onLoad by topics');
        this.fetchData();// 获取数据
        //获取设备高度
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                _this.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
    },
    // 获取数据
    fetchData: function (data) {
        //显示loading
        this.setData({
            hidden: false
        });
        // 处理参数
        if (!data) {
            data = {}
        };
        if (!data.page) {
            data.page = 1
        };
        //每次滚动加载的条数
        data.limit = 10;
        console.log(getTopics(data));
        var _this = this;
        wx.request({
            url: getTopics(data),
            success: function (res) {
                console.log(res.data.data);
                // res.data.data ----> data.postsList
                // _this.postsList = res.data.data //vue
                // 每次加载10条
                if (data.page === 1) {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].last_reply_at_date = getDateDiff(new Date(res.data.data[i].last_reply_at));
                    }
                    _this.setData({
                        postsList: res.data.data
                    });
                } else {
                    //追加加载10条
                    _this.setData({
                        //下拉后会添加原来的数据
                        postsList: _this.data.postsList.concat(res.data.data.map(function (item) {
                            item.last_reply_at = getDateDiff(new Date(item.last_reply_at));
                            return item;
                        }))
                    });
                }


                // 隐藏loading
                setTimeout(function () {
                    _this.setData({
                        hidden: true
                    });
                }, 300);
            }
        });
    },
    // 切换主题
    onTapTag: function (e) {
        var tab = e.currentTarget.id;
        // 这里就能获取到不同的tab值了
        this.setData({
            tab: tab
        });
        if (tab !== 'all') {
            this.fetchData({ tab: tab });
        } else {
            this.fetchData();
        }
    },
    //滚动到底部，加载数据
    lower: function () {
        console.log('滚动到底部，加载数据');
        var self = this;
        // 修改当前页码
        self.setData({
            page: self.data.page + 1
        });
        // 判断当前页的tab值 进行请求数据
        if (self.data.tab !== 'all') {
            this.fetchData({ tab: self.data.tab, page: self.data.page });
        } else {
            this.fetchData({ page: self.data.page });
        }
    },
    //下拉刷新
    upper: function () {
        console.log("下拉刷新");
        this.fetchData();
    },
    //跳转
    redictDetail: function (e) {
        console.log('跳转' + e.currentTarget.id);
        //vue--- this.$route.push(xxxxx);
        var id = e.currentTarget.id;
        var url = '../detail/detail?id=' + id;
        // 这里的detail是需要创建对应的文件，以及页面注册的
        wx.navigateTo({
            url: url
        })
    }
})