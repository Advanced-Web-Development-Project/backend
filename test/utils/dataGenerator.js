const { faker } = require('@faker-js/faker');

const generateValidUserData = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
  username: faker.internet.displayName().replace(/[^a-zA-Z0-9_]/g, ''), // To fit validation schema regex
  name: faker.person.fullName(),
});

const generateInvalidEmailUserData = () => ({
  ...generateValidUserData(),
  email: 'invalidEmail',
});

const generateDuplicateEmailUserData = (existingUser) => ({
  ...generateValidUserData(),
  email: existingUser.email,
});

const generateDuplicateUsernameUserData = (existingUser) => ({
	...generateValidUserData(),
	username: existingUser.username,
});

// Add more generators as needed for specific test cases

module.exports = {
  generateValidUserData,
  generateInvalidEmailUserData,
  generateDuplicateEmailUserData,
	generateDuplicateUsernameUserData,
};
