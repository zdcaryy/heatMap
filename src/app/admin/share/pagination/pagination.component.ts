import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {
  // @Input() totalRecords: number;//数据总数
  // @Input() rows: number = 5;//每页条数
  @Input() currentPage: number;//当前页
  @Input() pageLinkSize: number;//分页条显示页码个数
  @Input() pageCount: number;//总页数
  @Output() onPageChange = new EventEmitter(); 
  pageArr: Array<number> = [];
  pageValidation: any = { isFirst: false, isLast: false };

  constructor() { }

  ngOnInit() {
    // console.log('onInit');/
    this.initDefaultValue(); //初始化值
    this.getVisiblePageArr();
    this.validateIfFirstLast();
  }
  ngOnChanges(e) {
    // console.log('change',e);
    this.getVisiblePageArr();
    this.validateIfFirstLast();
    this.validateIfFirstLast();
  }
  initDefaultValue() {
    // this.rows = this.rows ? this.rows : 5;
    this.pageLinkSize = this.pageLinkSize ? this.pageLinkSize : 5;
    this.currentPage = this.currentPage ? this.currentPage : 1;
  }

  changePage(actionKey: string) {
    this.getCurrentPage(actionKey);
    this.getVisiblePageArr();
    let data = {
      // rows: this.rows,
      page: this.currentPage,
    }
    console.log(this.currentPage)
    this.onPageChange.emit(data);
  }

  //设置当前应该显示的页码
  getVisiblePageArr() {
    this.pageArr = [];
    let visiblePage = Math.min(this.pageLinkSize, this.pageCount);

    let start;
    start = Math.ceil(this.currentPage-visiblePage/2);
    // console.log('nowpage:',this.currentPage,'start:',start,'visible:',visiblePage);
    if(start<=1){ // start到了最左边
      start = 1;
    }else if(start+visiblePage-1>=this.pageCount){ // end到了最右边
      start = this.pageCount-visiblePage+1;
    }
    let end = start+visiblePage-1;
    // console.log('start:',start,'end:',end);
    for (var i = start; i <= end; i++) {
      this.pageArr.push(i);
    }
  }

  getCurrentPage(actionKey: string) {
    switch (actionKey) {
      case "first":
        this.currentPage = 1;
        break;
      case "last":
        this.currentPage = this.pageCount;
        break;
      case "pre":
        if (this.currentPage <= 0) {
          return;
        }
        this.currentPage = this.currentPage - 1;
        break;
      case "next":
        if (this.currentPage >= this.pageCount) {
          return;
        }
        this.currentPage = this.currentPage + 1;
        break;
      default:
        this.currentPage = Number(actionKey);
        break;
    }
    this.validateIfFirstLast();
  }
//首页和尾页时 向首页或向尾页不可点击 and 只有一页时都不能点击
  validateIfFirstLast() {
    if (this.pageCount == 1) { //总共只有一页
      this.pageValidation = { isFirst: true, isLast: true };
    } else if (this.currentPage == 1) { //第一页
      this.pageValidation = { isFirst: true, isLast: false };
    } else if (this.currentPage == this.pageCount) { //最后一页
      this.pageValidation = { isFirst: false, isLast: true };
    } else {
      this.pageValidation = { isFirst: false, isLast: false };
    }
  }

}

