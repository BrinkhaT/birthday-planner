// Manual mock for fs/promises (JavaScript file for better Jest compatibility)
// This file is automatically used by Jest when jest.mock('fs/promises') is called

module.exports = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  rename: jest.fn(),
  mkdir: jest.fn(),
};
