export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/log") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const ts = new Date().toISOString();
      await env.DB.prepare(
        "INSERT INTO clicks (ip, ts) VALUES (?, ?)"
      ).bind(ip, ts).run();
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    if (url.pathname === "/stats") {
      const token = url.searchParams.get("token");
      if (token !== env.ADMIN_TOKEN) {
        return new Response("unauthorized", { status: 401, headers: corsHeaders });
      }
      const rows = await env.DB.prepare(
        "SELECT ip, COUNT(*) as count FROM clicks GROUP BY ip ORDER BY count DESC"
      ).all();
      return Response.json(rows.results, { headers: corsHeaders });
    }

    if (url.pathname === "/count") {
      const row = await env.DB.prepare(
        "SELECT COUNT(*) as total FROM clicks"
      ).first();
      return Response.json({ total: row?.total ?? 0 }, { headers: corsHeaders });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
