import {AfterContentInit, Component, OnInit} from '@angular/core';
import{HostListener} from '@angular/core';
import{DataService} from '../../service/data.service';
import {forEach} from '@angular/router/src/utils/collection';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

declare var echarts:any;

@Component({
  selector: 'app-data-compare',
  templateUrl: './data-compare.component.html',
  styleUrls: ['./data-compare.component.css']
})
export class DataCompareComponent implements OnInit{

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.getAreas();
    this.getDateFrame();
    this.scrollbar = document.querySelector(".scrollbar");
    this.scrollbutton=document.querySelector('.scrollbutton');
    this.content=document.querySelector('#lines ul');
  }
  ngAfterViewChecked():void{
    this.scale=(this.content.scrollHeight-this.content.clientHeight)/(this.scrollbar.clientHeight-this.scrollbutton.clientHeight);
    if(this.scale<=1){
      this.scrollbar.style.display='none';
    }
    else{
      this.scrollbar.style.display='block';
    }
  }
  /*********时间选择start*********/
  startDate=null;
  endDate=null;//endLimit多加一天
  endLimit=null;
  //获取时间范围(上限和下限)与时间选择
  getDateFrame():void{
    let that=this;
    this.dataService.getData('/data/getByTimePoint').subscribe(res=>{
      this.endLimit=res[1];
      this.startDate=res[0];
      this.getxAxis();
      let t=new Date(res[1]);
      this.endDate=this.dateFtt(t.getTime()+24*60*60*1000);
      let startDateElement=document.getElementById("startDate");
      let endDateElement=document.getElementById("endDate");
      startDateElement.setAttribute('placeholder',"上限：'"+res[0]+"'");
      endDateElement.setAttribute('placeholder',"下限：'"+res[1]+"'");
      startDateElement.dataset.minDate=res[0];
      startDateElement.dataset.maxDate=res[1];
      endDateElement.dataset.minDate=res[0];
      endDateElement.dataset.maxDate=res[1];
      let startDateObj=startDateElement['flatpickr']();
      let endDateObj=endDateElement['flatpickr']();
      this.getDatas();
      startDateObj.config.onChange=function(a,b){
        that.startDate=b;
        endDateObj.config.minDate=new Date(that.startDate.split("-").join("."));//解决时区相差八小时
        that.getDatas();
        endDateObj.redraw();
      };
      endDateObj.config.onChange=function(a,b){
        startDateObj.config.maxDate=new Date(b.split("-").join("."));
        that.endLimit=startDateObj.config.maxDate;
        let t=new Date(b);
        that.endDate=that.dateFtt(t.getTime()+24*60*60*1000);
        that.getDatas();
        startDateObj.redraw();
      };
    })
  }
  //获取x轴数据
  getxAxis():void{
    this.xAxis=[];
    let start=new Date(this.startDate);
    let startTime=start.getTime();
    let end=new Date(this.endLimit);
    let endTime=end.getTime();
    this.xAxis.push(this.dateFtt(startTime));
    while(startTime<endTime){
      startTime+=24*60*60*1000;
      this.xAxis.push(this.dateFtt(startTime));
    }
  }
  /*********时间选择end*********/

  //色彩数组
  colorArr=[
    "#2ec7c9",
    "#b6a2de",
    "#5ab1ef",
    "#ffb980",
    "#d87a80",
    "#8d98b3",
    "#e5cf0d",
    "#97b552",
    "#95706d",
    "#dc69aa",
    "#07a2a4",
    "#9a7fd1",
    "#588dd5",
    "#f5994e",
    "#c05050",
    "#59678c",
    "#c9ab00",
    "#7eb00a",
    "#6f5553",
    "#c14089",
    "#516b91",
    "#59c4e6",
    "#edafda",
    "#93b7e3",
    "#a5e7f0",
    "#cbb0e3",
    "#893448",
    "#d95850",
    "#eb8146",
    "#ffb248",
    "#f2d643",
    "#ebdba4",
    "#4ea397",
    "#22c3aa",
    "#7bd9a5",
    "#d0648a",
    "#f58db2",
    "#f2b3c9"
  ];

  /*********饼状图逻辑start*******/
  pie;
  pieOption = {
    color: this.colorArr,
    // backgroundColor:'#12243c',
    title : {
      text: '园区人数占比',
      x:'center',
      textStyle:{
        color:'#0e70af'
      }
    },
    tooltip : {
      // trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      icon:'circle',
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 50,
      bottom: 53,
      data: [],
      selected:{},
      textStyle:{
        color:'#fff'
      },
      pageIconColor:'#ccc',
      pageIconInactiveColor:'#fff',
      pageTextStyle:{
        color:'#ccc'
      }
    },
    series: [
      {
        name: '人数',
        type: 'pie',
        radius : ['33%','44%'],
        center: ['30%', '50%'],
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  //处理前的数据
  pieSourceData=null;
  //处理后的数据
  pieData=null;
  pieLegendData=null;
  //选中的区域
  seletedArea={};
  //饼状图占比前五，图例不可通过点击开启关闭，永远显示在饼状图上
  topFive=[];
  //将其他的总数量存储起来
  other:number;

  //降序排序，以对象中的人数属性作为排序的参照
  mySort():void{
    this.pieSourceData.sort(this.compare('value'));
    this.pieSourceData.forEach((item, index) => {
      this.seletedArea[item.name]=index<5;
    });
    //对dataSource中的数据进行排序
    this.pieSourceData.forEach((item,index)=>{
      let t;
      this.dataSource.forEach((item2,index2)=>{
        if(item.name==item2.area){
          t=this.dataSource[index2];
          this.dataSource[index2]=this.dataSource[index];
          this.dataSource[index]=t;
        }
      })
    })
  }
  compare(property){
    return function(obj1,obj2){
      let value1 = obj1[property];
      let value2 = obj2[property];
      return  value2-value1;
    }
  }
  //获得数组中人数排行前五的元素
  mySlice():void{
    this.pieData=this.pieSourceData.slice(0,5);
    this.topFive=[];
    for(let i of this.pieData){
      this.topFive.push(i.name);
    }
    this.pieLegendData=this.pieSourceData.slice(0,5);
    if(this.pieSourceData.length>5){
      let otherNum=0;
      for(let item of this.pieSourceData.slice(5)){
        otherNum+=item.value;
        this.pieData.push({name:item.name,value:null,itemStyle:{}});
        this.pieLegendData.push({name:item.name,value:item.value});
      }
      this.other=otherNum;
      this.pieData.push({name:'其他',value:otherNum,itemStyle:{
          color:'#ccc'
        }});
    }
  }
  //点击legend图例事件
  legendDone(this):void{
    let that=this;
    this.pie.off('legendselectchanged');
    this.pie.on('legendselectchanged',function(params){
      if(that.topFive.indexOf(params.name)!=-1){
        that.pie.setOption(that.pieOption);
        return;
      }
      else{
        let v;
        for(let i of that.pieSourceData){
          if(i.name==params.name){
            v=i.value;
          }
        }
        for(let i in that.pieOption.legend.selected){
          if(that.topFive.indexOf(i)!=-1){
            that.pieOption.legend.selected[i]=true;
          }
          else if(i==params.name){
            that.pieOption.legend.selected[params.name]=!that.pieOption.legend.selected[params.name];
          }
          else{
            that.pieOption.legend.selected[i]=false;
          }
        }
        for(let i of that.pieOption.series[0].data){
          if(i.name==params.name){
            i.value=v;
          }
          if(i.name=='其他'&&that.pieOption.legend.selected[params.name]==true){
            i.value=that.other-v;
            if(i.value==0){
              i.value=null;
            }
          }
          if(i.name=='其他'&&that.pieOption.legend.selected[params.name]==false){
            i.value=that.other;
          }
        }
        that.pie.setOption(that.pieOption);//数据驱动不生效，只能再次设置
      }
    });//使用angular通过（）绑定事件，只能绑定节点自带的事件，特殊事件只能使用js綁定
  }
  //绘制饼状图
  pieDraw():void{
    let data=[];
    for(let item of this.dataSource){
      let sum=0;
      for(let i of item.data){
        sum+=i;
      }
      data.push({name:item.area,value:sum,itemStyle:{}});
    }
    this.pieSourceData=data;
    this.mySort();
    this.mySlice();
    for(let item of this.pieData){
      if(item.name!='其他'){
        item.itemStyle.color=this.lineColorObject[item.name];
      }
    }
    this.pieOption.series[0].data=JSON.parse(JSON.stringify(this.pieData));
    this.pieOption.legend.selected=JSON.parse(JSON.stringify(this.seletedArea));
    this.pieOption.legend.data=JSON.parse(JSON.stringify(this.pieLegendData));
    this.pie=echarts.init(document.getElementById('pie'));
    this.pie.setOption(this.pieOption);
    this.legendDone();
  }
  /*********饼状图逻辑end*******/


  /*********折线图1(line)逻辑start******/
  xAxis=[];//横坐标
  line=null;//对应的echart对象
  lineOption = {
    color:['red'],
    title: [{
      left: '200',
      text: '园区人流量变化对比折线图',
      textStyle:{
        color:'#0e70af'
      }
    }],
    tooltip: {
      trigger: 'axis'
    },
    legend:{
      data:[]
    },
    xAxis: {
      name:'时间',
      data: [],
      axisLine:{
        lineStyle:{
          color:'#ccc'
        }
      },
      axisLabel:{
        show:true,
        interval: 'auto'
      },
      boundaryGap:false
    },
    yAxis: {
      // splitLine: {show: false},
      name:'人数',
      splitLine:{
        lineStyle:{
          color:'rgba(222,222,222,.1)'
        }
      },
      axisLine:{
        lineStyle:{
          color:'#ccc'
        }
      }
    },
    grid: [{
      bottom: '20%'
    }],
    dataZoom:[
      {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        start: 0,
        end: 70,
        textStyle:{
          color:'#ccc'
        }
      },
      {
        id: 'dataZoomY',
        type: 'inside',
        yAxisIndex:0,
        filterMode: 'empty',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name:'总人数',
        type: 'line',
        // showSymbol: false,
        smooth:true,
        data: null
      }
    ]
  };
  lineData=[];
  lineDraw(){
    this.lineOption.xAxis.data=this.xAxis;
    this.xAxis.forEach((item,index)=>{
      this.lineData[index]=0;
    });
    let arr=[];
    for(let item of this.dataSource){
      arr.push(item.data)
    }
    arr.forEach((item1, index1) => {
        item1.forEach((item2,index2)=>{
          this.lineData[index2]+=arr[index1][index2];
        })
    });
    this.lineOption.series[0].data=this.lineData;
    this.line=echarts.init(document.getElementById('line'));
    this.line.setOption(this.lineOption);
  }
  /*********折线图1(line)逻辑end******/

  /*********折线图2(lines)逻辑start******/
  lineItemOption={
    isExit:false,
    title: {
      top:10,
      left: 'center',
      text: '',
      textStyle:{
        color:'#fff',
        fontSize:14,
        fontFamily:'宋体'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
        name:'时间',
        data: [],
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        axisLabel: {
          show: true,
          interval: 'auto'
        },
        boundaryGap: false
      },
    yAxis: {
      name:'人数',
      splitLine:{
        lineStyle:{
          color:'rgba(222,222,222,.1)'
        }
      },
      axisLine:{
        lineStyle:{
          color:'#ccc'
        }
      }
    },
    grid:{
      top:40,
      height:'45%',
    },
    dataZoom:[
      {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        start: 0,
        end: 70,
        textStyle:{
          color:'#ccc',
          height:10
        },
        height:20//该属性文档上没有提出
      },
      {
        id: 'dataZoomY',
        type: 'inside',
        yAxisIndex:0,
        filterMode: 'empty',
        start: 0,
        end: 100
      }
    ],
    toolbox: {
      show: true,
      top:8,
      right:20,
      feature: {
        dataZoom: {
          show:false
        },
        dataView: {readOnly: false},
        magicType: {type: ['line', 'bar']},
        restore: {
          show:false
        },
        saveAsImage: {},
      }
    },
    series:
      {
        name:'',
        type: 'line',
        showSymbol: false,
        data: null,
        smooth:true,
      }
  };
  linesOption=[];
  scrollbar;
  scrollbutton;
  content;
  scale:number;//滚动条与内容的比例
  //滚动视口
  scroll(e){
    //兼容ie、谷歌
    if(e.wheelDelta){
      this.content.scrollTop+=(-e.wheelDelta/4);
    }
    //兼容火狐
    else{
      this.content.scrollTop+=e.detail*10;
    }
    this.scrollbutton.style.top=(this.content.scrollTop/ this.scale) + 'px';
    this.linesLazyDraw();
  }

  //滑动滑块
   mouseDown(e){
     if (e.target === this.scrollbutton) {
       this.scrollbar.prevY = e.pageY;
     }
   }
   //鼠标移动到滚动条外部，只要鼠标不松开仍然可以滑动滑块
  @HostListener('window:mousemove', ['$event']) private onMouseMove($event:Event):void {
    if (this.scrollbar.prevY) {
      this.content.scrollTop += ($event['pageY'] - this.scrollbar.prevY) * this.scale;
      this.scrollbutton.style.top = (this.content.scrollTop / this.scale) + 'px';
      this.scrollbar.prevY = $event['pageY'];
      this.linesLazyDraw();
    }
    $event.preventDefault();
  };
  @HostListener('window:mouseup', ['$event']) private onMouseUp($event:Event):void {
    this.scrollbar.prevY = null;
  };

  //类似懒加载来动态在canvas绘制折线
  linesLazyDraw(){
    let n=Math.floor(this.content.scrollTop/(document.querySelector('#lines ul li div').clientHeight+10));
    for(let i=0;i<n;i++){
      if(!this.linesOption[i+2].series.data){
        this.linesOption[i+2].series.data=JSON.parse(JSON.stringify(this.dataSource[i+2].data));
        let line=echarts.init(document.getElementById(i+2+''));
        line.setOption(this.linesOption[i+2]);
      }
    }
  }
  areaCompareArr=[];//存放已经添加到对比中的地区
  lineColorObject={};//一个区域对应一种颜色，不改变，以园区名为key，颜色为value的对象
  linesDraw():void{
    this.lineOption.series=[{
      name:'总人数',
      type: 'line',
      smooth:true,
      data: null
    }];
    this.lineOption.color=['red'];
    this.dataSource.forEach((item, index) => {
      this.content.scrollTop=0;
      this.scrollbutton.style.top='0px';
      if(!this.linesOption[index]){
        let temp=index%this.colorArr.length;
        this.lineColorObject[item.area]=this.colorArr[temp];
      }
      this.linesOption[index]=JSON.parse(JSON.stringify(this.lineItemOption));
      this.linesOption[index].title.text=item.area;
      this.linesOption[index].series.name=item.area;
      this.linesOption[index].color=this.lineColorObject[item.area];
      if(index<2){
        this.linesOption[index].series.data=JSON.parse(JSON.stringify(item.data));
      }
      this.lineOption.series[0].data=this.lineData;
      if(this.areaCompareArr.indexOf(this.linesOption[index].series.name)!=-1){
        this.linesOption[index].isExit=true;
        // this.linesOption[index].series.data=JSON.parse(JSON.stringify(item.data));
        this.lineOption.series.push(JSON.parse(JSON.stringify(this.linesOption[index].series)));//用对象赋值，那么被赋值的量都指向相同地址，即便这个量是对象类型的数组的其中一个值
        this.lineOption.series[this.lineOption.series.length-1].data=JSON.parse(JSON.stringify(item.data));
        this.lineOption.series[this.lineOption.series.length-1]['itemStyle']={};
        this.lineOption.series[this.lineOption.series.length-1]['itemStyle'].color=this.lineColorObject[this.linesOption[index].series.name];
        // this.lineOption.color.push(this.lineColorObject[this.linesOption[index].series.name]);
        this.line.setOption(this.lineOption);
      }
      this.linesOption[index].xAxis.data=this.xAxis;
      let that=this;
      this.linesOption[index].toolbox.feature.mytool={
        show: true,
          title: '添加到比较',
          icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
          onclick: function (e){
          if(!e.option.isExit&&e.option.series[0].data!=null){
            that.lineOption.series.push(e.option.series[0]);
            that.lineOption.color.push(e.option.color);
            that.line.setOption(that.lineOption);
            e.option.isExit=true;
            that.areaCompareArr.push(e.option.series[0].name);
          }
        }
      };
    });
  }
  /*********折线图2(lines)逻辑end******/

  /*********柱状图逻辑start********/
  barOption={
    color: this.colorArr,
    title: [{
      left: '200',
      text: '园区人流量变化对比柱状图',
      textStyle:{
        color:'#0e70af'
      }
    }],
    tooltip : {
      trigger: 'axis'
    },
    legend:{
      right:50,
      top:30,
      type: 'scroll',
      selected:null,
      textStyle:{
        color:'#fff'
      },
      pageIconColor:'#ccc',
      pageIconInactiveColor:'#fff',
      pageTextStyle:{
        color:'#ccc'
      },
      data:[]
    },
    calculable : true,
    grid: [{
      bottom: '20%'
    }],
    dataZoom:[
      {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        start: 0,
        end: 70,
        textStyle:{
          color:'#ccc'
        }
      },
      {
        id: 'dataZoomY',
        type: 'inside',
        yAxisIndex:0,
        filterMode: 'empty',
        start: 0,
        end: 100
      }
    ],
    xAxis: {
        name:'时间',
        data:[
        ],
        interval:0,
        axisLine:{
          lineStyle:{
            color:'#ccc'
          }
        },
        axisLabel:{
          show:true,
          interval:'auto'
        },
        boundaryGap:true
      },
    yAxis: [
      {
        type: 'value',
        name: '人数',
        splitLine:{
          lineStyle:{
            color:'rgba(222,222,222,.1)'
          }
        },
        axisLine:{
          lineStyle:{
            color:'#ccc'
          }
        }
      }
    ],
    series: [

    ]
  };
  bar;
  sumData;//各个园区时间段内人数总量对应数组
  barSeriesItem={
    name: '',
    type: 'bar',
    barMaxWidth: '10',
    data:null
  };
  barDraw():void{
    this.sumData=this.pieSourceData;
    this.dataSource.forEach((item, index) => {
      this.barOption.series[index]=JSON.parse(JSON.stringify(this.barSeriesItem));
      this.barOption.series[index].name=item.area;
      this.barOption.series[index].data=item.data;
      this.barOption.xAxis.data=this.xAxis;
      this.barOption.legend.selected=this.seletedArea;
    });
    this.barOption.legend.data=this.sumData;
    this.bar=echarts.init(document.getElementById('bar'));
    this.bar.setOption(this.barOption);
    let that=this;
    this.bar.off('legendselectchanged');//解除事件绑定，避免重复绑定
    this.bar.on('legendselectchanged',function(params){
     if(that.topFive.indexOf(params.name)!=-1){
       that.barOption.legend.selected[params.name]=true;
       that.bar.setOption(that.barOption);
     }
     else{
       for(let i in that.barOption.legend.selected){
         if(that.topFive.indexOf(i)!=-1){
           that.barOption.legend.selected[i]=true;
         }
         else if(i==params.name){
           that.barOption.legend.selected[params.name]=!that.barOption.legend.selected[params.name];
         }
         else{
           that.barOption.legend.selected[i]=false;
         }
       }
       that.bar.setOption(that.barOption);
     }
    })
  };
  /*********柱状图逻辑end*********/

  //获取所有的园区
  ares=[];
  getAreas():void{
    this.dataService.getData('/data/getAllArea').subscribe(res=>{
      this.ares=res;
    })
  }
  //获取每一个园区在选择的时间段内每天拍摄到的人数
  dataSource=[];
  getDatas():void{
    this.dataSource=[];
    this.dataService.getData('/data/getByTime?startTime='+this.startDate+'&endTime='+this.endDate).subscribe(res=>{
      for(let area of this.ares){
        let dataArr=res.filter(item=>item.area==area);
        let dateArr=[];
        let amountArr=[];
        for(let item of dataArr){
          dateArr.push(item.addDate);
          amountArr.push(item.amount);
        }
        let startTimer=new Date(this.startDate);
        let endTimer=new Date(this.endDate);
        let start=startTimer.getTime();
        let end=endTimer.getTime();
        let newAmountArr=[];
        while(start<end){
          let index=dateArr.indexOf(this.dateFtt(start));
          if(index!=-1){
            newAmountArr.push(amountArr[index]);
          }
          else{
            newAmountArr.push(0);
          }
          start+=24*60*60*1000;
        }
        this.dataSource.push({
          area:area,
          data:newAmountArr
        });
      };
      this.getxAxis();
      this.pieDraw();
      this.lineDraw();
      this.linesDraw();
      this.barDraw();
    })
  }
  //格式化时间
  dateFtt(date):any{
    let d= new Date(date),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = d.getFullYear() + '-',
    M = (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '-',
    D = d.getDate()<10?'0' + d.getDate():d.getDate()+'';
    return Y+M+D;
  }

  //导出pdf格式文件
  canvasImg;
  pdfTranslate():void{
      html2canvas(document.body).then(canvas=>{
        this.canvasImg=canvas.toDataURL('image/png',1.0);
        let pdf=new jsPDF('landscape','pt','a4');
        pdf.background='red';
        pdf.addImage(this.canvasImg,'JPEG',0,(595.28-841.89/canvas.width*canvas.height)/2,841.89, 841.89/canvas.width*canvas.height);
        pdf.save(`${name}.pdf`);
      })
  }
}
