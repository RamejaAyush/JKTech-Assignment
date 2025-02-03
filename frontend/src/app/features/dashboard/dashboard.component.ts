import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { IPost } from '../../shared/model/post.model';
import { PostService } from '../../services/post/post.service';

interface PostResponse {
  status: boolean;
  message?: string;
  data?: IPost[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  errorMessage = '';
  myPosts: IPost[] = [];
  private destroy$ = new Subject<void>();

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMyPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchMyPosts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.postService
      .getMyPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (
          response: {
            status: boolean;
            message?: string;
            data?: IPost[];
          } | null
        ) => {
          this.loading = false;
          if (response?.status && response.data) {
            this.myPosts = response.data;
          } else {
            this.errorMessage =
              response?.message || 'Failed to load your posts';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'An error occurred while fetching your posts.';
          console.error('Error fetching posts:', error);
        },
      });
  }

  // New method: Navigate to Post Detail page when a post is clicked.
  viewPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  deletePost(postId: number): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.postService
      .deletePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PostResponse) => {
          if (response.status) {
            this.myPosts = this.myPosts.filter((post) => post.id !== postId);
          } else {
            this.errorMessage = response.message || 'Failed to delete the post';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while deleting the post.';
          console.error('Error deleting post:', error);
        },
      });
  }

  trackByPostId(index: number, post: IPost): number {
    return post.id;
  }
}
