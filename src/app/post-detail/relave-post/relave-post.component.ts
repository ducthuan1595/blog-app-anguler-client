import { Component, Input, OnInit } from '@angular/core';
import { ResponsePostType } from '../../models/post.model';

@Component({
  selector: 'app-relave-post',
  templateUrl: './relave-post.component.html',
  styleUrl: './relave-post.component.css'
})
export class RelavePostComponent implements OnInit {
  @Input('post') post!: ResponsePostType;
 
  ngOnInit(): void {
    
  }
  
  formatDate(d: Date) {    
    console.log(d);
    
    
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}-${month + 1}-${year}`;
  }
}
