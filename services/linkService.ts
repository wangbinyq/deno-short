import { Kv } from "https://deno.land/x/deno_kv@v0.1.0/mod.ts";

export interface Link {
  id: string;
  originalUrl: string;
  createdAt: Date;
  clicks: number;
}

class LinkService {
  private kv: Kv;

  constructor() {
    // Initialize Deno KV
    this.kv = new Kv("./kv.db");
  }

  // Generate a unique short ID
  private generateShortId(length = 6): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Create a new short link
  async createLink(originalUrl: string): Promise<Link> {
    const id = this.generateShortId();
    const link: Link = {
      id,
      originalUrl,
      createdAt: new Date(),
      clicks: 0,
    };

    // Store in KV
    await this.kv.set(["links", id], link);
    return link;
  }

  // Get a link by ID
  async getLink(id: string): Promise<Link | null> {
    const entry = await this.kv.get<Link>(["links", id]);
    return entry?.value || null;
  }

  // Update click count
  async incrementClicks(id: string): Promise<void> {
    const link = await this.getLink(id);
    if (link) {
      link.clicks += 1;
      await this.kv.set(["links", id], link);
    }
  }

  // Delete a link
  async deleteLink(id: string): Promise<void> {
    await this.kv.delete(["links", id]);
  }

  // Get all links (for dashboard)
  async getAllLinks(): Promise<Link[]> {
    const links: Link[] = [];
    const entries = await this.kv.list<Link>({ prefix: ["links"] });
    for await (const entry of entries) {
      links.push(entry.value);
    }
    return links;
  }
}

export default new LinkService();