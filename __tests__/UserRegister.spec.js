const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/User");
const sequelize = require("../src/config/database");
const nodemailerStub = require("nodemailer-stub");
const EmailService = require("../src/service/EmailService");

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

const validUser = {
  username: "user1",
  email: "user1@mail.com",
  password: "Pa55word",
};

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
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns username and E-mail cannot be null", async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: "P4ssword",
    });
    const body = response.body;
    /*
      validationErrors = {
        username: "...",
        email: "..."
      }
    */
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  it.each`
    field         | value             | expectedMessage
    ${"username"} | ${null}           | ${`Username cannot be null`}
    ${"username"} | ${"usr"}          | ${"Must have minimum 4 and maximum 32 characters"}
    ${"username"} | ${"a".repeat(33)} | ${"Must have minimum 4 and maximum 32 characters"}
    ${"email"}    | ${null}           | ${"E-mail cannot be null"}
    ${"email"}    | ${"mail.com"}     | ${"E-mail is not valid"}
    ${"email"}    | ${"usr@mail"}     | ${"E-mail is not valid"}
    ${"email"}    | ${"usr.mail.com"} | ${"E-mail is not valid"}
    ${"password"} | ${null}           | ${"Password cannot be null"}
    ${"password"} | ${"P4ssw"}        | ${"Password must have minimum 9 characters"}
    ${"password"} | ${"alllowercase"} | ${"Password must have atleast 1 uppercase, 1 lowercase letter and 1 number"}
  `(
    "returns $expectedMessage when $field is null",
    async ({ field, expectedMessage, value }) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    },
  );

  it("returns E-mail in use when same e-mail is in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    // console.log(response);
    expect(response.body.validationErrors.email).toBe("E-mail in use");
  });

  it("creates user in inactive mode", async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it("creates user in inactive mode, even if user sends a value inactive as false", async () => {
    const newUser = { ...validUser, inactive: false };
    await postUser(newUser);
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it("creates an activation token for user", async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.activationToken).toBeTruthy();
  });

  fit("sends an account activation email with activateToken", async () => {
    await postUser();
    const lastMail = nodemailerStub.interactsWithMail.lastMail();
    expect(lastMail.to[0]).toBe("user1@mail.com");
    const users = await User.findAll();
    const savedUser = users[0];
    expect(lastMail.content).toContain(savedUser.activationToken);
  });

  it("returns 502 Bad Gateway when sending email fails", async () => {
    const mockSendAccountActivation = jest
      .spyOn(EmailService, "sendAccountActivation")
      .mockRejectedValue({ message: "E-mail failure" });
    const response = await postUser();
    expect(response.status).toBe(502);
    mockSendAccountActivation.mockRestore();
  });

  it("returns Email failure message when sending email fails", async () => {
    const mockSendAccountActivation = jest
      .spyOn(EmailService, "sendAccountActivation")
      .mockRejectedValue({ message: "E-mail failure" });
    const response = await postUser();
    mockSendAccountActivation.mockRestore();
    expect(response.body.message).toBe("E-mail failure");
  });

  it("it doesn't save user to DB is activation fails", async () => {
    const mockSendAccountActivation = jest
      .spyOn(EmailService, "sendAccountActivation")
      .mockRejectedValue({ message: "E-mail failure" });
    await postUser();
    mockSendAccountActivation.mockRestore();
    const users = await User.findAll();
    expect(users.length).toBe(0);
  });
});
