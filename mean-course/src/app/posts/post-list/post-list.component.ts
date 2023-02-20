import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10];
  posts: Post[] = [];
  postsPerPage: number = 2;
  totalPosts: number = 0;
  userIsAuthenticated: boolean = false;

  private authStatusSub: Subscription;
  private postsSub: Subscription;

  constructor(
    private authService: AuthService,
    public postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(1, this.postsPerPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.currentPage, this.postsPerPage);

  }
  onDeletePost(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.currentPage, this.postsPerPage);
    });
  }
}
