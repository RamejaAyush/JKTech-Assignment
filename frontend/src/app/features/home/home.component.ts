import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IPost } from '../../shared/model/post.model';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  loading = false;
  errorMessage = '';
  posts: IPost[] = [];

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;
    this.postService.getAllPublishedPosts().subscribe({
      next: (response) => {
        if (response.status) {
          this.posts = response.posts;
        } else {
          this.errorMessage = response.message || 'Failed to load posts';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.errorMessage = 'An error occurred while fetching posts.';
        this.loading = false;
      },
    });
  }

  viewPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }
}
