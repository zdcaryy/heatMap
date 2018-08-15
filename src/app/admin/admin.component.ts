import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router,) { }

  username:string;

  ngOnInit() {
  	this.username = localStorage.getItem('username');
    console.log('***************')
    // this.router.events.subscribe(rou=>{console.log('---router---',rou)});
  }

  logOut(){
  	localStorage.removeItem('username');
  	this.router.navigate(['/login']);
  }

}
