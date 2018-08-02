import { Component, OnInit } from '@angular/core';
import{HostListener} from '@angular/core';

declare var echarts:any;

@Component({
  selector: 'app-data-compare',
  templateUrl: './data-compare.component.html',
  styleUrls: ['./data-compare.component.css']
})
export class DataCompareComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.scrollbar = document.querySelector(".scrollbar");
    this.scrollbutton=document.querySelector('.scrollbutton');
    this.content=document.querySelector('#lines ul');
    this.scale=(this.content.scrollHeight-this.content.clientHeight)/(this.scrollbar.clientHeight-this.scrollbutton.clientHeight);
    if(this.scale<=1){
      this.scrollbar.style.display='none';
    }
    else{
      this.scrollbar.style.display='block';
    }
    this.mySort();
    this.mySlice();
    this.pieOption.series[0].data=JSON.parse(JSON.stringify(this.pieData));
    this.pieOption.legend.selected=JSON.parse(JSON.stringify(this.seletedArea));
    this.pieOption.legend.data=JSON.parse(JSON.stringify(this.pieLegendData));
    this.pie=echarts.init(document.getElementById('pie'));
    this.legendDone();
  }
  /*********饼状图逻辑start*******/
  pie;
  pieOption = {
    color: ['#0b2df0','#1372b2','#aa4cde', '#8358dd', '#47c5eb', '#91c7ae'],
    // backgroundColor:'#12243c',
    title : {
      text: '地区人数统计',
      x:'center',
      textStyle:{
        color:'#0e70af'
      }
    },
    tooltip : {
      trigger: 'item',
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
  //测试数据
  test=[
    {name:'a区路路',value:1500},
    {name:'b区',value:1000},
    {name:'c区',value:900},
    {name:'d区',value:1000},
    {name:'e区',value:800},
    {name:'f区',value:2000},
    {name:'g区',value:3000},
    {name:'h区',value:1000},
    {name:'i区',value:1000},
    {name:'j区',value:1000},
    {name:'k区',value:1000},
    {name:'l区',value:1000},
    {name:'m区',value:1000},
    {name:'n区',value:1000},
    {name:'o区',value:1000},
    {name:'p区',value:1000},
    {name:'q区',value:1000},
    {name:'r区',value:1000},
    {name:'s区',value:1000},
    {name:'t区',value:1000},
  ];
  //处理后的数据
  pieData=null;
  pieLegendData=null;
  //选中的区域
  seletedArea={};
  //饼状图占比前五，不可点击图例，永远显示在饼状图上
  topFive=[];
  //将其他的总数量存储起来
  other:number;

  //降序排序，以对象中的人数属性作为排序的参照
  mySort():void{
    this.test.sort(this.compare('value'));
    this.test.forEach((item, index) => {
      this.seletedArea[item.name]=index<5;
    });
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
    this.pieData=this.test.slice(0,5);
    for(let i of this.pieData){
      this.topFive.push(i.name);
    }
    this.pieLegendData=this.test.slice(0,5);
    let otherNum=0;
    for(let item of this.test.slice(5)){
      otherNum+=item.value;
      this.pieData.push({name:item.name,value:null});
      this.pieLegendData.push({name:item.name,value:item.value});
    }
    this.other=otherNum;
    this.pieData.push({name:'其他',value:otherNum,itemStyle:{
        color:'#ccc'
      }});
    console.log(this.pieLegendData);
  }
  //点击legend图例事件
  legendDone(this):void{
    let that=this;
    this.pie.on('legendselectchanged',function(params){
      if(that.topFive.indexOf(params.name)!=-1){
        that.pie.setOption(that.pieOption);
        return;
      }
      else{
        let v;
        for(let i of that.test){
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
            i['itemStyle']={
              color:'#0bf098'
            }
          }
          if(i.name=='其他'&&that.pieOption.legend.selected[params.name]==true){
            i.value=that.other-v;
          }
          if(i.name=='其他'&&that.pieOption.legend.selected[params.name]==false){
            i.value=that.other;
          }
        }
        that.pie.setOption(that.pieOption);//数据驱动不生效，只能再次设置
      }
    });//使用angular通过（）绑定事件，只能绑定节点自带的事件，特殊事件只能使用js綁定
  }
  /*********饼状图逻辑end*******/

  /*********折线图1(line)逻辑start******/
  lineOption = {
    title: [{
      left: '200',
      text: '园区人流总量分布图',
      textStyle:{
        color:'#0e70af'
      }
    }],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: [7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,7.15,7.11,7.12,7.13,7.14],
      axisLine:{
        lineStyle:{
          color:'#ccc'
        }
      },
      axisLabel:{
        show:true,
        interval: 0
      },
      boundaryGap:false
    },
    yAxis: {
      // splitLine: {show: false},
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
        type: 'line',
        // showSymbol: false,
        smooth:true,
        data: [200,300,200,100,250,130,400,600,550,200,150,200,100,400]
      }
    ]
  };
  lineDraw(){

  }
  /*********折线图1(line)逻辑end******/

  /*********折线图2(lines)逻辑start******/
  linesOption={
    // backgroundColor:'rgba(222,222,222,.5)',
    title: [{
      top:10,
      left: 'center',
      text: '落日剧场',
      textStyle:{
        color:'#fff',
        fontSize:14,
        fontFamily:'宋体'
      }
    }],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
        data: ["06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12"],
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        axisLabel: {
          show: true,
          interval: 0
        },
        boundaryGap: false
      },
    yAxis: {
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
        mytool: {
          show: true,
          title: '添加到比较',
          icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
          onclick: function (){
            alert('myToolHandler1')
          }
        },
      }
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: [100,200,240,200,400,600,500,550],
        smooth:true
      }
    ]
  };
  scrollbar;
  scrollbutton;
  content;
  scale:number;//滚动条与内容的比例
  scroll(e){
    //兼容ie
    console.log(e.deltaY)
    if(e.wheelDelta){
      this.content.scrollTop+=(-e.wheelDelta);
    }
    else{
      this.content.scrollTop+=e.deltaY;
    }
    this.scrollbutton.style.top=(this.content.scrollTop/ this.scale) + 'px';
    console.log(this.content.scrollTop);
  }
  // @HostListener('mousewheel', ['$event']) private onMouseWheel($event:Event):void {
  //  console.log(111);
  // };
  /*********折线图2(lines)逻辑end******/
}
