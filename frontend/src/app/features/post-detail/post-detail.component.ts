// src/app/features/post-detail/post-detail.component.ts
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPost } from '../../shared/model/post.model';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: IPost | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.fetchPost(id);
    } else {
      this.errorMessage = 'Invalid post ID';
    }
  }

  fetchPost(id: number): void {
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (response: any) => {
        if (response.status && response.post) {
          this.post = response.post;
        } else {
          this.errorMessage = response.message || 'Failed to load post';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.errorMessage = 'An error occurred while fetching the post.';
        this.loading = false;
      },
    });
  }
}
