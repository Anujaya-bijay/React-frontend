import { FormInput, Button } from "./index";

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar = ({
  search,
  setSearch,
  clearSearch,
  filter,
  onFilterChange,
}: FilterBarProps) => {
  return (
    <div id="filter-bar">
      <FormInput
        label="Search"
        id="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
      />

      <Button
        variant={filter === "all" ? "primary" : "secondary"}
        dataActive={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>

      <Button
        variant={filter === "active" ? "primary" : "secondary"}
        dataActive={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>

      <Button
        variant={filter === "completed" ? "primary" : "secondary"}
        dataActive={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>

      <Button
        variant="secondary"
        onClick={clearSearch}
      >
        Clear Search
      </Button>
    </div>
  );
};

export default FilterBar;