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
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  // Create a new short link
  async createLink(originalUrl: string, customId?: string): Promise<Link> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Use custom ID if provided, otherwise generate a random one
    let id: string;
    if (customId) {
      // Validate custom ID format
      if (!/^[a-zA-Z0-9\-_]+$/.test(customId)) {
        throw new Error(
          "Custom path can only contain alphanumeric characters, hyphens, and underscores",
        );
      }

      // Check if the custom ID is already taken
      const existingLink = await this.getLink(customId);
      if (existingLink) {
        throw new Error(
          "Custom path already exists, please choose another one",
        );
      }

      id = customId;
    } else {
      id = this.generateShortId();
    }

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
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const entry = await this.kv.get<Link>(["links", id]);
    return entry.value || null;
  }

  // Update click count
  async incrementClicks(id: string): Promise<void> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise((resolve) => setTimeout(resolve, 10));
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
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    await this.kv.delete(["links", id]);
  }

  // Update a link's ID
  async updateLinkId(oldId: string, newId: string): Promise<Link | null> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Check if the new ID is already taken
    const existingLink = await this.getLink(newId);
    if (existingLink) {
      throw new Error("Link ID already exists");
    }

    // Get the existing link
    const link = await this.getLink(oldId);
    if (!link) {
      return null;
    }

    // Create updated link with new ID
    const updatedLink: Link = {
      ...link,
      id: newId,
    };

    // Delete the old link and save the new one
    await this.kv.delete(["links", oldId]);
    await this.kv.set(["links", newId], updatedLink);

    return updatedLink;
  }

  // Update a link's original URL
  async updateLinkUrl(id: string, newUrl: string): Promise<Link | null> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Get the existing link
    const link = await this.getLink(id);
    if (!link) {
      return null;
    }

    // Validate URL format
    try {
      new URL(newUrl);
    } catch (_error) {
      throw new Error("Invalid URL format");
    }

    // Create updated link with new URL
    const updatedLink: Link = {
      ...link,
      originalUrl: newUrl,
    };

    // Save the updated link
    await this.kv.set(["links", id], updatedLink);

    return updatedLink;
  }

  // Get all links (for dashboard)
  async getAllLinks(): Promise<Link[]> {
    // Wait for KV to be initialized
    while (!this.kv) {
      await new Promise((resolve) => setTimeout(resolve, 10));
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

  // Fetch content from original URL (proxy mode)
  async fetchOriginalContent(url: string): Promise<Response> {
    try {
      const response = await fetch(url);
      return response;
    } catch (error) {
      console.error("Error fetching original content:", error);
      throw new Error("Failed to fetch original content");
    }
  }
}

export default new LinkService();
