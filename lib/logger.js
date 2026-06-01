// Structured logging compatible with Google Cloud Logging.
// Cloud Run automatically ingests anything written to stdout/stderr.
// When a line is valid JSON, Cloud Logging parses it into a structured
// entry and maps the `severity` field to the proper log level — so these
// logs are searchable/filterable in Logs Explorer and can power alerts.
const LEVEL_TO_SEVERITY = {
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
};

export function log(level, message, extra = {}) {
  const entry = {
    severity: LEVEL_TO_SEVERITY[level] || "DEFAULT",
    message,
    time: new Date().toISOString(),
    ...extra,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}
