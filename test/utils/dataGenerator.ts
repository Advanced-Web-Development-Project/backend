import { faker } from '@faker-js/faker';


// USER DATA GENERATORS
const generateValidUserData = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
  username: faker.internet.userName().replace(/[^a-zA-Z0-9_]/g, ''), // To fit validation schema regex
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



// POST DATA GENERATORS
const generateValidPostData = () => ({
	title: faker.lorem.sentence(),
	content: faker.lorem.paragraph(),
	image: faker.image.url(),
});


export default {
  generateValidUserData,
  generateInvalidEmailUserData,
  generateDuplicateEmailUserData,
	generateDuplicateUsernameUserData,
	generateValidPostData,
};
