import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import linkService, { Link } from "../services/linkService.ts";
import CopyButton from "../islands/CopyButton.tsx";
import DashboardLink from "../islands/DashboardLink.tsx";

interface Data {
  shortLink?: Link;
  error?: string;
  originalUrl?: string;
  shortLinkUrl?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const formData = await req.formData();
    const originalUrl = formData.get("url")?.toString() || "";

    if (!originalUrl) {
      return ctx.render({ error: "URL is required" });
    }

    try {
      // Validate URL format
      new URL(originalUrl);
      
      // Create short link
      const shortLink = await linkService.createLink(originalUrl);
      const shortLinkUrl = `${new URL(req.url).origin}/s/${shortLink.id}`;
      return ctx.render({ shortLink, originalUrl, shortLinkUrl });
    } catch (_error) {
      return ctx.render({ error: "Invalid URL format", originalUrl });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  // Provide default values in case data is undefined
  const { shortLink, error, originalUrl, shortLinkUrl } = data || {};
  
  return (
    <>
      <Head>
        <title>Short Link Service</title>
      </Head>
      <div class="px-4 py-8 mx-auto bg-gray-100 min-h-screen">
        <div class="max-w-screen-md mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Short Link Service</h1>
            <p class="text-gray-600">Create short links for easy sharing</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <form method="post" class="space-y-4">
              <div>
                <label for="url" class="block text-sm font-medium text-gray-700 mb-1">
                  Enter URL to shorten
                </label>
                <input
                  type="url"
                  name="url"
                  id="url"
                  value={originalUrl || ""}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Shorten URL
              </button>
            </form>
            
            {error && (
              <div class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {shortLink && shortLinkUrl && (
              <div class="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
                <h3 class="font-medium text-green-800 mb-2">Your short link:</h3>
                <div class="flex items-center">
                  <a 
                    href={shortLinkUrl} 
                    class="text-blue-600 hover:underline break-all"
                    target="_blank"
                  >
                    {shortLinkUrl}
                  </a>
                  <CopyButton text={shortLinkUrl} />
                </div>
                <p class="mt-2 text-sm text-gray-600">
                  Original: <span class="break-all">{shortLink.originalUrl}</span>
                </p>
              </div>
            )}
          </div>
          
          <DashboardLink />
        </div>
      </div>
    </>
  );
}