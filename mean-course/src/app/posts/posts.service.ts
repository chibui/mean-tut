import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { map, Subject } from "rxjs";

import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private baseURL = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  addPost(post: Post) {
    this.http
      .post<{message: string, postId: string}>(this.baseURL, post)
      .subscribe((responseData) => {
        console.log(responseData.message);

        post.id = responseData.postId;

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      }
    );
  }

  deletePost(postId: string) {
    this.http
      .delete<{message: string}>(`${this.baseURL}/${postId}`)
        .subscribe(() => {
          const updatedPosts = this.posts.filter(post => post.id !== postId);

          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        });
  }

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(this.baseURL)
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


}
