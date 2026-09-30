import { Priority, Status } from "@/types/task";

export interface Filters {
  search: string;
  status: Status | "all";
  priority: Priority | "all";
}

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
      <div>
        <label htmlFor="search" className="sr-only">Search tasks</label>
        <input
          id="search"
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by title, subject or description"
          className="field"
        />
      </div>
      <div>
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as Filters["status"] })}
          className="field sm:w-40"
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="priority-filter" className="sr-only">Filter by priority</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Filters["priority"] })}
          className="field sm:w-40"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
