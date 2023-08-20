const router = require("express").Router();
const got = require("got");
const cheerio = require("cheerio");

const BASE_URL = "https://gogoanimehd.to";

router.get("/", async (req, res) => {
    try {
        const response = await got(BASE_URL);
        console.log(response.body);
    } catch (error) {
        console.log(error);
    }
    // const { body } = await got(BASE_URL);
    // console.log(body);
    // const $ = cheerio.load(body);

    // const items = $(".last_episodes").html();

    // console.log(items);
});

module.exports = router;
