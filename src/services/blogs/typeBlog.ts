export interface IBlog { 
    title: string;
    content: string;
    image: string;
    view: boolean;
    userId: string;
    categoryId: string;
}
export interface IBlogCategory { 
    name: string;
    isActive: boolean;
}