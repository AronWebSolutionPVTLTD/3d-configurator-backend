const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");   
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');

const {connectDB} = require("./config/db");
const allRouter = require("./routes/index");
const responseTime = require('response-time');


dotenv.config();
const app = express();


// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(responseTime());

morgan.token("response-time-ms", function (req, res) {
  return res.getHeader("X-Response-Time") || "0ms";
});
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms - req-body: :req-body')
);




app.use(cors({
  origin: ['http://localhost:3000',],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Response-Time","Content-Disposition", "Content-Length", "X-Custom-Header"],
}));
//db connection
connectDB();

app.use("/api/v1", allRouter);


app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from 3D server!" });
});

// app.all("*", (req, res, next) => {
//   const err = new Error(`Route ${req.originalUrl} not found`);
//   err.statusCode = 404;
//   next(err);
// });


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
