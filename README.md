说明：

    第一个文件夹“attsys-miniprogram”为旧工程文件，作废；
    文件夹“unpackage”为微信开发工具缓存文件，作废；
    以下页面之后找时间更新

login页面
    
    初次登陆时，根据服务器返回的信息，将用户名、token和token失效时间利用微信小程序的localstorage缓存
    页面加载时，判断有无存储了用户信息
        若存储了，则判断token是否过期
            若过期，则清理缓存，并弹出登陆界面
            若未过期，则跳转至home页面
        若未存储，则弹出登陆界面
        
home页面
    
    页面加载时，根据服务器返回的信息，将用户签到状态显示
    
icu页面


info页面


leave页面


message页面


shiftarrangement页面
