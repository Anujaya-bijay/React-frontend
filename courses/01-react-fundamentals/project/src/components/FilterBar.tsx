import React, { useRef, useEffect } from "react";

interface FilterBarProps {
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  search?: string;
  setSearch?: (value: string) => void;
}

function FilterBar({
  filter,
  onFilterChange,
  search = "",
  setSearch,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div id="filter-bar">
      <input
        ref={searchInputRef}
        id="search-input"
        type="text"
        value={search}
        onChange={(e) => setSearch?.(e.target.value)}
      />
      <button
        data-active={filter === "all" ? "true" : "false"}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        data-active={filter === "active" ? "true" : "false"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>
      <button
        data-active={filter === "completed" ? "true" : "false"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
}

export default React.memo(FilterBar);