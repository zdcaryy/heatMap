import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor() { }

  heads: any = [
    { label: "序号", field: 'num' },
    { label: "编号", field: 'id' },
    { label: "区域", field: 'area' },
    { label: "位置", field: 'address' },
    // {label:"操作",field:'operate',canOper:true}];
    // { label: "操作", field: 'operate', operate: true, operations: ['查看', '删除'], colorConfig: { 查看: '#009688', 删除: '#d73e3e' } }
  ];
  equipments: any;
  ngOnInit() {
    this.equipments = [
      { num: '01', id: '12345', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '02', id: '12346', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '03', id: '95543', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '04', id: '12378', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '05', id: '32115', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '06', id: '25888', area: '兵马俑一号坑', address: '南门A出口' },
      { num: '07', id: '97756', area: '兵马俑一号坑', address: '南门A出口' },
    ];
  }

}
