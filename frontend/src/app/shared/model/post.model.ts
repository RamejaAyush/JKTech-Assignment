export interface IAuthor {
  id: number;
  email: string;
  name: string;
  photo: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: IAuthor;
}
