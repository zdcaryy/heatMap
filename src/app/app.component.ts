import { Component } from '@angular/core';
import {forEach} from '@angular/router/src/utils/collection';
// declare var echarts:any;

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
  }
  echartOption = {
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

  //降序排序，以对象中的人数属性作为排序的参照
  mySort():void{
    this.test.sort(this.compare('value'));
    this.test.forEach((item, index) => {
      this.seletedArea[item.name]=index<4;
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
    this.pieData=this.test.slice(0,4);
    this.pieLegendData=this.test.slice(0,4);
    let otherNum=0;
    for(let item of this.test.slice(4)){
      otherNum+=item.value;
      this.pieData.push({name:item.name,value:null});
      this.pieLegendData.push({name:item.name,value:item.value});
    }
    this.pieData.push({name:'其他',value:otherNum,itemStyle:{
      color:'#ccc'
      }});
    console.log(this.pieLegendData);
  }
  //点击legend图例事件
  legendDone():void{
    console.log(1);
  }
}
