//index.js
//获取应用实例

var app = getApp()
var plotdata = require('../../data/daily.js');

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {

    bleList:[], //蓝牙设备数组
  
    scanBtnData:'连接调料盒', //扫描标题
    scanBtnDisable: false,  //是否禁止扫描按钮
    isScanning: false, // 是否正在扫描
    isAvailable: false,
    isToasting: false,


    dataList:[{dataType:"其他",content:""}],
    receiveType:"接收",
    sendType:"发送",
    otherType:"其他",
    inputData:"",
    initSuccess: false, //初始化是否成功
    receiveFlag:"0",


    // deviceId: "E60656EF-06F0-9200-39DE-1065B26ED422",
    // serviceId:"00006958-0000-1000-8000-00805F9B34FB",
    // receiveId:"000005EC-0000-1000-8000-00805F9B34FB",
    // sendId:"0000ACB1-0000-1000-8000-00805F9B34FB",

     deviceId: "2F295E34-2C7D-F04C-B0F7-06A767DFA397",
     serviceId:"0000FFF0-0000-1000-8000-00805F9B34FB",
     receiveId:"0000FFF1-0000-1000-8000-00805F9B34FB",
     sendId:"0000FFF2-0000-1000-8000-00805F9B34FB",
     DeviceState:"未连接"
    
  },

  onLoad: function () {
    console.log('onLoad index')

    this.monitorBleChange()

    this.initBle()

    var that = this

    
    // setInterval(function () {

    //   //循环执行代码 
    //   if (!that.data.isAvailable && !that.data.isToasting) {

    //     //已经弹窗
    //     that.setData({
    //       isToasting: true
    //     })

    //     // wx.showModal({
    //     //   title: '提示',
    //     //   content: '请打开蓝牙和GPS！',
    //     //   showCancel: false,
    //     //   success: function (res) {
    //     //     if (res.confirm) {

    //     //       //没有弹窗
    //     //       that.setData({
    //     //         isToasting: false
    //     //       })
    //     //     } else if (res.cancel) {
    //     //       console.log('用户点击取消')
    //     //     }
    //     //   }
    //     // })
    //   }
    // }, 5000) //循环时间 这里是5秒=5000

    setInterval(function () {

      if (that.data.isScanning) {

        //停止扫描
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) {
            // success
          }
        })
        setTimeout(function () {
          //要延时执行的代码 

          //开始扫描
          wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: true,
            success: function (res) {
            }
          })
        }, 200) //延迟时间 这里是300ms 

      }

    }, 5000) //循环时间 这里是5秒 

  },

  //蓝牙监听
  monitorBleChange: function () {
    var that = this;

    //蓝牙状态更改，扫描状态更改，都会执行该函数
    wx.onBluetoothAdapterStateChange(function (res) {

      //若没有正在扫描，蓝牙是否可用
      if (!that.data.isScanning && res["available"]) {

        //that.initBle()
      }
      else if (!res["available"]) {
        that.setData({
          scanBtnData: "连接调料盒",
          isScanning: false,
          scanBtnDisable: true,
          isAvailable: false
        })
      }

    })

  },

  //初始化蓝牙
  initBle: function () {
    var that = this;

    //打开蓝牙适配器
    wx.openBluetoothAdapter({
      success: function(res){

        //使能按钮
        that.setData({
          scanBtnData: "连接调料盒",
          isScanning: false,
          scanBtnDisable: false,
          isAvailable: true
        })
        
        //监听扫描
        wx.onBluetoothDeviceFound(function(res) {

          console.log(res)
          // res电脑模拟器返回的为数组；手机返回的为蓝牙设备对象
          if (res instanceof Array) {
            // console.log("数组")
            that.updateBleList(res)
          }
          else {
            // console.log("对象")
            that.updateBleList([res])
          }

        })

      },
      fail: function(res) {
        // fail
        console.log(res)
      },
      complete: function(res) {
        // complete
      }
    })
  },

  //扫描
  scan: function (view) {
    var that = this;

    var scanTitle = "连接调料盒"
    if (this.data.scanBtnData == scanTitle) {
      scanTitle = "正在扫描连接"

      this.setData({
        scanBtnData: scanTitle,
        isScanning: true,
        bleList: [],

      })

      //开始扫描
      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey:true,
        success: function(res){
        }
      })
    }
    // if(this.data.scanBtnData == "正在扫描连接")
    // {
    //   scanTitle = "连接调料盒"
    //   this.setData({
    //     scanBtnData: scanTitle,
    //     isScanning: false,
        
    //   })

    //   wx.stopBluetoothDevicesDiscovery({
    //     success: function(res){
    //       // success
    //     }
    //   })

    // }
    if(this.data.scanBtnData == "已连接调味盒")
    {
      scanTitle = "连接调料盒"
      this.setData({
        scanBtnData: scanTitle,
        isScanning: false,
        
      })

      wx.closeBLEConnection({
        deviceId:app.globalData.selectDevice.deviceId,
        success: function(res){
          // success
        }
      })

    }
    
  },

  //点击设备
  onSelectedDevice: function (view) {
    var index = view.currentTarget.dataset.index
    var device = this.data.bleList[index]
    app.globalData.selectDevice = device
    wx.navigateTo({
      url: '../deviceController/deviceController'
    })

    this.setData({
      scanBtnData: '连接设备中',
      isScanning: false,
    })
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        // success
      }
    })
  },

  //更新数据 devices为数组类型
  updateBleList: function(devices) {
      var that = this;
      var newData = this.data.bleList
      var tempDevice = null;
      var scanTitle = "正在连接"
      for(var i=0; i<devices.length; i++) {
        //ios设备
        if (devices[i].devices != null) {
          if (devices[i].devices.length > 0) {
            tempDevice = devices[i].devices[0];
          }
          else {
            continue
          }
          
        }
        //安卓
        else {
          tempDevice = devices[i];
        }
        
        if (!this.isExist(tempDevice)) {
          newData.push(tempDevice)
        }
      }
      console.log(tempDevice)
      console.log(newData)
      this.setData({
        bleList:newData
      })

      if(tempDevice.deviceId == this.data.deviceId && this.data.initSuccess == false)
        {
          app.globalData.selectDevice = tempDevice;
          this.setData({
            scanBtnData: scanTitle,
            isScanning: false,
            bleList: [],
          })
          wx.stopBluetoothDevicesDiscovery({
            success: function(res){
              // success
            }
          })
          
          this.HJBLE();
          scanTitle = "已连接调味盒";
          this.setData({
            scanBtnData: scanTitle,
            isScanning: false,
            bleList:[],
            dataList:[],
          })
      
        }
  },

  //是否已存在 存在返回true 否则false
  isExist: function(device) {
    var tempData = this.data.bleList
    for(var i=0; i<tempData.length; i++) {
        if (tempData[i].deviceId == device.deviceId) {
          return true
        }
      }
      return false
  },

  HJBLE: function (options) {
    var device = app.globalData.selectDevice
    var that = this;
    wx.setNavigationBarTitle({
      title: device.name,
      success: function(res) {
        // success
      }
    })

    //监听连接
    wx.onBLEConnectionStateChanged(function(res) {
      console.log('state changed ', res)
      if(!res.connected) {
        that.addData({dataType:"其他",content:"连接已断开"})
      }
    })

    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function(res){ 
        // success
        console.log('createBLEConnection')
        that.addData({dataType:"其他",content:"连接成功，正在扫描服务。。。"})
        that.getServiceAndCharacteristics(device)

      },
      fail: function(res) {
        console.log(res)
        that.addData({dataType:"其他",content:"连接失败"})
      }
    })

  },
  //获取服务
  getServiceAndCharacteristics: function (device) {
    var that = this
    wx.getBLEDeviceServices({
        deviceId: device.deviceId,
        success: function(res){
          console.log('服务',res)
          // success
          
          wx.getBLEDeviceCharacteristics({
            deviceId: device.deviceId,
            serviceId: that.data.serviceId,
            success: function(res){
              console.log('特征',res)

              that.addData({dataType:"其他",content:'扫描成功，正在打开通知。。。'})

              //监听通知
              wx.onBLECharacteristicValueChange(function(res) {
                // callback
                var bledata = new Uint8Array(res.value); //接收到的数据包

                if(bledata[0]==85){
                  let BLEdata=bledata[4]/5;
                  let BLEyear=bledata[1];
                  let BLEmonth=bledata[2];
                  let BLEday=bledata[3];
                  let BLEdate=0;
                  if(BLEmonth<10){
                    if(BLEday<10){
                       BLEdate="20"+BLEyear+"0"+BLEmonth+"0"+BLEday;
                    }
                    if(BLEday>=10){
                       BLEdate="20"+BLEyear+"0"+BLEmonth+BLEday;
                    }
                  }
                  else if (BLEmonth>=10){
                    if(BLEday<10){
                       BLEdate="20"+BLEyear+BLEmonth+"0"+BLEday;
                    }
                    if(BLEday>=10){
                       BLEdate="20"+BLEyear+BLEmonth+BLEday;
                    }
                  }
                          
                  plotdata.visitTrend.push({"ref_date":BLEdate,"visit_uv":BLEdata});
                  //this.data.receiveFlag = "1";
                  //that.bindSend();
                  var tempSendData = that.buf2char(bledata.slice(-1));
                  //var buffer = bledata[6];
                //  var tempSendData = that.Uint8ArrayToString(bledata);
                  var buffer = that.stringToHexBuffer(tempSendData);
                
                  that.setData({
                      sendByteLen: that.data.sendByteLen + buffer.byteLength,
                    })

                  var p = new Promise(function (resolve, reject) {
                    console.log('开始 new Promise...');
                    resolve(tempSendData);
                  });

                  var count = parseInt((tempSendData.length + 39)/40)
                  for(var i=0; i<count; i++) {
                    p = p.then(that.sendData)
                  }

                  p.then(function (resolve, reject) {
                    that.addData({ dataType: "发送", content: tempSendData })
                  }).catch(function (reason) {
                    console.log('失败了了,' + reason)
                    that.addData({ dataType: "其他", content: '发送失败' })

                  })
     
                 // that.sendData(res.value);
                  console.log("BLEdate:",BLEdate);
                }

                const hex = that.buf2hex(bledata.slice(0,res.value.byteLength-2))
                //const hex = that.buf2hex(res.value)
                that.setData({
                  receiveByteLen: that.data.receiveByteLen + res.value.byteLength,
                  recLenBySecond: that.data.recLenBySecond + res.value.byteLength,
                })
                console.log('返回的数据：', hex)
                that.addData({dataType:"接收", content:hex})
                //brokenline.loadForVisitTrend()
                
              })

          
              wx.notifyBLECharacteristicValueChanged({
                deviceId: device.deviceId,
                serviceId: that.data.serviceId,
                characteristicId: that.data.receiveId,
                state: true,
                success: function(res){
                  // success
                  console.log('notify', res)
                  that.addData({dataType:"其他",content:'打开通知成功'})
                  that.data.initSuccess = true;
                  that.sendData("66");
                },
                fail: function(res) {
                  console.log('失败',res)
                }
              })
        
            }
          })

        },
        fail: function(res) {
          console.log('服务扫描失败',res)
        }
      })
  },
  //input输入
  bindInputData: function (e) {
    this.setData({
      inputData: e.detail.value
    })
  },
  // 设置
  bindSet: function() {
  },

  //发送按钮
  bindSend: function () {
    var that = this
    var device = app.globalData.selectDevice
    console.log('发送按钮',device)

    var tempSendData = this.data.inputData
    var buffer = this.stringToHexBuffer(tempSendData)
    console.log('测试' + buffer.length)
    this.setData({
        sendByteLen: that.data.sendByteLen + buffer.byteLength,
      })

    var p = new Promise(function (resolve, reject) {
      console.log('开始 new Promise...');
      resolve(tempSendData);
    });

    var count = parseInt((tempSendData.length + 39)/40)
    for(var i=0; i<count; i++) {
      p = p.then(this.sendData)
    }

    p.then(function (resolve, reject) {
      that.addData({ dataType: "发送", content: tempSendData })
    }).catch(function (reason) {
      console.log('失败了了,' + reason)
      that.addData({ dataType: "其他", content: '发送失败' })
    })
    
  },
  //发送数据
  sendData:function (data) {

    var that = this
    var device = app.globalData.selectDevice

    //前20个字节
    var before = data.substring(0, 40)
    var after = data.substring(40)

    console.log('发送数据'+before)

    var buffer = this.stringToHexBuffer(before)
    return new Promise(function (resolve, reject) {

      wx.writeBLECharacteristicValue({
        deviceId: device.deviceId,
        serviceId: that.data.serviceId,
        characteristicId: that.data.sendId,
        value: buffer,
        success: function (res) {
          // success
          console.log('write success:', res)
          resolve(after)
        },
        fail: function (res) {
          // fail
          console.log('write failed:', res)
          reject('发送失败')
        },
        complete: function (res) {
          // complete
          console.log('write', res)
        }
      })
    })
  },
  //添加数据
  addData:function (data) {
    var temp = this.data.dataList;
    console.log('addData',data)
    temp.push(data)
    this.setData({
      dataList:temp
    })
  },

  //字符串转buffer 十六进制
  stringToHexBuffer: function (data) {
    // var data = 'AA5504B10000B5'
    var typedArray = new Uint8Array(data.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))

    return typedArray.buffer
  },

  buf2hex: function (buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    },
    //16进制转10进制
  hex2dex:function (str) {
      return parseInt(str, 16).toString(10)
    },
  onBleDataAnalysic:function (data) {



  }, 
   //字符串转arraybuffer
  char2buf: function (str) {
    var out = new ArrayBuffer(str.length*2);
    var u16a= new Uint16Array(out);
    var strs = str.split("");
    for(var i =0 ; i<strs.length;i++){
        u16a[i]=strs[i].charCodeAt();
    }
    return out;
  },

  //arraybuffer 转字符串
  buf2char: function (buf) {
    var out="";
    var u16a = new Uint16Array(buf);
    var single ;
    for(var i=0 ; i < u16a.length;i++){
        single = u16a[i].toString(16)
        while(single.length<4) single = "0".concat(single);
        out+="\\u"+single;
    }
    return out//eval("'"+out+ "'");
  },

   Uint8ArrayToString: function (fileData){
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
   
    return dataString
  
  }

})
