import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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
  totalPosts: number = 10;
  private postsSub: Subscription

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(1, this.postsPerPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    console.log('pageData', pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.currentPage, this.postsPerPage);

  }
  onDeletePost(postId: string): void {
    this.postsService.deletePost(postId);
  }
}
