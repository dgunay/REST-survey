import request from "supertest";

const app = request("http://localhost:8080");

describe("REST survey e2e tests", () => {
  describe("/health", () => {
    it("should return 200 and OK", async () => {
      await app.get("/health").expect(200, "OK");
    });
  });
});
