const express = require("express");
const urlRoute = require("./routes/urlRoute");
const { connectToMongoDB } = require("./connect");
const path = require("path");
const URL = require("./models/url");
const staticRoute=require("./routes/staticRouter");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/shortUrl").then(() =>
  console.log("Connected to database")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use((req, res, next) => {
  console.log("Received Request Body:", req.body);
  next();
});

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

app.use("/url", urlRoute);
app.use("/",staticRoute)

app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    console.log(shortId);

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true } // Return the modified document, not the original one
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error handling short URL:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
