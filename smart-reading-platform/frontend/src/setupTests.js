global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));
