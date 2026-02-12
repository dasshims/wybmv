export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/log") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const ts = new Date().toISOString();
      await env.DB.prepare(
        "INSERT INTO clicks (ip, ts) VALUES (?, ?)"
      ).bind(ip, ts).run();
      return new Response("ok", { status: 200 });
    }

    if (url.pathname === "/stats") {
      const token = url.searchParams.get("token");
      if (token !== env.ADMIN_TOKEN) {
        return new Response("unauthorized", { status: 401 });
      }
      const rows = await env.DB.prepare(
        "SELECT ip, COUNT(*) as count FROM clicks GROUP BY ip ORDER BY count DESC"
      ).all();
      return Response.json(rows.results);
    }

    return new Response("Not Found", { status: 404 });
  }
};
