import 'isomorphic-fetch';

export const request = {
  fetch: window.fetch.bind(window),
};

export const handleResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(`${response.statusText}`);
  }
  return response.json();
};
