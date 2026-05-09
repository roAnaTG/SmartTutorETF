const axios = require('axios');

const test = async () => {
  try {
    // We need a token, but let's see if we can at least reach the endpoint
    const response = await axios.post('http://localhost:5000/api/lessons', {
      title: 'Test Lesson',
      subject: 'Mathematics',
      description: 'Test Description',
      duration: 60,
      week: 1
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
  }
};

test();
