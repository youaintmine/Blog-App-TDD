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

describe("User registration", () => {
  it("returns 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Pa55word",
      })
      .then((response) => {
        expect(response.status).toBe(201);
        done();
      });
  });

  it("returns success message when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Pa55word",
      })
      .then((response) => {
        expect(response.body.message).toBe("User Created");
        done();
      });
  });

  it("user persisted in DB", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Pa55word",
      })
      .then(() => {
        //Query user table
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  it("check DB and match if the user is added with value checking", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Pa55word",
      })
      .then(() => {
        //Query user table
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe("user1");
          expect(savedUser.email).toBe("user1@mail.com");
          done();
        });
      });
  });

  it("check hashing for the password is enabled or not", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Pa55word",
      })
      .then(() => {
        //Query user table
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.password).not.toBe("Pa55word");
          done();
        });
      });
  });
});
