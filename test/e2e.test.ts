import request from "supertest";

const app = request("http://localhost:8080");

describe("REST survey e2e tests", () => {
  afterEach(async () => {
    // Delete everything and start fresh
    await app.delete("/").expect(200);
  });

  describe("/health", () => {
    it("should return 200 and OK", async () => {
      await app.get("/health").expect(200, "OK");
    });
  });

  describe("/foos", () => {
    describe("POST", () => {
      it("should return 201 and the created foo", async () => {
        await app
          .post("/foos")
          .send({
            name: "foo",
            description: "foo description",
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({
              name: "foo",
              description: "foo description",
              bars: [],
            });
          });
      });

      it("should set optional fields to some sane default", async () => {
        await app.post("/foos").send({ name: "foo" }).expect(201).expect({
          name: "foo",
          description: "",
          bars: [],
        });
      });

      it("should return 400 and an error message when the name is missing", async () => {
        await app
          .post("/foos")
          .send({})
          .expect(400)
          .expect((res) => {
            expect(res.body).toEqual({
              message: "name is a required field",
            });
          });
      });
    });

    describe("GET", () => {
      // TODO: we might want this to be paginated
      it("should return 200 and all the foos", async () => {
        await app.post("/foos").send({
          name: "foo",
          description: "foo description",
        });
        await app
          .get("/foos")
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([
              {
                name: "foo",
                description: "foo description",
                bars: [],
              },
            ]);
          });
      });

      it("should return 200 and an empty array when there are no foos", async () => {
        await app
          .get("/foos")
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([]);
          });
      });
    });

    describe("/foos/:fooId", () => {
      describe("GET", () => {
        it("should return 200 and the foo", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .get("/foos/foo")
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                name: "foo",
                bars: [],
              });
            });
        });

        it("should return 404 and an error message when the foo does not exist", async () => {
          await app
            .get("/foos/bar")
            .expect(404)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "foo 'bar' not found",
              });
            });
        });
      });

      describe("PUT", () => {
        it("should return 200 and the updated foo", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .put("/foos/foo")
            .send({ name: "bar" })
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                name: "bar",
                bars: [],
              });
            });
        });

        it("should return 400 and an error message if you try to change the name", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .put("/foos/foo")
            .send({ name: "baz" })
            .expect(400)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "name cannot be changed",
              });
            });
        });

        it("should return 404 and an error message when the foo does not exist", async () => {
          await app
            .put("/foos/bar")
            .send({ name: "bar" })
            .expect(404)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "foo bar not found",
              });
            });
        });
      });

      describe("DELETE", () => {
        it("should return 200 and the deleted foo", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .delete("/foos/foo")
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                name: "foo",
                description: "",
                bars: [],
              });
            });
        });

        it("should return 404 and an error message when the foo does not exist", async () => {
          await app
            .delete("/foos/bar")
            .expect(404)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "foo bar not found",
              });
            });
        });
      });
    });

    describe("/foos/:fooId/bar", () => {
      describe("POST", () => {
        it("should return 201 and the created bar", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
              description: "bar description",
            })
            .expect(201)
            .expect((res) => {
              expect(res.body).toEqual({
                id: "id",
                category: "bar category",
                description: "bar description",
                baz: null,
              });
            });
        });

        it("should set optional fields to some sane default", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
            })
            .expect(201)
            .expect((res) => {
              expect(res.body).toEqual({
                id: "id",
                category: "bar category",
                description: "",
                baz: null,
              });
            });
        });

        it("should allow different shapes for baz", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
              description: "bar description",
              baz: {
                stringBaz: "bar",
              },
            })
            .expect(201)
            .expect((res) => {
              expect(res.body).toEqual({
                id: "id",
                category: "bar category",
                description: "bar description",
                baz: {
                  stringBaz: "bar",
                },
              });
            });
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category2",
              description: "bar description",
              baz: {
                numberBaz: 1,
              },
            })
            .expect(201)
            .expect((res) => {
              expect(res.body).toEqual({
                id: "id",
                category: "bar category2",
                description: "bar description",
                baz: {
                  numberBaz: 1,
                },
              });
            });
        });

        it("should return 400 and an error message when id or category are missing", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({ id: "id" })
            .expect(400)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "category is a required field",
              });
            });
          await app
            .post("/foos/foo/bar")
            .send({ category: "bar category" })
            .expect(400)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "id is a required field",
              });
            });
        });

        it("should require that it be a unique combination of id and category", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
              description: "bar description",
            })
            .expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
              description: "bar description",
            })
            .expect(400)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "id and category must be unique",
              });
            });
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category 2",
              description: "bar description",
            })
            .expect(201)
            .expect({
              id: "id",
              category: "bar category 2",
              description: "bar description",
            });
        });

        it("should return 404 and an error message when the foo does not exist", async () => {
          await app
            .post("/foos/bar/bar")
            .send({ name: "bar" })
            .expect(404)
            .expect((res) => {
              expect(res.body).toEqual({
                message: "foo bar not found",
              });
            });
        });
      });

      describe("GET", () => {
        it("should return 200 and all the bars that the foo owns", async () => {
          await app.post("/foos").send({ name: "foo" }).expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id",
              category: "bar category",
              description: "bar description",
            })
            .expect(201);
          await app
            .post("/foos/foo/bar")
            .send({
              id: "id2",
              category: "bar category 2",
              description: "bar description 2",
            })
            .expect(201);
          await app
            .get("/foos/foo/bar")
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual([
                {
                  id: "id",
                  category: "bar category",
                  description: "bar description",
                  baz: null,
                },
                {
                  id: "id2",
                  category: "bar category 2",
                  description: "bar description 2",
                  baz: null,
                },
              ]);
            });
        });
      });

      describe("/foos/:fooId/bar/:barId", () => {
        describe("GET", () => {
          it("should return 200 and the bar", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({
                id: "id",
                category: "bar category",
                description: "bar description",
              })
              .expect(201);
            await app
              .get("/foos/foo/bar/id")
              .expect(200)
              .expect((res) => {
                expect(res.body).toEqual({
                  id: "id",
                  category: "bar category",
                  description: "bar description",
                  baz: null,
                });
              });
          });

          it("should return 404 and an error message when the bar does not exist", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .get("/foos/foo/bar/id")
              .expect(404)
              .expect((res) => {
                expect(res.body).toEqual({
                  message: "bar id not found",
                });
              });
          });

          it("should return 404 and an error message when the foo does not exist", async () => {
            await app
              .get("/foos/bar/bar/id")
              .expect(404)
              .expect((res) => {
                expect(res.body).toEqual({
                  message: "foo bar not found",
                });
              });
          });
        });

        describe("PATCH", () => {
          it("should return 200 and update the bar", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({
                id: "id",
                category: "bar category",
                description: "bar description",
              })
              .expect(201);
            await app
              .patch("/foos/foo/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(200)
              .expect((res) => {
                expect(res.body).toEqual({
                  id: "id",
                  category: "bar category 2",
                  description: "bar description 2",
                  baz: null,
                });
              });
          });

          it("should return 404 and an error message when the bar does not exist", async () => {
            await app
              .patch("/foos/foo/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(404)
              .expect({
                message: "bar id not found",
              });
          });

          it("should return 404 and an error message when the foo does not exist", async () => {
            await app
              .patch("/foos/bar/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(404)
              .expect({
                message: "foo bar not found",
              });
          });

          it("should return 400 and an error message when the body has unrecognized fields", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({ id: "id", category: "cat" })
              .expect(201);
            await app
              .patch("/foos/foo/bar/id")
              .send({
                invalidField: "invalid",
              })
              .expect(400)
              .expect((res) => {
                expect(res.body).toEqual({
                  message: "unrecognized fields: invalidField",
                });
              });
          });
        });

        describe("PUT", () => {
          it("should return 200 and update the bar", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({
                id: "id",
                category: "bar category",
                description: "bar description",
              })
              .expect(201);
            await app
              .put("/foos/foo/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(200)
              .expect((res) => {
                expect(res.body).toEqual({
                  id: "id",
                  category: "bar category 2",
                  description: "bar description 2",
                  baz: null,
                });
              });
          });

          it("should return 400 and an error message if not all fields are present", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({ id: "id", category: "cat" })
              .expect(201);
            await app.put("/foos/foo/bar/id").send({}).expect(400).expect({
              message: "category, description, and baz are required",
            });
          });

          it("should return 404 and an error message when the bar does not exist", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .put("/foos/foo/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(404)
              .expect({
                message: "bar id not found",
              });
          });

          it("should return 404 and an error message when the foo does not exist", async () => {
            await app
              .put("/foos/bar/bar/id")
              .send({
                category: "bar category 2",
                description: "bar description 2",
              })
              .expect(404)
              .expect({
                message: "foo bar not found",
              });
          });

          it("should return 400 and an error message when the body has unrecognized fields", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({ id: "id", category: "cat" })
              .expect(201);
            await app
              .put("/foos/foo/bar/id")
              .send({
                invalidField: "invalid",
              })
              .expect(400)
              .expect((res) => {
                expect(res.body).toEqual({
                  message: "unrecognized fields: invalidField",
                });
              });
          });
        });

        describe("DELETE", () => {
          it("should return 200 and delete the bar", async () => {
            await app.post("/foos").send({ name: "foo" }).expect(201);
            await app
              .post("/foos/foo/bar")
              .send({
                id: "id",
                category: "bar category",
                description: "bar description",
              })
              .expect(201);
            await app
              .delete("/foos/foo/bar/id")
              .expect(200)
              .expect((res) => {
                expect({
                  id: "id",
                  category: "bar category",
                  description: "bar description",
                  baz: null,
                });
              });
          });

          it("should return 404 and an error message when the bar does not exist", async () => {
            await app.delete("/foos/foo/bar/id").expect(404).expect({
              message: "bar id not found",
            });
          });

          it("should return 404 and an error message when the foo does not exist", async () => {
            await app.delete("/foos/bar/bar/id").expect(404).expect({
              message: "foo bar not found",
            });
          });
        });
      });
    });
  });
});
