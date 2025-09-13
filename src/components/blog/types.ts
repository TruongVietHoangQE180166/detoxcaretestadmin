import type { User } from "../user/types";

export type Blog = {
  id: string;
  title: string;
  slug_name: string;
  image: string;
  content: string;
  emojis: number;
  view: number;
  category: Category;
  user: User;
  created_date: string;
};

export type Category = {
  id: string;
  name: string;
  is_active: boolean;
  created_date: string;
};
