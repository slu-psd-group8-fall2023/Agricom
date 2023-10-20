import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from './dataservice.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  users: any[] = [];
  isLoading = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadInitialUserData();
  }

  loadInitialUserData() {
    this.isLoading = true;
    this.dataService.getData().subscribe((data:any) => {
      this.users = data;
      this.isLoading = false;
    });
  }

  loadMoreUserData() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.dataService.getMoreData().subscribe((data:any) => {
        this.users = this.users.concat(data);
        this.isLoading = false;
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.isLoading
    ) {
      this.loadMoreUserData();
    }
  }
}
