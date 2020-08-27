
var width = 375;        //屏幕宽为375px
var r = 0.5;  // 比率     共有750个物理像素
function init(w) {
    width = w;
    r = width / 750;
}

function px2rpx(px) {   //  1rpx == 0.5px
    var rpx = px / r;
    return rpx;
}

function rpx2px(rpx) {
    var px = rpx * r;
    return px;
}

module.exports = {
    init: init,
    px2rpx: px2rpx,
    rpx2px: rpx2px
}