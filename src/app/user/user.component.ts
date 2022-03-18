import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  constructor(private userSrv:UserService) {
    this.getAllUsers()
  }
  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.user = userData;
  }
  user!: any;
  isLoading = false;
  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'rolesStr',
  ];
  dataSource!: MatTableDataSource<User>;
  tableLenght: number = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  pageEvent!: PageEvent;

  @ViewChild(MatInput) input!:MatInput;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  getAllUsers() {
    this.isLoading = true;
    this.userSrv.getAllUsers().subscribe((res) => {
      for(let item of res){
        let roleName:string|undefined='';
        for(let role of item.roles){
          roleName=roleName.concat(', ',role.roleName)
        }
        item.rolesStr=roleName.slice(1)
      }
      console.log(res[0].roles);
      this.dataSource = new MatTableDataSource(res);
      this.tableLenght = res.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }
  applyFilter(text: string) {
    this.dataSource.filter = text.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
