export function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);

  if (Object.keys(req.query).length > 0) {
    console.log('  Query:', req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log('  Body:', req.body);
  }

  next(); 
}
