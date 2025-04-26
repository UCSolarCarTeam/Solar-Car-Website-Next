import classNames from "classnames";

import Chevron from "@/app/_components/svgs/Chevron";
import { type Table } from "@tanstack/react-table";

import styles from "./index.module.scss";

interface TableProps<T> {
  table: Table<T>;
}

const cx = classNames.bind(styles);

function PaginationOptions<T>({ table }: TableProps<T>) {
  return (
    <>
      <div className={styles.pagination}>
        <div>
          <span>
            {Number.isNaN(table.getState().pagination.pageIndex)
              ? "00"
              : (table.getState().pagination.pageIndex + 1)
                  .toString()
                  .padStart(2, "0")}
          </span>
        </div>

        <div className={styles.arrowsContainer}>
          <span>of {table.getPageCount().toLocaleString()} pages</span>
          <div
            className={cx(
              !table.getCanPreviousPage() && styles.disabled,
              styles.chevron,
            )}
            onClick={() => table.getCanPreviousPage() && table.previousPage()}
          >
            <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
            <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
          </div>
          <div
            className={cx(
              !table.getCanPreviousPage() && styles.disabled,
              styles.chevron,
            )}
            onClick={() => table.getCanPreviousPage() && table.firstPage()}
          >
            <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
          </div>
          <div
            className={cx(
              !table.getCanNextPage() && styles.disabled,
              styles.chevron,
            )}
            onClick={() => table.getCanNextPage() && table.lastPage()}
          >
            <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
          </div>
          <div
            className={cx(
              !table.getCanNextPage() && styles.disabled,
              styles.chevron,
            )}
            onClick={() => table.getCanNextPage() && table.nextPage()}
          >
            <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
            <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PaginationOptions;
