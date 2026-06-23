import React from "react";

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
  return (
    <div id="filter-bar">
      <input
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