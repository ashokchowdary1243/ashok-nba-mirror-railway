import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const NBA_BASE = "https://cdn.nba.com/static/json/liveData";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.nba.com/",
  "Origin": "https://www.nba.com"
};

async function proxy(url) {
  const r = await fetch(url, { headers: HEADERS });
  const txt = await r.text();
  return { status: r.status, body: txt };
}

app.get("/scoreboard/:date", async (req, res) => {
  const date = req.params.date;
  const { status, body } = await proxy(`${NBA_BASE}/scoreboard/${date}.json`);
  res.status(status).type("json").send(body);
});

app.get("/boxscore/:gid", async (req, res) => {
  const gid = req.params.gid;
  const { status, body } = await proxy(`${NBA_BASE}/boxscore/boxscore_${gid}.json`);
  res.status(status).type("json").send(body);
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "NBA Mirror (Railway)",
    routes: ["/scoreboard/YYYYMMDD", "/boxscore/GAMEID"]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("NBA Mirror running on " + PORT));
