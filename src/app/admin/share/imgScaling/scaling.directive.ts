import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[imgScaling]'
})
export class ScalingDirective {

  constructor(private el:ElementRef) { 
  	
  }

  o:any; //outer box
  m:any; //masking over img
  // i:any; //img
  naturalWidth:number; //naturalWidth of img
  naturalHeight:number;
  whScale:number;

  @Input() imgUrl:string;
  @Input() config:any;

  @Output() getOuterBox:EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(){

  }

  ngAfterViewInit(){
    this.initElement();
  }

  /**** 先获取节点 ****/
  initElement(){
    this.o = this.el.nativeElement;
    this.o.style.overflow = 'hidden';
    this.m = document.createElement('div');
    this.m.style.position = "absolute";
    this.m.style.userSelect = "none";
    let i = new Image();
    i.src = this.imgUrl;
    i.style.width = '100%';
    i.style.height = '100%';
    i.setAttribute('bg','bg');//识别用
    // this.i.style.position = 'absolute';
    // this.i.style.left = '0px';
    // this.i.style.top = '0px';
    i.onload = ()=>{
      console.log('onload');
      this.naturalWidth = i.naturalWidth;
      this.naturalHeight = i.naturalHeight;
      this.whScale = this.naturalWidth/this.naturalHeight;
      this.setMasking();
      this.checkConfig();
      this.getOuterBox.emit(this.m);
    }
    this.m.appendChild(i);
    this.o.appendChild(this.m);
  }

  /**** 根据config来配置功能 ****/
  checkConfig(){
    let config = this.config?this.config:{};
    if(!(config&&config.scaling==false)){
      let step = config.hasOwnProperty('scaleStep')?config.scaleStep:0.15;
      let max = config.hasOwnProperty('scaleMax')?config.scaleMax:3;
      let min = config.hasOwnProperty('scaleMin')?config.scaleMin:0.2;
      this.setScaling(step,max,min);
    }
    if(!(config&&config.drag==false)){
      this.setDrag(this.m);
    }
  }

  /**** 配置缩放功能 ****/
  setScaling(step,max,min){
    let timeOutControl;
    let that = this;
    this.m.addEventListener('wheel',function(e){
      //只有在图片上滚动才能缩放
      if(!e.target.attributes['bg']){return};
      let upDown = e.deltaY>0?0:1;
      // console.log(this.offsetParent);
      // console.log(e);
      let x = 0;
      let buffer = this;
      while(buffer.offsetParent){
        console.log(buffer);
        x += buffer.offsetLeft;
        buffer = buffer.offsetParent;
        console.log(x,buffer.offsetParent);
      }
      let xScale = e.offsetX/this.clientWidth;
      let yScale = e.offsetY/this.clientHeight;
      scaling(this,500,step,upDown,xScale,yScale);
    });
    // element,during,step,upDown,xScale,yScale 
    function scaling(ele,d,step,upDown,xScale?,yScale?){
      clearTimeout(timeOutControl)
      let t = 0;
      let timeAdd = 10;//动画执行的时间间隔
      let w = ele.clientWidth;
      let h = ele.clientHeight;
      let left = that.removePx(ele.style.left);
      let top = that.removePx(ele.style.top);
      let oldWidth;
      let oldHeight;
      //当没有设置中心点，默认按照窗口的中心缩放
      let window = ele.parentElement;
      xScale = arguments.length>=5?xScale:(window.clientWidth/2-that.removePx(ele.style.left))/ele.clientWidth; //滚动时鼠标距离图片左边的比例
      yScale = arguments.length>=6?yScale:(window.clientHeight/2-that.removePx(ele.style.top))/ele.clientHeight; //同理，顶部比例
      //最小单位为timeAdd，多余的删掉
      d -= d%timeAdd;
      //放大 or 缩小
      if(upDown==1){
        //向上滚，放大
        (function timer(){
            if(t>d){/*console.log(ele.clientWidth/naturalWidth);*/return}
            // 缩放同时保持中心不变
            oldWidth = ele.clientWidth;
            oldHeight = ele.clientHeight;
            ele.style.width = that.calc(t,w,step*w,d)+'px';
            ele.style.height = that.calc(t,h,step*h,d)+'px';
            // console.log(left,that.calc(t,left,-step*w*xScale,d)+'px');
            ele.style.left = that.removePx(ele.style.left)-(ele.clientWidth-oldWidth)*xScale+'px';
            ele.style.top = that.removePx(ele.style.top)-(ele.clientHeight-oldHeight)*yScale+'px';
            // ele.style.left = that.calc(t,left,-step*w*xScale,d)+'px';
            // ele.style.top = that.calc(t,top,-step*h*yScale,d)+'px';
            t += timeAdd;
            timeOutControl = setTimeout(timer,timeAdd);
          }());
      }else if(upDown==0){
        //向下滚，缩小
        (function timer(){
            if(t>d){/*console.log(ele.clientWidth/naturalWidth);*/return}
            // 缩放同时保持中心不变
            oldWidth = ele.clientWidth;
            oldHeight = ele.clientHeight;
            ele.style.width = that.calc(t,w,(w/(1+step)-w),d)+'px';
            ele.style.height = that.calc(t,h,(h/(1+step)-h),d)+'px';
            ele.style.left = that.removePx(ele.style.left)-(ele.clientWidth-oldWidth)*xScale+'px';
            ele.style.top = that.removePx(ele.style.top)-(ele.clientHeight-oldHeight)*yScale+'px';
            // ele.style.left =  that.calc(t,left,-(w/(1+step)-w)*xScale,d)+'px';
            // ele.style.top = that.calc(t,top,-(h/(1+step)-h)*yScale,d)+'px';
            t += timeAdd;
            timeOutControl = setTimeout(timer,timeAdd);
          }());
      }
    }
  }
  /**** 配置缩放功能 over****/

  //t: current time, b: beginning value(x0), c: change In value(delta), d: duration
  calc(t, b, c, d) { 
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  }
  // 去除'px',返回数字
  removePx(px){
    return parseFloat(px.substr(0,px.length-2));
  }

  /**** 拖拽 ****/
  setDrag(ele){
    let candrag = false;
    let nowX;
    let nowY;
    let that = this;
    ele.addEventListener('mousedown',function(e){
      //在图片上按下鼠标 "左键 "，才能拖拽
      if(!e.target.attributes['bg'] || e.buttons!==1){return};
      e.preventDefault();
      candrag = true;
      nowX = e.pageX;
      nowY = e.pageY;
      // console.log('mousedown');
    });
    ele.addEventListener('mousemove',function(e){
      if(!e.target.attributes['bg']){return}
      if(!candrag){return};
      // movementX只兼容ff和chrome... 所以不用...
      this.style.left = that.removePx(this.style.left)+(e.pageX-nowX)+'px';
      this.style.top = that.removePx(this.style.top)+(e.pageY-nowY)+'px';
      nowX = e.pageX;
      nowY = e.pageY;
    });
    ele.addEventListener('mouseleave',function(e){
      candrag = false;
    });
    ele.addEventListener('mouseup',function(e){
      candrag = false;
    });
  }
  /**** 拖拽 over****/

  /* 配置蒙版层的属性 -- 宽高，位置 */
  setMasking(){
    this.m.style.width = this.naturalWidth+'px';
    this.m.style.height = this.naturalHeight+'px';
    this.m.style.left = '0px';
    this.m.style.top = '0px';
  }

}
