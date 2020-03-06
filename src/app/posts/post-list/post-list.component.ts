import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

/*   posts = [
    { title: 'First Post', content: 'This is the first post\'s content'},
    { title: 'Second Post', content: 'This is the second post\'s content'},
    { title: 'Third Post', content: 'This is the third post\'s content'}
  ]; */

  listPosts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((post: Post[]) => {
        this.listPosts = post;
        this.isLoading = false;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId)

  }

  // this prevents memory leaks
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
