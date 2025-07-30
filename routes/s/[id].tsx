import { Handlers } from "$fresh/server.ts";
import linkService from "../../services/linkService.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const url = new URL(req.url);
    const proxyMode = url.searchParams.get("proxy") === "true";

    try {
      // Get the link from the database
      const link = await linkService.getLink(id);

      if (!link) {
        return ctx.renderNotFound();
      }

      // Increment click count
      await linkService.incrementClicks(id);

      if (proxyMode) {
        // Proxy mode: fetch and return the original content
        const response = await linkService.fetchOriginalContent(
          link.originalUrl,
        );

        // Create a new response with the original content
        const headers = new Headers(response.headers);
        // Remove content-encoding header to avoid decompression issues
        headers.delete("content-encoding");

        return new Response(response.body, {
          status: response.status,
          headers,
        });
      } else {
        // Redirect mode: redirect to the original URL
        return new Response(null, {
          status: 302,
          headers: {
            Location: link.originalUrl,
          },
        });
      }
    } catch (error) {
      console.error("Error handling short link:", error);
      return ctx.renderNotFound();
    }
  },
};
