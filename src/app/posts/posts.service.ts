import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // a subject is a kind of observable - an observable emits packets of data
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  // Arrays are refrence types - prevents people from being able to edit this array
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // this acts like an event emitter. It emits an array of Posts

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts() {
    this.httpClient.get<{ message: string, posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });

    // to make an actual/true copy of the posts array do this:-
    //return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    // the following returns a clone of the object
    // return {...this.posts.find(p => p.id === postId)};

    return this.httpClient.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/post' + postId);
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient
      .post<{message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);   //next is the equivalent of 'emit'
        // when finished navigate back to the home page i.e. list of posts page
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        // clone the post array
        const updatedPosts = [...this.posts];
        // the next line returns an index number if the post with the id looking for is found
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        // let the app know that post array has updated
        this.postsUpdated.next([...this.posts]);

        // when finished navigate back to the home page i.e. list of posts page
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
