import { Handlers } from "$fresh/server.ts";
import linkService from "../../services/linkService.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    
    try {
      // Get the link from the database
      const link = await linkService.getLink(id);
      
      if (!link) {
        return ctx.renderNotFound();
      }
      
      // Increment click count
      await linkService.incrementClicks(id);
      
      // Redirect to the original URL
      return new Response(null, {
        status: 302,
        headers: {
          Location: link.originalUrl,
        },
      });
    } catch (error) {
      console.error("Error handling short link:", error);
      return ctx.renderNotFound();
    }
  },
};