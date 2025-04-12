import { type Dispatch, type SetStateAction, memo } from "react";

import styles from "./index.module.scss";

export interface SearchBarProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
  value: string;
}

const SearchBar = ({ setSearchValue, value }: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <input
        className="search"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        value={value}
      />
    </div>
  );
};

export default memo(SearchBar);
