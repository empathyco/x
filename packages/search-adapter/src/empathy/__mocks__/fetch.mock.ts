window.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({})
})) as any;
