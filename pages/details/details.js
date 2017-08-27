import { getTopicByID } from '../../utils/api.js';
import { getDateDiff } from '../../utils/util.js';
Page({
    data: {
        detail: {},
        hidden: false
    },
    onLoad: function (options) {
        this.fetchData(options.id);
    },
    fetchData: function (id) {
        this.setData({
            hidden: false
        });
        var _this = this;
        wx.request({
            url: getTopicByID(id, { mdrender: false }),
            success: function (res) {
                console.log(res);
                res.data.data.create_at = getDateDiff(new Date(res.data.data.create_at));
                res.data.data.replies = res.data.data.replies.map(function (item) {
                    item.create_at = getDateDiff(new Date(item.create_at));
                    return item;
                })
                _this.setData({
                    detail: res.data.data
                });
                setTimeout(function () {
                    _this.setData({
                        hidden: true
                    });
                }, 300);
            }
        });
    }
})