import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";

import { map, Subject } from "rxjs";

import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private baseURL = 'http://localhost:3000/api/posts';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  addPost(content: string, image: File, title: string) {
    const postData = new FormData();

    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('title', title);

    this.http
      .post<{ message: string, post: Post }>(this.baseURL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(`${this.baseURL}/${postId}`);
  }

  getPost(id: string) {
    return this.http
      .get<{
        content: string,
        creator: string,
        _id: string,
        imagePath: string,
        title: string }>
      (`${this.baseURL}/${id}`);
  }

  getPosts(currentPage: number = 1, postsPerPage: number = 1) {
    const url = `${this.baseURL}?pageSize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ maxPosts: number, message: string, posts: any }>(url)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            content: post.content,
            creator: post.creator,
            id: post._id,
            imagePath: post.imagePath,
            title: post.title
          }
        }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe({
        next: (transformedPosts) => {
          this.posts = transformedPosts.posts;
          this.postsUpdated.next({
            posts:[...this.posts],
            postCount: transformedPosts.maxPosts
          });
        },
        error: (error) => console.log('error', error)
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(content: string, id: string, image: File | string, title: string) {
    let postData: FormData | Post;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('content', content);
      postData.append('id', id);
      postData.append('image', image, title);
      postData.append('title', title);
    } else {
      postData = {
        content: content,
        creator: null,
        id: id,
        imagePath: image as string,
        title: title
      };
    }

    this.http
      .put(`${this.baseURL}/${id}`, postData)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => console.log('error', error)
      });
  }
}
