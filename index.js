import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Server is working");
});

app.post("/send-report", async (req, res) => {
  try {
    const { date, balance, goods, unloading, total } = req.body;

    if (!date) return res.status(400).json({ error: "Нет даты" });

    const text =
      `📊 *ОТЧЕТ ПО СКЛАДУ*\n` +
      `📅 *Дата:* ${date}\n` +
      `━━━━━━━━━━━━\n` +
      `💰 *Остаток:* ${balance}\n` +
      `📥 *Товар:* +${goods}\n` +
      `📤 *Выгрузка:* -${unloading}\n` +
      `━━━━━━━━━━━━\n` +
      `✅ *ИТОГО:* ${total}`;

    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text,
        parse_mode: "Markdown"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.description });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on port " + PORT));
