import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IPost } from '../../shared/model/post.model';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  post: Partial<IPost> = { title: '', content: '', published: false };
  loading = false;
  errorMessage = '';

  constructor(private postService: PostService, private router: Router) {}

  createPost(): void {
    if (!this.post.title || !this.post.content) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.postService.createPost(this.post as IPost).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Failed to create post';
        }
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.errorMessage = 'An error occurred while creating the post.';
        this.loading = false;
      },
    });
  }
}
