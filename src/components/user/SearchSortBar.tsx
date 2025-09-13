import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props {
  search: string;
  setSearch: (val: string) => void;
  sortKey: "created_date" | "username" | "is_deleted";
  setSortKey: (val: "created_date" | "username" | "is_deleted") => void;
}

const SearchSortBar = ({ search, setSearch, sortKey, setSortKey }: Props) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" />
        <input
          type="text"
          placeholder="Tìm kiếm username/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as any)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="created_date">Sắp xếp theo ngày tạo</option>
        <option value="username">Sắp xếp theo Username</option>
        <option value="is_deleted">Sắp xếp theo Trạng thái xóa</option>
      </select>
    </div>
  );
};

export default SearchSortBar;
