import { Component, OnInit } from '@angular/core';
import{DataService} from '../../service/data.service';
import{ElementRef} from '@angular/core';

@Component({
  selector: 'app-data-show',
  templateUrl: './data-show.component.html',
  styleUrls: ['./data-show.component.css']
})
export class DataShowComponent implements OnInit {

  constructor(private dataService:DataService,public element:ElementRef) { }
  heads: any = [
    { label: "序号", field: 'id' },
    { label: "时间", field: 'addDate' },
    { label: "区域", field: 'area' },
    {label:"人数",field:'amount'}
  ];
  data = [
  ];
  ngOnInit() {
    this.getAres();
    let startDateElement=document.getElementById('startDate');
    let endDateElement=document.getElementById('endDate');
    let startDateObj=startDateElement['flatpickr']();
    let endDateObj=endDateElement['flatpickr']();
    this.getDateFrame();
  }
  //获取所有园区
  ares=[];
  areaSelect;
  getAres():void{
    this.dataService.getData('/data/getAllArea').subscribe(res=>{
      this.ares=res;
      this.ares.unshift('所有');
      this.areaSelect=this.ares[0];
    })
  }
  optionsShow():void{
    this.element.nativeElement.querySelector('#area-option-container').style.display='block';
  }
  optionHidden():void{
    this.element.nativeElement.querySelector('#area-option-container').style.display='none';
  }
  //选择园区
  areaPick(area):void{
    this.areaSelect=area;
    this.getDatas();
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
  //格式化时间
  dateFtt(date):any{
    let d= new Date(date),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = d.getFullYear() + '-',
      M = (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1) + '-',
      D = d.getDate()<10?'0' + d.getDate():d.getDate()+'';
    return Y+M+D;
  }
  /*********时间选择end*********/

  //获取数据
  getDatas():void{
    let i=0;
    let url=this.areaSelect=='所有'?'/data/getTotalByAreaAndDay?addDate='+this.startDate+'&endDate='+this.endDate+'&eachNum='+this.pageSize+'&pageNum='+this.nowPage:'/data/getTotalByAreaAndDay?addDate='+this.startDate+'&endDate='+this.endDate+'&area='+this.areaSelect+'&eachNum='+this.pageSize+'&pageNum='+this.nowPage;
    this.dataService.getData(url).subscribe(res=>{
      this.totalPage=res.pageCount;
      for(let item of res.amountByDays){
        item['id']=++i;
      }
      this.data=res.amountByDays;
    })
  }

  //分页
  pageSize:number = 10;
  totalPage:number = 1;
  nowPage:number = 1;
  getPage(e){
    this.nowPage = e.page;
    this.getDatas();
  }
}
