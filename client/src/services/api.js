const API_URL = "http://localhost:5000/api/predict";

// Send prediction form data
export const sendPredictionData = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
// In the code above, we define a function sendPredictionData that sends the prediction form data to the server. We make a POST request to the /api/predict endpoint with the form data and return the response data. If there is an error, we return the error response data.