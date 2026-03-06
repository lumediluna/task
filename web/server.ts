import express from "express";
import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";
import { spawn } from "child_process";

const app = express();
const PORT = 3000;

// === Абсолютные пути ===
const projectRoot = path.resolve(__dirname, "../../");
const viewsPath = path.resolve(projectRoot, "web/views");
const allureHistoryPath = path.resolve(projectRoot, "allure-history");
const dbPath = path.resolve(projectRoot, "runs.db");

// === Express ===
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use("/report", express.static(allureHistoryPath));

// === Папка для истории ===
if (!fs.existsSync(allureHistoryPath)) {
    fs.mkdirSync(allureHistoryPath);
}

// === База ===
const db = new sqlite3.Database(dbPath);

db.run(`
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT,
  started_at TEXT,
  status TEXT
)
`);

// === Главная ===
app.get("/", (_, res) => {
    res.render("index");
});

// === История ===
app.get("/runs", (_, res) => {
    db.all("SELECT * FROM runs ORDER BY id DESC", (err, rows) => {
        res.render("runs", { runs: rows });
    });
});

// === Страница конкретного запуска ===
app.get("/runs/:id", (req, res) => {
    db.get(
        "SELECT * FROM runs WHERE run_id = ?",
        [req.params.id],
        (err, row) => {
            res.render("run", { run: row });
        }
    );
});

// === API для проверки статуса ===
app.get("/api/status/:id", (req, res) => {
    db.get(
        "SELECT status FROM runs WHERE run_id = ?",
        [req.params.id],
        (err, row: any) => {
            if (!row) {
                return res.json({ status: "unknown" });
            }

            res.json({ status: row.status });
        }
    );
});

// === Запуск тестов (НЕБЛОКИРУЮЩИЙ) ===
app.post("/run", (_, res) => {
    const runId = Date.now().toString();
    const startedAt = new Date().toISOString();
    const reportPath = path.join(allureHistoryPath, runId);

    // создаем запись со статусом running
    db.run(
        `INSERT INTO runs (run_id, started_at, status)
     VALUES (?, ?, ?)`,
        [runId, startedAt, "running"]
    );

    // сразу редиректим
    res.redirect(`/runs/${runId}`);

    const pwPath = path.join(
        projectRoot,
        "node_modules",
        ".bin",
        "playwright.cmd"
    );

    const allurePath = path.join(
        projectRoot,
        "node_modules",
        ".bin",
        "allure.cmd"
    );

    console.log("Starting Playwright...");

    const pw = spawn(pwPath, ["test"], {
        cwd: projectRoot,
        shell: true
    });

    pw.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    pw.stderr.on("data", (data) => {
        console.error(data.toString());
    });

    pw.on("close", (code) => {
        if (code !== 0) {
            db.run(
                `UPDATE runs SET status=? WHERE run_id=?`,
                ["failed", runId]
            );
            return;
        }

        console.log("Generating Allure report...");

        const allure = spawn(
            allurePath,
            [
                "generate",
                "allure-results",
                "--clean",
                "-o",
                reportPath
            ],
            {
                cwd: projectRoot,
                shell: true
            }
        );

        allure.on("close", () => {
            db.run(
                `UPDATE runs SET status=? WHERE run_id=?`,
                ["passed", runId]
            );
        });
    });
});

// === Запуск сервера ===
app.listen(PORT, async () => {
    console.log(`UI started: http://localhost:${PORT}`);

    const open = (await import("open")).default;
    await open(`http://localhost:${PORT}`);
});