import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";

import { map, Subject } from "rxjs";

import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
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
      .post<{ message: string, postId: string }>(this.baseURL, postData)
      .subscribe((responseData) => {
        const post: Post = {
          content: content,
          id: responseData.postId,
          title: title
        }

        this.posts.push(post);
        this.afterPost()
      }
    );
  }

  afterPost() {
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>(`${this.baseURL}/${postId}`)
        .subscribe(() => {
          const updatedPosts = this.posts.filter(post => post.id !== postId);

          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        });
  }

  getPost(id: string) {
    return this.http
      .get<{ content: string, _id: string, title: string }>(`${this.baseURL}/${id}`);
  }

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>(this.baseURL)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            content: post.content,
            id: post._id,
            title: post.title
          }
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(content: string, id: string, title: string) {
    const post: Post = {
      content: content,
      id: id,
      title: title
    };

    this.http
      .put(`${this.baseURL}/${id}`, post)
      .subscribe(response => {
        console.log(response);

        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);

        updatedPosts[oldPostIndex] = post;

        this.posts = updatedPosts;
        this.afterPost();
      });
  }
}
