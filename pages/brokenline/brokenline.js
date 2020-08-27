//线性图
var dimen = require("../../utils/dimen.js");
var data = require('../../data/daily.js');

//计算日期对应周数
var date0=data.visitTrend[0].ref_date.toString();
var date01=date0.substring(0,4);
var date02=date0.substring(4,6);
var date03=date0.substring(6,date0.length);
var date00=date01+","+date02+","+date03;

var week=new Date(date00);
var initial_day=week.getDay();
if(initial_day==0) initial_day=7;

var temp_date=8-initial_day;
// console.log(initial_day,temp_date);
// console.log(date00);

//创建 canvas 绘图
const context_line = wx.createCanvasContext('line-canvas');
const message=wx.createCanvasContext('message-canvas');

var messageWidth=0;
var messageHeight=0;

var canvasWidth_line = 0;
var canvasHeight_line = 0;

// x轴放大倍数
var ratioX = 53;//12.4
var ratioX_Month =10.4;
// y轴放大倍数
var ratioY = 1;
var flag0=0;

//黑色
var black='#000000'
// 紫色
var purple = '#7E8FDD';
// 浅紫
var lightPurple = '#D6DBF4';
// 灰色
var gray = '#cccccc';
// 浅灰
var lightGray = '#c7cce5';
// 橙色
var orange = '#ffaa00';
// 浅橙色
var lightOrange = '#DAD7DC';
// 板岩暗蓝灰色
var SlateBlue = '#6A5ACD';

// 最大访问人数
var maxUV = 0;

var count = 0;


Page({
  data: {
    visitTrendList: [],   //调用数据
  },

  onLoad: function () {   //登陆
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        dimen.init(res.windowWidth);      //初始化屏幕自适应
        canvasWidth_line = dimen.rpx2px(710);    // 折线图的画布宽度
        canvasHeight_line = dimen.rpx2px(400);   // 折线图的画布高度

        messageWidth=dimen.rpx2px(740);
        messageHeight=dimen.rpx2px(308);
      }
    });
    
  },

  switch1Change:function(){
    flag0++;
    if(flag0%2==1){
      context_line.draw();
      
      this.loadForVisitTrend_Month();
      
    }
    if(flag0%2==0){
      context_line.draw();
      
      this.loadForVisitTrend();
    }
  
  },

  onShow:function(){
    context_line.draw();
    message.draw();
    this.loadForVisitTrend();
    context_line.draw();
    this.loadForVisitTrend();
    this.loadmessage();
  },
  
  loadmessage:function(){
    var that = this;
    that.data.visitTrendList = data.visitTrend; //存储数据
    var list = this.data.visitTrendList;
    that.drawtailmessage();
    that.drawtaildata(this.data.visitTrendList);
    that.draw_message();
  },

//画一些数据在图表上
  drawtaildata:function(list){
    var today_data=0;
    var week_average=0;
    var unit="g";
    var temp=0;
    var tempp=0;
    var power=70;
    // let tmp_week=week.getDay();//0（周日), 6（周六）
    // if(tmp_week==0) tmp_week=7;

    let index_today_data=list.length-1;
     today_data=list[index_today_data].visit_uv;
     message.font="30px Georgia";

        if(list.length<=temp_date){
          for(let i=0;i<list.length;i++){
          temp+=list[i].visit_uv;
          week_average=temp/(i+1);
          week_average=week_average.toFixed(1);
          }
        }
        else if((list.length-temp_date)%7==0){
          
          for(let i=list.length-7;i<=list.length-1;i++){
           tempp+=list[i].visit_uv;
          }
          week_average=tempp/7;
          week_average=week_average.toFixed(1);
         }
        else  {//list.length>temp_date && (list.length-temp_date)%7!=0
        let Num_week=(list.length-temp_date)/7;
         if(Num_week<1){
             for(let i=0;i<temp_date;i++){
               temp+=list[i].visit_uv;
               week_average=temp/(i+1);
               week_average=week_average.toFixed(1);
            }

         }
         else {
          let Num_week_th=parseInt(Num_week);
          let t=temp_date+7*(Num_week_th-1)
           for(let i=t;i<t+7;i++){
            temp+=list[i].visit_uv;
            week_average=temp/7;
            week_average=week_average.toFixed(1);
           }

         }
        }
        

    //标记数据
    if(today_data>9)
      message.fillText(today_data,messageWidth-dimen.rpx2px(686),messageHeight-dimen.rpx2px(125));
    else
     message.fillText(today_data,messageWidth-dimen.rpx2px(672),messageHeight-dimen.rpx2px(125));

     if(week_average>9)
     message.fillText(week_average,messageWidth-dimen.rpx2px(136),messageHeight-dimen.rpx2px(125));
     else
     message.fillText(week_average,messageWidth-dimen.rpx2px(146),messageHeight-dimen.rpx2px(125));



    if(today_data!=0){
    message.font="13px Georgia";
    message.fillText(unit,messageWidth-dimen.rpx2px(620),messageHeight-dimen.rpx2px(125));
    }
    if(week_average!=0){
      message.font="13px Georgia";
      message.fillText(unit,messageWidth-dimen.rpx2px(60),messageHeight-dimen.rpx2px(125));
    }
    //显示电量
      message.font="30px Georgia";
      message.fillText(power,messageWidth-dimen.rpx2px(406),messageHeight-dimen.rpx2px(125));
      message.font="13px Georgia";
      message.fillText("%",messageWidth-dimen.rpx2px(340),messageHeight-dimen.rpx2px(125));
  },

//做周月标记
  drawtailmessage:function(){
   var Day_Salt="今日量";
   var Other_message="电量";
   var Week_aver="周平均";
   message.setFillStyle("#ffffff");
   message.font="15px Georgia";
   message.fillText(Day_Salt,messageWidth-dimen.rpx2px(700),messageHeight-dimen.rpx2px(210));
   message.fillText(Other_message,messageWidth-dimen.rpx2px(400),messageHeight-dimen.rpx2px(210));
   message.fillText(Week_aver,messageWidth-dimen.rpx2px(150),messageHeight-dimen.rpx2px(210));
  },
  loadForVisitTrend: function () {
    var that = this;
   this.data.visitTrendList = data.visitTrend; //存储数据
  
    var list = this.data.visitTrendList;
    this.drawVisitBackground();   // 画横向参照线 
    this.drawDate(this.data.visitTrendList);  //画底部日期
    this.drawWeekends();//画周标记
    this.draw();    //画
    if(list.length<=7){
      for(count=0;count<list.length-1;count++){
        that.drawVisitUvLine(list, count);  //画访问人数折线
        that.draw();
      }
    }
     else if(list.length>7){
      for(count=list.length-7;count<list.length-1;count++){
        that.drawVisitUvLine(list, count);  //画访问人数折线
        that.draw();
      }
     }
   
  },
 
  loadForVisitTrend_Month:function(){
    var that = this;
    that.data.visitTrendList = data.visitTrend; //存储数据
   
     var list = that.data.visitTrendList;
     that.drawVisitBackground();   // 画横向参照线 
     that.drawDate_Month(that.data.visitTrendList);  //画底部日期
     that.drawMonth();//画月标记
     that.draw();    //画
     if(list.length<=30){
       for(count=0;count<list.length-1;count++){
         that.drawVisitUvLine_Month(list, count);  //画访问人数折线
         that.draw();
       }
     }
      else if(list.length>30){
       for(count=list.length-30;count<list.length-1;count++){
         that.drawVisitUvLine_Month(list, count);  //画访问人数折线
         that.draw();
       }
      }
  },
  /* 画用盐量的折线 */
  drawVisitUvLine: function (list, count) {
    // list.forEach(function (data, i, array) {
    //   if (data.visit_uv > maxUV) {
    //     maxUV = data.visit_uv;
    //   }
    // });
//x,y轴放大倍数
    ratioX = canvasWidth_line / 7;
    //ratioY = (canvasHeight_line -dimen.rpx2px(80)) / 6;
    ratioY=(canvasHeight_line +dimen.rpx2px(30))/12;
    if(list.length<=7){
      if (count < list.length-1 ) {
        // 当前点坐标
        var currentPoint = {
          x: count * ratioX + dimen.rpx2px(60),
          y: (canvasHeight_line - list[count].visit_uv * ratioY) +dimen.rpx2px(60)
        };
        // 下一个点坐标
        var nextPoint = {
          x: (count + dimen.rpx2px(2)) * ratioX + dimen.rpx2px(60),
          y: (canvasHeight_line - list[count + 1].visit_uv * ratioY) + dimen.rpx2px(60)
        }
  
        // 开始路径
        context_line.beginPath();
        // 画线：移动到当前点
        context_line.moveTo(currentPoint.x, currentPoint.y);
        // 画线：画线到下个点
        context_line.lineTo(nextPoint.x, nextPoint.y);
        // 设置线宽度
        context_line.setLineWidth(dimen.rpx2px(6));
        // 设置线颜色
        context_line.setStrokeStyle('#166ddd');
        // 描线
        context_line.stroke();
  
        // 填充内容：竖直往下，至x轴
       //context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
        // 填充内容：水平往左，至上一个点的在x轴的垂点
        //context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));
  
        // 设置填充颜色
       // context_line.setFillStyle('#f6f6f6')//rgba(212, 240, 204, 0.575)
  
        // 实现闭合与x轴之前的区域
        context_line.fill();
  
        context_line.beginPath();
        context_line.fillStyle='#ffbf00';
        context_line.arc(currentPoint.x,currentPoint.y,1,0,2*Math.PI,false);
        context_line.setStrokeStyle('#ffbf00');
        context_line.stroke();
        context_line.fill();
        
          context_line.beginPath();
          context_line.fillStyle='#ffbf00';
          context_line.arc(nextPoint.x,nextPoint.y,1,0,2*Math.PI,false);
          context_line.setStrokeStyle('#ffbf00');
          context_line.stroke();
          context_line.fill();
        
      }
    }
   else if(list.length>7){
      let dimal=(parseInt(list.length/7)-1)*7+(list.length%7);
    if (count < list.length-1 ) {
      // 当前点坐标
      var currentPoint = {
        x: (count-dimal) * ratioX + dimen.rpx2px(60),
        y: (canvasHeight_line - list[count].visit_uv * ratioY) +dimen.rpx2px(60)
      };
      // 下一个点坐标
      var nextPoint = {
        x: (count-dimal + dimen.rpx2px(2)) * ratioX + dimen.rpx2px(60),
        y: (canvasHeight_line - list[count + 1].visit_uv * ratioY) + dimen.rpx2px(60)
      }

      // 开始路径
      context_line.beginPath();
      // 画线：移动到当前点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 画线：画线到下个点
      context_line.lineTo(nextPoint.x, nextPoint.y);
      // 设置线宽度
      context_line.setLineWidth(dimen.rpx2px(6));
      // 设置线颜色
      context_line.setStrokeStyle('#166ddd');
      // 描线
      context_line.stroke();

      // 填充内容：竖直往下，至x轴
     //context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
      // 填充内容：水平往左，至上一个点的在x轴的垂点
      //context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));

      // 设置填充颜色
     // context_line.setFillStyle('#f6f6f6')//rgba(212, 240, 204, 0.575)

      // 实现闭合与x轴之前的区域
      context_line.fill();

      context_line.beginPath();
      context_line.fillStyle='#ffbf00';
      context_line.arc(currentPoint.x,currentPoint.y,1,0,2*Math.PI,false);
      context_line.setStrokeStyle('#ffbf00');
      context_line.stroke();
      context_line.fill();
      
        context_line.beginPath();
        context_line.fillStyle='#ffbf00';
        context_line.arc(nextPoint.x,nextPoint.y,1,0,2*Math.PI,false);
        context_line.setStrokeStyle('#ffbf00');
        context_line.stroke();
        context_line.fill();
      
    }

   }
  },
 /* 画月用盐量的折线 */
 drawVisitUvLine_Month: function (list, countt) {

//x,y轴放大倍数
 let ratioXX = canvasWidth_line /34;
  //ratioY = (canvasHeight_line -dimen.rpx2px(80)) / 6;
 let ratioYY=(canvasHeight_line +dimen.rpx2px(30))/12;
  if(list.length<=30){
    if (countt < list.length-1 ) {
      // 当前点坐标
      var currentPoint = {
        x: countt * ratioXX + dimen.rpx2px(60),
        y: (canvasHeight_line - list[countt].visit_uv * ratioYY) +dimen.rpx2px(60)
      };
      // 下一个点坐标
      var nextPoint = {
         x: (countt + dimen.rpx2px(2)) * ratioXX + dimen.rpx2px(60),
        y: (canvasHeight_line - list[countt + 1].visit_uv * ratioYY) + dimen.rpx2px(60)
      }

      // 开始路径
      context_line.beginPath();
      // 画线：移动到当前点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 画线：画线到下个点
      context_line.lineTo(nextPoint.x, nextPoint.y);
      // 设置线宽度
      context_line.setLineWidth(dimen.rpx2px(6));
      // 设置线颜色
      context_line.setStrokeStyle('#166ddd');
      // 描线
      context_line.stroke();

      // 填充内容：竖直往下，至x轴
     //context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
      // 填充内容：水平往左，至上一个点的在x轴的垂点
      //context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));

      // 设置填充颜色
     // context_line.setFillStyle('#f6f6f6')//rgba(212, 240, 204, 0.575)

      // 实现闭合与x轴之前的区域
      context_line.fill();

      context_line.beginPath();
      context_line.fillStyle='#ffbf00';
      context_line.arc(currentPoint.x,currentPoint.y,1,0,2*Math.PI,false);
      context_line.setStrokeStyle('#ffbf00');
      context_line.stroke();
      context_line.fill();
      
        context_line.beginPath();
        context_line.fillStyle='#ffbf00';
        context_line.arc(nextPoint.x,nextPoint.y,1,0,2*Math.PI,false);
        context_line.setStrokeStyle('#ffbf00');
        context_line.stroke();
        context_line.fill();
      
    }
  }
 else if(list.length>30){
    let dimal=(parseInt(list.length/30)-1)*30+(list.length%30);
  if (countt < list.length-1 ) {
    // 当前点坐标
    var currentPoint = {
      x: (countt-dimal) * ratioXX + dimen.rpx2px(60),
      y: (canvasHeight_line - list[countt].visit_uv * ratioYY) +dimen.rpx2px(60)
    };
    // 下一个点坐标
    var nextPoint = {
      x: (countt-dimal + dimen.rpx2px(2)) * ratioXX + dimen.rpx2px(60),
      y: (canvasHeight_line - list[countt + 1].visit_uv * ratioYY) + dimen.rpx2px(60)
    }

    // 开始路径
    context_line.beginPath();
    // 画线：移动到当前点
    context_line.moveTo(currentPoint.x, currentPoint.y);
    // 画线：画线到下个点
    context_line.lineTo(nextPoint.x, nextPoint.y);
    // 设置线宽度
    context_line.setLineWidth(dimen.rpx2px(6));
    // 设置线颜色
    context_line.setStrokeStyle('#166ddd');
    // 描线
    context_line.stroke();

    // 填充内容：竖直往下，至x轴
   //context_line.lineTo(nextPoint.x, canvasHeight_line - dimen.rpx2px(40));
    // 填充内容：水平往左，至上一个点的在x轴的垂点
    //context_line.lineTo(currentPoint.x, canvasHeight_line - dimen.rpx2px(40));

    // 设置填充颜色
   // context_line.setFillStyle('#f6f6f6')//rgba(212, 240, 204, 0.575)

    // 实现闭合与x轴之前的区域
    context_line.fill();

    context_line.beginPath();
    context_line.fillStyle='#ffbf00';
    context_line.arc(currentPoint.x,currentPoint.y,1,0,2*Math.PI,false);
    context_line.setStrokeStyle('#ffbf00');
    context_line.stroke();
    context_line.fill();
    
      context_line.beginPath();
      context_line.fillStyle='#ffbf00';
      context_line.arc(nextPoint.x,nextPoint.y,1,0,2*Math.PI,false);
      context_line.setStrokeStyle('#ffbf00');
      context_line.stroke();
      context_line.fill();
    
  }

 }
},

  /* 画横向参照线 */
  drawVisitBackground: function () {      
    var lineCount = 6;    //5条
    var estimateRatio = 2;
    var ratio =(canvasHeight_line +dimen.rpx2px(30)) / lineCount;
    
    var maxPeople = 10;
    for (var i = 0; i < lineCount; i++) {
      context_line.beginPath();   //创建一个新路径
      //设置当前坐标点
      var currentPoint = {
        x: dimen.rpx2px(40),
        y: (canvasHeight_line - i * ratio) +dimen.rpx2px(60)//-dimen.rpx2px(40)
      };
      // 移动到当前坐标点
      context_line.moveTo(currentPoint.x, currentPoint.y);
      // 向Y正轴方向画线
      context_line.lineTo(canvasWidth_line - dimen.rpx2px(10), (canvasHeight_line - i * ratio)+dimen.rpx2px(60));
      // 设置属性
      context_line.setLineWidth(dimen.rpx2px(2));
      // 设置颜色
      context_line.setStrokeStyle(lightGray);
      context_line.stroke();
      // 标注数值
      context_line.setFillStyle(black);
      // 底部人数文字
      if(i>0)
      context_line.fillText(i * maxPeople / (lineCount - 1), currentPoint.x - dimen.rpx2px(40), currentPoint.y+dimen.rpx2px(8));
    }
  },
  /* 画底部日期 */
  drawDate: function (list) {
    var ref_date = "";
    var temp_ref_date1 = "";
    var temp_ref_date2 = "";
      if(list.length<=7){
        for (let flag=0;flag<=list.length-1;flag++) {
          context_line.setFillStyle(black);    //灰色
          ref_date = list[flag].ref_date.toString();
          if(ref_date.substring(4,6)<10){
            temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
          }
          else if(ref_date.substring(4,6)>=10){
            temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
          }
          temp_ref_date2 = ref_date.substring(6, ref_date.length);
          ref_date = temp_ref_date1 + temp_ref_date2;
          context_line.fillText(ref_date, flag * ratioX + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));
        }
      }
       else if(list.length>7){
        let dimal=(parseInt(list.length/7)-1)*7+(list.length%7);
        for (let flag=list.length-7;flag<=list.length-1;flag++) {
          context_line.setFillStyle(black);    //灰色
          ref_date = list[flag].ref_date.toString();
          if(ref_date.substring(4,6)<10){
            temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
          }
          else if(ref_date.substring(4,6)>=10){
            temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
          }
          temp_ref_date2 = ref_date.substring(6, ref_date.length);
          ref_date = temp_ref_date1 + temp_ref_date2;
          context_line.fillText(ref_date, (flag-dimal) * ratioX + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));
        }

       }
  
  },
  /*画底部月日期 */
  drawDate_Month: function (list) {
    var ref_date = "";
    var temp_ref_date1 = "";
    var temp_ref_date2 = "";
      if(list.length<=30){
        for (let flag=0;flag<=list.length-1;flag+=6) {
          context_line.setFillStyle(black);    //灰色
          ref_date = list[flag].ref_date.toString();
          if(ref_date.substring(4,6)<10){
            temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
          }
          else if(ref_date.substring(4,6)>=10){
            temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
          }
          temp_ref_date2 = ref_date.substring(6, ref_date.length);
          ref_date = temp_ref_date1 + temp_ref_date2;
          context_line.fillText(ref_date, flag * ratioX_Month + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));

          if(list.length-1-flag==(list.length-1)%6  && (list.length-1)%6 !=0){
          flag+=(list.length-1)%6;
          ref_date = list[flag].ref_date.toString();
          if(ref_date.substring(4,6)<10){
            temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
          }
          else if(ref_date.substring(4,6)>=10){
            temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
          }
          temp_ref_date2 = ref_date.substring(6, ref_date.length);
          ref_date = temp_ref_date1 + temp_ref_date2;
          context_line.fillText(ref_date, flag * ratioX_Month + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));
          }
        }

      }
      else if(list.length>30){
        let dimall=(parseInt(list.length/30)-1)*30+(list.length%30);
        for (let flag=list.length-30,vm=0;flag<=list.length-1;flag+=6,vm++) {
          context_line.setFillStyle(black);    //灰色
          ref_date = list[flag].ref_date.toString();
          if(ref_date.substring(4,6)<10){
            temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
          }
          else if(ref_date.substring(4,6)>=10){
            temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
          }
          temp_ref_date2 = ref_date.substring(6, ref_date.length);
          ref_date = temp_ref_date1 + temp_ref_date2;
          context_line.fillText(ref_date, (flag-dimall)* ratioX_Month + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));
          if(vm==4){
            flag+=5;
            ref_date = list[flag].ref_date.toString();
            if(ref_date.substring(4,6)<10){
              temp_ref_date1 = ref_date.substring(5, 6) + ".";//截取第4个到第6个字符
            }
            else if(ref_date.substring(4,6)>=10){
              temp_ref_date1 = ref_date.substring(4, 6) + ".";//截取第4个到第6个字符
            }
            temp_ref_date2 = ref_date.substring(6, ref_date.length);
            ref_date = temp_ref_date1 + temp_ref_date2;
            context_line.fillText(ref_date, (flag-dimall)* ratioX_Month + dimen.rpx2px(40), canvasHeight_line + dimen.rpx2px(90));
          }
        }
        
       }
  
  },
  /*显示月标记*/ 
  drawMonth:function(){
   var Month="Month";
   context_line.fillText(Month,5 * ratioX +dimen.px2rpx(23),canvasHeight_line-dimen.px2rpx(80));
  },
  /*显示周标记 */
  drawWeekends:function(){
  var Weekends="Weekends";
  context_line.fillText(Weekends,5 * ratioX+dimen.px2rpx(15) ,canvasHeight_line-dimen.px2rpx(80));
  },
  // 画
  draw: function () {
    context_line.draw(true);
  },
  draw_message:function(){
    message.draw(true);
  },

})
