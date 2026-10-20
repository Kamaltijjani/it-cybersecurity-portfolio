# Market Confluence Mentor — research prototype

A runnable local service and four separate n8n workflows for your trading research project.
**Trades are always placed manually. This is not yet a fully connected live signal agent.**

This is a clean rebuild from the recovered requirements. The older ZIP could not be unpacked in the creation environment; its code and journal were not inspected or migrated. Keep your original installation and data. This project creates separate Docker volumes.

## What is implemented

- Authenticated research API with explicit missing-connection responses.
- TradingView browser-adapter client with instrument, timestamp, closed-candle and OHLC checks.
- OpenAI research integration with web search, structured output and citation provenance checks.
- Candlestick SVGs from supplied, validated OHLC; never generated fictional market images.
- Private owner-only Telegram request polling and text replies, with durable send deduplication.
- Expiring follow-up watches with discrete observations; no inferred fills or continuous-coverage claims.
- Persistent paper/live journal, immutable closed outcomes, separated strategy/currency cohorts, net expectancy, profit factor, win-rate uncertainty and realised closed-trade drawdown.
- Four n8n workflow JSON files, local secret generation, automated import script and tests.

## What is NOT implemented or verified

- **No TradingView browser collector is included.** A configured URL is not proof of a working connection. The live analysis path returns NO_TRADE until a real, permitted collector supplies fresh evidence.
- **No deterministic SMC/ICT/PRICE_ACTION signal rulebooks, actionable-entry confirmation, cost-based net reward/risk gate or position sizing.** Model output is limited to NO_TRADE/WATCH research.
- No personal WhatsApp bridge or WhatsApp Business adapter.
- No annotated BOS/FVG/order-block chart markings. The SVG displays observed candles only.
- Telegram sends text; chart delivery to Telegram is not implemented. Charts are available through the authenticated local API.
- No always-on deployment, real account connection, n8n runtime import test, live model call, live messaging test or migrated old journal has been completed.

These are engineering/integration gaps, not features unlocked merely by pasting credentials.

## Quick start (Windows, macOS or Linux)

Install Node.js 22+ and Docker Desktop / Docker Engine with Compose.
Download this branch, then open a terminal in `projects/market-confluence-mentor`.

```sh
node setup.cjs
docker compose up -d --build
```

Open **http://localhost:5678** and create your n8n owner account.
Then import the four workflows and the generated local credential:

```sh
node import-n8n.cjs
node client.cjs status
node client.cjs performance
node client.cjs analyse examples/request.json
```

The first performance result is `{"guaranteed":false,"cohorts":[]}`.
The example analysis deliberately returns NO_TRADE while TradingView is missing. It sends no message and starts no monitor.

In n8n, open **04 Journal and measured results** and execute its manual check.
All workflows import inactive/unpublished. Review each before publishing schedules. Running 02 manually polls Telegram and can reply to matching owner commands if credentials are configured.

## Credentials and privacy

`node setup.cjs` generates local `.env` secrets without overwriting an existing file. It also generates a private credential-import file. Neither belongs in GitHub.
Fill optional model/adapter/Telegram credentials in local `.env`, then recreate services:
`docker compose up -d --force-recreate`.
Keep your existing n8n encryption key unchanged. This rebuild uses its own n8n volume; do not point it at your earlier n8n database without a migration review.

Set `OPENAI_MODEL` to a model your account supports for web search plus structured output. Research calls can incur API charges; missing evidence blocks the model call first.
The model receives the market request and evidence, not journal records or service credentials.
Journal data and reports remain in a Docker volume. Back up that volume; GitHub stores code, not live records.

Telegram requires the bot token and **your verified private chat ID**. The service checks both chat type and sender ID.
Command: `/analyse BINANCE:BTCUSDT spot SMC day`. This explicitly requests a private reply.
No messaging is sent by GitHub CI.

## Browser adapter contract

See [ADAPTER.md](ADAPTER.md). A trusted collector must be implemented and tested separately; no market-data API substitution is enabled.
Checks validate structure, freshness and consistency; they cannot prove a dishonest collector's claims. Configure only a collector you operate and trust.

## API

All endpoints except GET /health require `X-Mentor-Key`.
POST operations: /status, /analyse, /performance, /journal, /entry, /outcome, /report, /observe, /telegram.
Use `node client.cjs <operation> <payload.json>` to avoid putting secrets in terminal commands.
An analysis needs a unique requestId, exact symbol/venue/product, strategy, style, and optional boolean send/monitor.
Use a new ID for fresh research. Repeated IDs return the original report; conflicting input is rejected.
Monitor requests need an ISO expiresAt within seven days. Follow-up observations do not send alerts automatically.

Journal entry example:
`{"id":"paper-001","mode":"paper","strategy":"SMC","currency":"USD","evidence":"Your actual entry record"}`
Closure example:
`{"id":"paper-001","grossPnl":10,"costs":2,"evidence":"Your actual closure record"}`
These are schema examples, not recorded results. Live entries and closures require userConfirmed:true.
Costs must be total costs in the same currency as grossPnl. Returns as percentages are not computed without account-equity data.

## Tests and operations

```sh
npm test
docker compose logs --tail 50 mentor
docker compose down
```

Keep one mentor process per data volume; file persistence is not a multi-replica database.
Do not use `docker compose down -v` unless you intend to delete journal and n8n volumes.
Services bind to localhost; do not expose ports publicly without HTTPS and access-control configuration.
The n8n stable tag can change. Pin a tested digest before production use.

21 core behavior checks and source syntax were checked in a JavaScript runtime during authoring. The GitHub workflow runs Node tests and packages the project. Check its actual result; local Docker/n8n and live integrations were unavailable to the authoring environment.

GitHub hosts the code and CI, not a continuously running n8n server. Continuous operation requires an always-on machine or hosting account.

## Official implementation references
- https://docs.n8n.io/hosting/cli-commands/
- https://docs.n8n.io/hosting/installation/docker/
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://core.telegram.org/bots/api
