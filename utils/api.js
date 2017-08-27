var HOST_URI = 'https://cnodejs.org/api/v1';
var GET_TOPICS = '/topics';
var GET_TOPIC_BY_ID = '/topic/';
// 拼接参数
function obj2uri(obj) {
    return Object.keys(obj).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
}
// 获取列表数据
export function getTopics(obj) {
    return HOST_URI + GET_TOPICS + '?' + obj2uri(obj);
}
// 获取内容页数据
export function getTopicByID(id, obj) {
    return HOST_URI + GET_TOPIC_BY_ID + id + '?' + obj2uri(obj);
}