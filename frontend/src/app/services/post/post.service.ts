import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IPost } from '../../shared/model/post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllPublishedPosts(): Observable<{
    status: boolean;
    message: string;
    posts: IPost[];
  }> {
    return this.http.get<{ status: boolean; message: string; posts: IPost[] }>(
      `/posts`
    );
  }

  getPostById(postId: number): Observable<{
    status: boolean;
    message: string;
    post: IPost;
  }> {
    return this.http.get<{ status: boolean; message: string; post: IPost }>(
      `/posts/${postId}`
    );
  }

  getMyPosts(): Observable<{
    status: boolean;
    message: string;
    posts: IPost[];
  } | null> {
    const token = this.authService.getToken();

    if (!token) {
      return of({
        status: false,
        message: 'No token found',
        posts: [],
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ status: boolean; message: string; posts: IPost[] }>(
      `/posts/mine`,
      { headers }
    );
  }

  createPost(post: IPost): Observable<{
    status: boolean;
    message: string;
    post: IPost;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<{ status: boolean; message: string; post: IPost }>(
      `/posts`,
      post,
      { headers }
    );
  }

  updatePost(post: IPost): Observable<{
    status: boolean;
    message: string;
    post: IPost;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.patch<{ status: boolean; message: string; post: IPost }>(
      `/posts/${post.id}`,
      post,
      { headers }
    );
  }

  deletePost(postId: number): Observable<{
    status: boolean;
    message: string;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.delete<{ status: boolean; message: string }>(
      `/posts/${postId}`,
      { headers }
    );
  }
}
