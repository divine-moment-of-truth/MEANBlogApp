import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;

  // mode variable is used to work out if a new post needs to be craeted or if an existing post is being edited
  private mode = 'create';
  private postId: string;

  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this section works out if a new post is being created or if an existing post is being edited
    this.activatedRoute.paramMap.subscribe((paraMap: ParamMap) => {
      // postId is taken from the router module - app.routing.module.ts
      if(paraMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paraMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  // post?.title in the html - the ? chcks to see if there is a value for post, if there is not then it populates the
  // field with nothing. This prevents 'property of title indefined' errors

  // onAddPost(postInput: HTMLTextAreaElement) {
    onSavePost(form: NgForm) {
    // console.dir(postInput);
      if(form.invalid) {
        return;
      }

      this.isLoading = true;

      if(this.mode === 'create') {
        this.postsService.addPost(form.value.title, form.value.content);

      } else {
        this.postsService.updatePost(
          this.postId,
          form.value.title,
          form.value.content
        )
      }
      form.resetForm();
    }
}
