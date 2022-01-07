export default {
  sample: async () => {
    try {
      const url = 'http://localhost:3333';
      const response = await fetch(url);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return {
        code: 500,
        message: error,
      };
    }
  },
};
