interface FilterBarProps {
  filter: "all" | "active" | "completed";

  onFilterChange: (
    filter: "all" | "active" | "completed"
  ) => void;

  searchTerm?: string;

  onSearchChange?: (
    value: string
  ) => void;

  sortOrder:
    | "recent"
    | "high-low"
    | "low-high"
    | "alphabetical";

  onSortChange: (
    sort:
      | "recent"
      | "high-low"
      | "low-high"
      | "alphabetical"
  ) => void;
}

export default function FilterBar({
  filter,
  onFilterChange,
  searchTerm = "",
  onSearchChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <input
        id="search-input"
        type="text"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={(e) =>
          onSearchChange?.(e.target.value)
        }
      />

      <button
        data-active={
          filter === "all"
            ? "true"
            : "false"
        }
        onClick={() =>
          onFilterChange("all")
        }
      >
        All
      </button>

      <button
        data-active={
          filter === "active"
            ? "true"
            : "false"
        }
        onClick={() =>
          onFilterChange("active")
        }
      >
        Active
      </button>

      <button
        data-active={
          filter === "completed"
            ? "true"
            : "false"
        }
        onClick={() =>
          onFilterChange("completed")
        }
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) =>
          onSortChange(
            e.target.value as
              | "recent"
              | "high-low"
              | "low-high"
              | "alphabetical"
          )
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="high-low">
          Priority: High to Low
        </option>

        <option value="low-high">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>
      </select>
    </div>
  );
}