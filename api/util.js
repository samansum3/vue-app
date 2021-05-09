const sendSuccess = (response, data) => {
    response.status(200).json({success: true, result: data});
}

const sendError = (response, error) => {
    console.error(error);
    response.status(500).json({success: false});
}

module.exports = {
    sendSuccess,
    sendError
}