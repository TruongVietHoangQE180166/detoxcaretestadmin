export interface Query {
  page?: number;
  size?: number;
  field?: string;
  direction?: "asc" | "desc";
  searchText?: string;
}