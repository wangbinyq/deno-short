export interface Link {
  id: string;
  originalUrl: string;
  createdAt: Date;
  clicks: number;
}

class LinkService {
  private kv: Deno.Kv | null = null;

  constructor() {
    // Initialize Deno KV
    this.initKv();
  }

  private async initKv() {
    this.kv = await Deno.openKv();
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
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
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
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    const entry = await this.kv.get<Link>(["links", id]);
    return entry.value || null;
  }

  // Update click count
  async incrementClicks(id: string): Promise<void> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    const link = await this.getLink(id);
    if (link) {
      link.clicks += 1;
      await this.kv.set(["links", id], link);
    }
  }

  // Delete a link
  async deleteLink(id: string): Promise<void> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    await this.kv.delete(["links", id]);
  }

  // Get all links (for dashboard)
  async getAllLinks(): Promise<Link[]> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    const links: Link[] = [];
    const entries = this.kv.list<Link>({ prefix: ["links"] });
    for await (const entry of entries) {
      links.push(entry.value);
    }
    return links;
  }
  
  // Close the KV connection
  close() {
    if (this.kv) {
      this.kv.close();
      this.kv = null;
    }
  }
}

export default new LinkService();