const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/User");
const sequelize = require("../src/config/database");

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

const validUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'Pa55word'
}

const postUser = (user = validUser) => {
  return request(app).post("/api/1.0/users").send(user);
};

describe("User registration", () => {

  it("returns 201 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(201);
  });

  it("returns success message when signup request is valid", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("User Created");
  });

  it("user persisted in DB", async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("check DB and match if the user is added with value checking", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@mail.com");
  });

  it("check hashing for the password is enabled or not", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("Pa55word");
  });

  it("returns 400 when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "P4ssword",
    });
    expect(response.status).toBe(400);
  });

  it("returns validationErrors field in reponse body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "P4ssword",
    });
    const body = response.body;
    console.log(body);
    expect(body.validationErrors).not.toBeUndefined();
  });
});
