exports.sendResponse = (res, statusCode, success, message, data = null) => {
    if (res.headersSent) return;
    res.status(statusCode).json({
        status: success,
        message,
        ...(data !== null && { data })
    });
};