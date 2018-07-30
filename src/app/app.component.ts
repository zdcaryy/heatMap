import { Component } from '@angular/core';
import {forEach} from '@angular/router/src/utils/collection';
declare var echarts:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ngOnInit() {
     this.mySort();
     this.mySlice();
     this.echartOption.series[0].data=JSON.parse(JSON.stringify(this.pieData));
     this.echartOption.legend.selected=JSON.parse(JSON.stringify(this.seletedArea));
     this.echartOption.legend.data=JSON.parse(JSON.stringify(this.pieLegendData));
     this.myChart=echarts.init(document.getElementById('pie'));
     this.legendDone();
  }
  myChart;
  echartOption = {
    color: ['#0b2df0','#1372b2','#aa4cde', '#8358dd', '#47c5eb', '#91c7ae'],
    backgroundColor:'#12243c',
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
      bottom: 50,
      data: [],
      selected:{},
      textStyle:{
        color:'#fff'
      }
    },
    series: [
      {
        name: '人数',
        type: 'pie',
        radius : ['44%','55%'],
        center: ['50%', '50%'],
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
    {name:'a区',value:1500},
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
    this.myChart.on('legendselectchanged',function(params){
      if(that.topFive.indexOf(params.name)!=-1){
        that.myChart.setOption(that.echartOption);
        return;
      }
      else{
        let v;
        for(let i of that.test){
          if(i.name==params.name){
            v=i.value;
          }
        }
        for(let i in that.echartOption.legend.selected){
          if(that.topFive.indexOf(i)!=-1){
            that.echartOption.legend.selected[i]=true;
          }
          else if(i==params.name){
            that.echartOption.legend.selected[params.name]=!that.echartOption.legend.selected[params.name];
          }
          else{
            that.echartOption.legend.selected[i]=false;
          }
        }
        for(let i of that.echartOption.series[0].data){
          if(i.name==params.name){
            i.value=v;
            i['itemStyle']={
              color:'#0bf098'
            }
          }
          if(i.name=='其他'&&that.echartOption.legend.selected[params.name]==true){
            i.value=that.other-v;
          }
          if(i.name=='其他'&&that.echartOption.legend.selected[params.name]==false){
            i.value=that.other;
          }
        }
        that.myChart.setOption(that.echartOption);//数据驱动不生效，只能再次设置
      }
    });//使用angular通过（）绑定事件，只能绑定节点自带的事件，特殊事件只能使用js綁定
  }
}
