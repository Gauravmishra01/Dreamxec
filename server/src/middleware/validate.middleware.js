const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    // ZodError has an .issues array — map it to { field, message } pairs
    const errors = Array.isArray(err.issues)
      ? err.issues.map((issue) => ({
          field: issue.path.slice(1).join('.'), // Strip leading 'body.'
          message: issue.message,
        }))
      : [{ field: 'general', message: err.message || 'Validation failed' }];

    console.error('Validation error:', JSON.stringify(errors, null, 2));

    return res.status(400).json({
      status: 'error',
      message: errors.map((e) => e.message).join('; '),
      errors,
    });
  }
};

module.exports = validate;