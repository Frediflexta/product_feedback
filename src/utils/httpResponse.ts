export const httpResponse = (
  res,
  statusCode: number,
  success: boolean,
  message: string,
  data?
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};
