import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  lastClicked?: Date;
}

export class LinkService {
  private kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.kv = kv;
  }

  // Generate a unique short code
  private generateShortCode(): string {
    return nanoid(8);
  }

  // Create a new shortened link
  async createLink(originalUrl: string): Promise<Link> {
    const shortCode = this.generateShortCode();
    
    const link: Link = {
      id: crypto.randomUUID(),
      originalUrl,
      shortCode,
      createdAt: new Date(),
      clicks: 0
    };

    // Check if short code already exists (unlikely but possible)
    const existing = await this.kv.get(["links", shortCode]);
    if (existing.value) {
      // If exists, generate a new one
      return await this.createLink(originalUrl);
    }

    // Store the link
    const res = await this.kv.set(["links", shortCode], link);
    
    return link;
  }

  // Get original URL by short code
  async getLink(shortCode: string): Promise<Link | null> {
    const res = await this.kv.get(["links", shortCode]);
    return res.value as Link || null;
  }

  // Update click count for a link
  async incrementClickCount(shortCode: string): Promise<void> {
    const link = await this.getLink(shortCode);
    if (link) {
      link.clicks += 1;
      link.lastClicked = new Date();
      await this.kv.set(["links", shortCode], link);
    }
  }

  // Get all links (for dashboard)
  async getAllLinks(): Promise<Link[]> {
    const links: Link[] = [];
    const iter = this.kv.list({ prefix: ["links"] });
    
    for await (const res of iter) {
      links.push(res.value as Link);
    }
    
    // Sort by creation date (newest first)
    return links.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Delete a link
  async deleteLink(shortCode: string): Promise<boolean> {
    const res = await this.kv.delete(["links", shortCode]);
    return true;
  }
}