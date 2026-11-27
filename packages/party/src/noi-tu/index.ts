/**
 * "@play4fun/party/noi-tu": word-chain dictionary + duel rules. A separate entry point so the
 * ~300 KB dictionary is only bundled by the pages and server code that import it.
 */
export * from "./dict";
export * from "./duel";
