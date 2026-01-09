exports.success = (res, message, data = null, code = 200) => {
  res.status(code).json({ success: true, message, data });
};

exports.error = (res, message, code = 500) => {
  res.status(code).json({ success: false, message });
};