import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredContent = '';
  enteredTitle = '';
  postForm: FormGroup;
  isLoading: boolean = false;
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(
    public route: ActivatedRoute,
    public postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'content': new FormControl(null, {
        validators: [
          Validators.required, Validators.minLength(3)
        ]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required]
      }),
      'title': new FormControl(null, {
        validators: [ Validators.required ]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;

            this.post = {
              content: postData.content,
              id: postData._id,
              title: postData.title,
            };

            this.postForm.setValue({
              'content': this.post.content,
              'title': this.post.title
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.postForm);
  }

  onSavePost() {
    if (this.postForm.invalid) { return };
    this.isLoading = true;

    this.mode === 'create'
      ? this.postsService.addPost(this.postForm.value.content, this.postForm.value.title)
      : this.postsService.updatePost(this.postForm.value.content, this.postId, this.postForm.value.title);

    this.postForm.reset();
  }
}
