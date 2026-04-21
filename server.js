const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY  = "5557ca51b4msh5aa2b5e76df3f3dp1c854ejsn65c1471baf11";
const RAPIDAPI_HOST = "pokemon-tcg-api.p.rapidapi.com";

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Poke Scanner API running" });
});

app.get("/cards/:setId", async (req, res) => {
  const { setId } = req.params;
  try {
    const rarities = ["Special Illustration Rare","Illustration Rare","Hyper Rare","Secret Rare","Rainbow Rare","Full Art","Trainer Gallery"];
    const rarityQuery = rarities.map(r => `rarity:"${r}"`).join(" OR ");
    const query = `set.id:${setId} (${rarityQuery})`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=100&select=id,name,rarity,set,tcgplayer,images,number`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/history/:cardId", async (req, res) => {
  const { cardId } = req.params;
  try {
    const url = `https://${RAPIDAPI_HOST}/cards/${encodeURIComponent(cardId)}`;
    const response = await fetch(url, {
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key":  RAPIDAPI_KEY,
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/sets", async (req, res) => {
  try {
    const response = await fetch("https://api.pokemontcg.io/v2/sets?pageSize=250");
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Poke Scanner server running on port ${PORT}`));
