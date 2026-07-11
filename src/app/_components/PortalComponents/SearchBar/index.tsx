import type { Dispatch, SetStateAction } from "react";

import { portal } from "@/lib/portal-classes";

export interface SearchBarProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
  value: string;
  placeholder?: string;
}

const SearchBar = ({ placeholder, setSearchValue, value }: SearchBarProps) => {
  return (
    <div className={portal.searchBar}>
      <input
        className="search"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        value={value}
      />
    </div>
  );
};

export default SearchBar;
