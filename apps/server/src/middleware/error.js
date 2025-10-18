export function errorHandler(err, req, res, _next) {
    // Zod errors get a consistent shape
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'validation failed', details: err.errors })
    }
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }