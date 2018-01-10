// loggerのmock
let logger = {
  trace: (l) => l,
  debug: (l) => l,
  info: (l) => l,
  warn: (l) => l,
  error: (l) => l,
  fatal: (l) => l
}

module.exports = {
  logger: logger
}