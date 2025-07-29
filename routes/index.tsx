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
    const customPath = formData.get("customPath")?.toString().trim() || "";

    if (!originalUrl) {
      return ctx.render({ error: "URL is required" });
    }

    try {
      // Validate URL format
      new URL(originalUrl);

      // Create short link
      const shortLink = await linkService.createLink(originalUrl, customPath);
      const shortLinkUrl = `${new URL(req.url).origin}/s/${shortLink.id}`;
      return ctx.render({ shortLink, originalUrl, shortLinkUrl });
    } catch (error) {
      return ctx.render({ error: (error as Error).message, originalUrl });
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
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-12">
            <div class="flex justify-center mb-6">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-3">
              Short Link Service
            </h1>
            <p class="text-lg text-gray-600 max-w-md mx-auto">
              Create short, memorable links for easy sharing
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-2xl">
            <form method="post" class="space-y-6">
              <div>
                <label
                  for="url"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Enter URL to shorten
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="url"
                    id="url"
                    value={originalUrl || ""}
                    required
                    class="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  for="customPath"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Custom Path (Optional)
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400">/s/</span>
                  </div>
                  <input
                    type="text"
                    name="customPath"
                    id="customPath"
                    class="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
                    placeholder="my-custom-path"
                    pattern="[a-zA-Z0-9\-_]+"
                    title="Only alphanumeric characters, hyphens, and underscores are allowed"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Leave blank to auto-generate a random path
                </p>
              </div>

              <button
                type="submit"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-lg"
              >
                Shorten URL
              </button>
            </form>

            {error && (
              <div class="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {shortLink && shortLinkUrl && (
              <div class="mt-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 transition-all duration-300 animate-fade-in">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-bold text-green-800 text-lg">
                    Your short link is ready!
                  </h3>
                  <div class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Success
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <a
                      href={shortLinkUrl}
                      class="text-blue-600 hover:text-blue-800 font-medium break-all hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortLinkUrl}
                    </a>
                    <p class="mt-2 text-sm text-gray-600 truncate">
                      Original:{" "}
                      <span class="break-all">{shortLink.originalUrl}</span>
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <CopyButton text={shortLinkUrl} />
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-100 flex items-center text-sm text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Clicks: {shortLink.clicks || 0}</span>
                </div>
              </div>
            )}
          </div>

          <DashboardLink />
        </div>
      </div>
    </>
  );
}
