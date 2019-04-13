"use strict";

require("dotenv").config();

// const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3001;

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("kcors");
const logger = require("./config/log");
const userAgent = require("koa-useragent");
const ratelimit = require("koa-ratelimit");
const redis = require("ioredis");
const serve = require("koa-static");

//Routes
const userActionsRouter = require("./routes/userActions");
const notesRouter = require("./routes/notes");

//Initialize app
const app = new Koa();

//Here's the rate limiter
app.use(
  ratelimit({
    db: new redis({ host: "redis" }),
    duration: 60000,
    errorMessage: "Sometimes You Just Have to Slow Down.",
    id: ctx => ctx.ip,
    headers: {
      remaining: "Rate-Limit-Remaining",
      reset: "Rate-Limit-Reset",
      total: "Rate-Limit-Total"
    },
    max: 100
  })
);

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
    logger.info(
      ctx.method + " " + ctx.url + " RESPONSE: " + ctx.response.status
    );
  } catch (error) {}
});

// Serve api document
app.use(serve("public/swagger"));

// Modify response structure
app.use(async (ctx, next) => {
  try {
    await next();
    ctx.body = { data: ctx.body };
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      error: {
        code: ctx.status,
        message: err.message
      }
    };
  }
});

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
  const t1 = Date.now();
  await next();
  const t2 = Date.now();
  ctx.set("X-Response-Time", Math.ceil(t2 - t1) + "ms");
});

//For cors with options
app.use(cors({ origin: "*" }));

//For useragent detection
app.use(userAgent);

//For managing body. We're only allowing json.
app.use(bodyParser({ enableTypes: ["json"] }));

//For router
app.use(userActionsRouter.routes());
app.use(userActionsRouter.allowedMethods());
app.use(notesRouter.routes());
app.use(notesRouter.allowedMethods());

//Here we're assigning the server to a variable because
//we're going to want to manually rip down the server in testing
const server = app.listen(port);
console.log("Server running at " + port);
console.log(
  "Running in " + process.env.NODE_ENV + " v" + process.env.npm_package_version
);

//Exporting the actual server here for testing availability
module.exports = { server: server };
