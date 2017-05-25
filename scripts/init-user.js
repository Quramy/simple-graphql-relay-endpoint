const userMock = require('./dummy-data/user_mock.json');
userMock.forEach(user => console.log(JSON.stringify({ ...user, createdAt: new Date().toISOString() })));
