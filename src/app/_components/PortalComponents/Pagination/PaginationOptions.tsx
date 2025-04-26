import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Chevron from "@/app/_components/svgs/Chevron";
import { type Table } from "@tanstack/react-table";

import styles from "./index.module.scss";

interface TableProps<T> {
  table: Table<T>;
}

const cx = classNames.bind(styles);

function PaginationOptions<T>({ table }: TableProps<T>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const updateDropdownPosition = useCallback(() => {
    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        left: rect.left,
        top: rect.bottom,
        width: rect.width,
      });
    }
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  // Update position when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
    }
  }, [isDropdownOpen, updateDropdownPosition]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isDropdownOpen) {
        updateDropdownPosition();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isDropdownOpen, updateDropdownPosition]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownTriggerRef.current &&
        !dropdownTriggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          <div
            className={styles.pageSizeDropdown}
            onClick={toggleDropdown}
            ref={dropdownTriggerRef}
            style={{
              borderRadius: isDropdownOpen
                ? "3px 0px 0px 0px"
                : "3px 0px 0px 3px",
            }}
          >
            <span>
              {Number.isNaN(table.getState().pagination.pageIndex)
                ? "00"
                : (table.getState().pagination.pageIndex + 1)
                    .toString()
                    .padStart(2, "0")}
            </span>
            <Chevron
              fill="#6c6a7a"
              height={10}
              rotation={isDropdownOpen ? "up" : "down"}
              width={10}
            />
          </div>
          <div className={styles.arrowsContainer}>
            <span>of {table.getPageCount().toLocaleString()} pages</span>
            <div
              className={cx(
                !table.getCanPreviousPage() && styles.disabled,
                styles.chevron,
              )}
              onClick={() => table.getCanPreviousPage() && table.firstPage()}
            >
              <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
              <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
            </div>
            <div
              className={cx(
                !table.getCanPreviousPage() && styles.disabled,
                styles.chevron,
              )}
              onClick={() => table.getCanPreviousPage() && table.previousPage()}
            >
              <Chevron fill="#6c6a7a" height={10} rotation="left" width={10} />
            </div>
            <div
              className={cx(
                !table.getCanNextPage() && styles.disabled,
                styles.chevron,
              )}
              onClick={() => table.getCanNextPage() && table.nextPage()}
            >
              <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
            </div>
            <div
              className={cx(
                !table.getCanNextPage() && styles.disabled,
                styles.chevron,
              )}
              onClick={() => table.getCanNextPage() && table.lastPage()}
            >
              <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
              <Chevron fill="#6c6a7a" height={10} rotation="right" width={10} />
            </div>
          </div>
        </div>
        <div className={styles.itemCount}>
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} items
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className={styles.pageDropdownMenu}
          ref={dropdownRef}
          style={{
            left: `${dropdownPosition.left}px`,
            position: "fixed",
            top: `${dropdownPosition.top}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <div
              className={cx(
                styles.pageOption,
                currentPage === i + 1 && styles.activePage,
              )}
              key={i}
              onClick={() => {
                table.setPageIndex(i);
                setIsDropdownOpen(false);
              }}
            >
              <span>{(i + 1).toString().padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PaginationOptions;
