const express = require("express");
const bodyParser = require("body-parser");
const { Anime } = require("legacy-gogo-scraper");
const cors = require("cors");

// const home = require("./routes/home");

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.get("/new-release", async (req, res) => {
    try {
        const results = await Anime.fromHomePage();
        return res.status(200).send(results);
    } catch (error) {
        return res.status(400).json({ status: 400, error: "Bad Request" });
    }
});

app.get("/anime/:slug/episode/:episodeNumber", async (req, res) => {
    const { slug, episodeNumber } = req.params;

    if (!slug || !episodeNumber) return res.status(400).json({ status: 400, error: "Bad Request" });

    try {
        const anime = await Anime.fromName(slug);
        try {
            const episode = await anime.episodes[parseInt(episodeNumber) - 1].fetch();
            const arr = episode.videoLink.split(".");
            if (arr[arr.length - 1] === "m3u8") return res.status(400).json({ status: 400, error: "Bad Request" });
            return res.status(200).json(episode);
        } catch (error) {
            return res.status(400).json({ status: 400, error: "Invalid Episode Number" });
        }
    } catch (error) {
        return res.status(400).json({ status: 400, error: "Invalid Anime" });
    }
});

app.get("/anime/genre/:slug", async (req, res) => {
    const { slug } = req.params;

    if (!slug) return res.status(400).json({ status: 400, error: "Bad Request" });

    try {
        const { genres } = await Anime.fromName(slug);
        return res.status(200).json(genres);
    } catch {
        return res.status(400).json({ status: 400, error: "Invalid Anime" });
    }
});

app.get("/movie/:slug", async (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === undefined) return res.status(400).json({ status: 400, error: "Bad Request" });

    try {
        const anime = await Anime.fromName(slug);
        try {
            return await anime.episodes[0].fetch();
        } catch (error) {
            return res.status(400).json({ status: 400, error: "Invalid Movie" });
        }
    } catch (error) {
        return res.status(400).json({ status: 400, error: "Invalid Movie" });
    }
});

app.listen(port, () => console.log("App is listening on port", port));
