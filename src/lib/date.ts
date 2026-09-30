// Parse "YYYY-MM-DD" as a local date so it never shifts by a day.
function parse(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

export function formatDate(dateString: string) {
  return parse(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isOverdue(dateString: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parse(dateString) < today;
}
