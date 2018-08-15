import { Component, OnInit } from '@angular/core';
import { IndexService } from "../service/index.service";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private indexService: IndexService
  ) { }
  ngOnInit() {
    this.getArea();
    this.getRadarData();
    this.getLineData();
  }
//<<<<<<<<<<<  地图 <<<<<<<<<<<<
  imgUrl: string = 'assets/img/map.png';
  //config中所有值都有默认值，都可以不写
  config: object = {
    scaling: true,//是否启用缩放，默认true
    drag: true, //是否启用拖动，默认true
    scaleStep: 0.15,//每滚动一次缩放多少，默认0.15，即 15%
    scaleMax: 3,//能放大的最大倍数--相对于图片的原始像素，默认 3 ，即 300%
    scaleMin: 0.2//能缩小的最小倍数--相对于图片的原始像素，默认 0.2，即 20%
  }
  getBox(box) {//获取父级div
    this.getPoint(box);
  }
  setPoint(box,x,y){ //建点
    let point = document.createElement('div');
    point.style.width = '10px';
    point.style.height = '10px';
    point.style.backgroundColor = 'red';
    point.style.position = 'absolute';
    point.style.top = y*100 + '%';
    point.style.left = x*100 + '%';
    box.appendChild(point);
  }
  getPoint(box){
    this.indexService.getData('/data/getTotalByCode').subscribe(
       res=>{
         for (let index = 0; index < res.length; index++) {
           var x = res[index].gps.split(',')[0];
           var y = res[index].gps.split(',')[1];
           var level = this.getLevel(res[index].total);
           this.drawArea(box, x, y, '2%', '2%', level);
         }
       }
     );
  }
// level: 0 ~ 100 描热力图点样式
  drawArea(box, x, y, w, h, level) {
    var point = document.createElement('div');
    point.style.position = 'absolute';
    point.style.left = x * 100 + '%';
    point.style.top = y * 100 + '%';
    point.style.width = w;
    point.style.height = h;
    point.style.borderRadius = '50%';
    var arr = [0, 40, 80]; //最多在 0 ~ 80%的区域渐变， 80 ~ 100 用于边缘透明渐变
    arr[1] = level * 70 / 100;
    arr[0] = level - 70;
    point.style.background = 'radial-gradient(closest-side circle,#EF0100 ' + arr[0] + '%,#F7F626 ' + arr[1] + '%,#88FD6E ' + arr[2] + '%,rgba(255,255,255,0) 100%)';
    box.appendChild(point);
  }
  getLevel(e){
    var level;
    if (e >0 && e<=200) {
      level = 10;
    }
    if (e > 200 && e <= 400) {
      level = 20;
    }
    if (e > 400 && e <= 600) {
      level = 40;
    }
    if (e > 600 && e <= 800) {
      level = 60;
    }
    if (e > 800 && e <= 1000) {
      level = 80;
    }
    if (e > 1000 ) {
      level = 100;
    }
    return level;
  }
  //<<<<<<<<<<<<<<区域详情<<<<<<<<<<<<<<<<<<
  area:any;
  area_heads: any = [
    { label: "时间", field: 'when' },
    { label: "编号", field: 'code' },
    { label: "区域", field: 'area' },
    { label: "人数", field: 'total' },
  ];
  getArea() {
    this.indexService.getData('/data/getRealTime').subscribe(
      res => { 
        this.area = res.map((item) => { item.when = this.getMyDate(Number(item.when)).split(' ')[1];return item});
      }
    );
  }
  //<<<<<<<<<<<<<<摄像头状态<<<<<<<<<<<<<<<<
  equipments: any;
  equipments_heads: any = [
    { label: "序号", field: 'num' },
    { label: "区域", field: '' },
    { label: "编号", field: '' },
    { label: "状态", field: '' },
  ];
  getEquipments(){
    this.indexService.getData('').subscribe(
      res => {
       
      }
    );
  }
  //<<<<<<<<<<< 图表:六芒星 <<<<<<<<<<<<<<<<<<
  getRadarData() {
    this.indexService.getData('/data/getTotalByArea').subscribe(
      res => {
        this.radarDataFormat(res);
      }
    );
  }
  radarDataFormat(data){ //格式化数据
   var  radarArea= [];
   var  radarTotal= [];
   var radarName={};
    for (let index = 0; index < data.length; index++) {
      radarName = {};
      radarName['name'] = data[index].area;
      // radarName['max'] =1000;
      radarArea.push(radarName);
      radarTotal.push(data[index].total);
      }
   this.setRaderOpiton(radarArea,radarTotal);
  } 
  radarOption:any={};
  setRaderOpiton(title,data){
    this.radarOption = {
      tooltip: {},
      // backgroundColor:'transparent',
      // legend: {
      //   data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      // },
      shape: 'circle',
      radar: {
        // shape: 'circle',
        splitNumber: 2,
        name: {
          textStyle: {
            color: '#fff',
            borderRadius: 3,
          },
        },
        indicator: title,
        // [
        //   { name: '园区入口', max: 6500 },
        //   { name: '美食街', max: 16000 },
        //   // // { name: '博物馆', max: 30000 },
        //   // // { name: '过山车', max: 38000 },
        //   // // { name: '动物园', max: 52000 },
        //   // // { name: '游泳池', max: 25000 }
        // ],
        splitArea: {//分隔区域设置
          areaStyle: {
            color: ['transparent']
          }
        },
        splitLine: {//分割线设置
          lineStyle: {
            color: ['#1f8eff'],
            opacity: 0.5
          }
        },
        axisLine: {
          lineStyle: {
            color: ['#1f8eff'],
          }
        }
        // axisLabel:{//标签样式
        //   inside:true,
        //   margin:0,
        //   show:false,
        //   color:'red'
        // },

      },
      series: [{
        name: '人流量',
        type: 'radar',
        data: [
          {
            value: data
            // [4300, 10000,]
          },
        ],
        itemStyle: {
          normal: {
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            lineStyle: {
              color: ['#2affed'],
              opacity: 0.5
            }
          }
        },
      }],

    };
  }

  //<<<<<<<<<<< 图表:动态line <<<<<<<<<<<<<<<<<<
  getLineData() {
    this.indexService.getData('/data/getTotalRealTime').subscribe(
      res => {
        this.lineDataFormat(res);
      }
    );
  }
  lineDataFormat(data){  //格式化数据
    var lineDate = [];
    var lineData =[];
    for (let index = 0; index < data.length; index++) {
      var date = this.getMyDate(data[index].date).split(' ')[1]; //转换时间格式
      // date = date.substr(0,5);
      lineDate.push(date);
      lineData.push(data[index].total);
   }
    this.setlineOption(lineDate, lineData);
  }
  lineOption:any={};
  setlineOption(date,data){
    this.lineOption = {
      xAxis: {
        type: 'category',
        splitLine: { show: false },//去除网格线
        boundaryGap: false,//折线两端顶格
        data: date,
        // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
          lineStyle: {
            color: '#00ffff',
            opacity: 0.1
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#1a8af3',
          }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },//去除网格线
        axisLine: {
          lineStyle: {
            color: '#00ffff',
            opacity: 0.1
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#1a8af3',
          }
        }
      },
      series: [{
        data:data,
        //  [820, 1200, 934, 1200, 845, 1330, 820],
        type: 'line',
        smooth: true,
        lineStyle: {           //折线样式
          color: '#00ffff',
        },
        itemStyle: {           //折线拐点样式
          opacity: 0.5
        },
        areaStyle: {          //区域样式
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#00cefa' // 0% 处的颜色
            }, {
              offset: 1, color: 'transparent' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }
        },


      }]
    };    
  }


//<<<<<<<<<<<<<<<<<<<<公用方法<<<<<<<<<<<<<<<<<<<<<<<<<<<

//时间戳转时间
  getMyDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      // oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间  
      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin);//最后拼接时间  
    return oTime;
  };
 //补0操作
getzf(num) {
  if (parseInt(num) < 10) {
    num = '0' + num;
  }
  return num;
}



}

