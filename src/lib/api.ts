const api = (url: string, options?: RequestInit) => {
  return fetch(process.env.API_URL + url, options);
};

export { api };
