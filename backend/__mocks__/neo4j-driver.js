const neo4j = jest.createMockFromModule('neo4j-driver');

const runMock = jest.fn();
const closeMock = jest.fn();

const sessionMock = {
  run: runMock,
  close: closeMock,
};

const driverMock = {
  session: jest.fn(() => sessionMock),
};

neo4j.driver = jest.fn(() => driverMock);
neo4j.session = sessionMock;

module.exports = neo4j;
