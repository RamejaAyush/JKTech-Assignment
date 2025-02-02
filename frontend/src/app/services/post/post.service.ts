import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../../shared/model/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllPublishedPosts(): Observable<{
    status: boolean;
    message: string;
    posts: IPost[];
  }> {
    return this.http.get<{ status: boolean; message: string; posts: IPost[] }>(
      `${this.apiUrl}/posts`
    );
  }

  getPostById(postId: number): Observable<{
    status: boolean;
    message: string;
    post: IPost;
  }> {
    return this.http.get<{ status: boolean; message: string; post: IPost }>(
      `${this.apiUrl}/posts/${postId}`
    );
  }
}
