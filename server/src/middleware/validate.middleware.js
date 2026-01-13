const validate = (schema) => (req, res, next) => {
  try {
    console.log(req.body)
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    console.error('Validation error:', JSON.stringify(err.errors, null, 2));
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors,
    });
  }
};

module.exports = validate;