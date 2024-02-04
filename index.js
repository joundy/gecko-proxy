const Fastify = require("fastify");
const fastify = Fastify({ logger: true });

let listCache = {
  ts: null,
};

const ONE_MINUTE_IN_MILIS = 60 * 1000;
const PORT = process.env.PORT || 4000;

fastify.get("/coin-vs-idr/:id", async (req) => {
  const tsNow = new Date().getTime();
  if (tsNow - listCache.ts > ONE_MINUTE_IN_MILIS || listCache.ts === null) {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr",
    );
    const data = JSON.parse(await res.text());

    listCache = {
      data: new Map(
        data.map((v) => {
          return [v.id, v];
        }),
      ),
      ts: tsNow,
    };
  }

  return listCache.data.get(req.params.id);
});

async function main() {
  await fastify.listen({ port: PORT });
  console.log(`server is running on port ${PORT}`);
}

main();
