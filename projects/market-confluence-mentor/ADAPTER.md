# Permitted TradingView browser collector

This repository includes the client and validation contract, not the browser collector.
Do not describe the connection as live until an end-to-end collector test succeeds.

Configure TRADINGVIEW_ADAPTER_URL to a trusted HTTPS endpoint (or the local Docker hostname tradingview).
Requests use POST with an optional Bearer TRADINGVIEW_ADAPTER_KEY and JSON:
`{"symbol":"BTCUSDT","venue":"BINANCE","product":"spot","style":"day"}`.

The collector must use a permitted, authenticated browser session, honor TradingView permissions and restrictions, and return observations actually collected from the specified market. Do not substitute another exchange/API silently. Do not expose cookies or browser credentials.

Response fields:
- provider: exactly "TradingView"
- collectionMethod: exactly "permitted-browser"
- symbol, venue, product: exact request identity
- sourceUrl: actual https://www.tradingview.com/chart/... URL
- observedAt: ISO timestamp for the observed current price, no older than 120 seconds
- price: positive finite observed market price
- candles: object keyed by timeframe. Day requires W1,D1,H4,H1,M15,M5; swing W1,D1,H4,H1.
- Each series contains 20–1000 ordered closed candles with closedAt, closed:true, open,high,low,close.
- closedAt must be the actual close timestamp, not a candle's opening timestamp.
- Latest closed candle must be within its timeframe duration plus two minutes. Closed markets may therefore return NO_TRADE; do not invent fresh bars.

Do not return placeholders, test candles or inferred prices to the live service. Unit tests use labelled fixtures without network access.
Calendar/session-aware market closures and real browser collection are remaining work.

Acceptance before live use: compare market identity, price, timestamps and all timeframes against the browser; check permission handling, delayed quotes, expired sessions, market closures, stale bars, missing frames and malformed OHLC. Failed collection must return an explicit error, never last-known data marked as current.
