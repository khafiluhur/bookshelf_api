const createResponse = (status, message = null, data = null) => {
  return {
    status: status,
    ...(message && { message }),
    ...(data && { data }),
  };
};

module.exports = createResponse;