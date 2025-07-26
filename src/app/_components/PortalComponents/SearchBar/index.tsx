import { type Dispatch, type SetStateAction, memo } from "react";

import styles from "./index.module.scss";

export interface SearchBarProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
  value: string;
  placeholder?: string;
}

const SearchBar = ({ placeholder, setSearchValue, value }: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <input
        className="search"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder ? placeholder : "Search..."}
        value={value}
      />
    </div>
  );
};

export default memo(SearchBar);
