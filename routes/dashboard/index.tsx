import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import linkService, { Link } from "../../services/linkService.ts";

interface Data {
  links?: Link[];
  error?: string;
  authenticated?: boolean;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const accessCode = url.searchParams.get("accesscode");
    
    // Check if access code is provided and matches the environment variable
    const expectedAccessCode = Deno.env.get("DASHBOARD_ACCESS_CODE");
    
    if (!expectedAccessCode) {
      return ctx.render({ error: "Dashboard access code not configured" });
    }
    
    if (!accessCode || accessCode !== expectedAccessCode) {
      return ctx.render({ authenticated: false });
    }
    
    // Get all links for the dashboard
    const links = await linkService.getAllLinks();
    return ctx.render({ links, authenticated: true });
  },
  
  async POST(req, ctx) {
    const url = new URL(req.url);
    const accessCode = url.searchParams.get("accesscode");
    
    // Check if access code is provided and matches the environment variable
    const expectedAccessCode = Deno.env.get("DASHBOARD_ACCESS_CODE");
    
    if (!expectedAccessCode) {
      return ctx.render({ error: "Dashboard access code not configured" });
    }
    
    if (!accessCode || accessCode !== expectedAccessCode) {
      return ctx.render({ authenticated: false });
    }
    
    const formData = await req.formData();
    const action = formData.get("action")?.toString();
    const id = formData.get("id")?.toString();
    
    if (action === "delete" && id) {
      await linkService.deleteLink(id);
    }
    
    // Get all links for the dashboard
    const links = await linkService.getAllLinks();
    return ctx.render({ links, authenticated: true });
  },
};

export default function Dashboard({ data }: PageProps<Data>) {
  // Provide default values in case data is undefined
  const { links, error, authenticated } = data || {};
  
  if (error) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-red-600 mt-4 mb-2">Error</h1>
              <p class="text-gray-700">{error}</p>
              <a 
                href="/" 
                class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (authenticated === false) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">Dashboard Access Required</h1>
              <p class="text-gray-600 mb-4">Please provide the access code to view the dashboard.</p>
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <p class="text-gray-600 mb-2">
                  Add <code class="bg-gray-100 px-2 py-1 rounded">?accesscode=YOUR_CODE</code> to the URL
                </p>
                <p class="text-gray-600">
                  Or set the <code class="bg-gray-100 px-2 py-1 rounded">DASHBOARD_ACCESS_CODE</code> environment variable.
                </p>
              </div>
              <a 
                href="/" 
                class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Short Link Dashboard</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p class="mt-2 text-gray-600">Manage and track your short links</p>
            </div>
            <div class="mt-4 md:mt-0">
              <a 
                href="/" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Link
              </a>
            </div>
          </div>
          
          {links && links.length > 0 ? (
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Short Link
                      </th>
                      <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original URL
                      </th>
                      <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {links.map((link) => (
                      <tr key={link.id} class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={`/s/${link.id}`} 
                            class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            /s/{link.id}
                          </a>
                        </td>
                        <td class="px-6 py-4 max-w-xs">
                          <a 
                            href={link.originalUrl} 
                            class="text-blue-600 hover:text-blue-800 break-all hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.originalUrl}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {link.clicks}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(link.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                          <form method="post" class="inline">
                            <input type="hidden" name="id" value={link.id} />
                            <input type="hidden" name="action" value="delete" />
                            <button
                              type="submit"
                              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                              onClick={(e) => {
                                if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="bg-gray-50 px-6 py-4">
                <p class="text-sm text-gray-500">
                  Showing <span class="font-medium">{links.length}</span> short links
                </p>
              </div>
            </div>
          ) : (
            <div class="bg-white rounded-2xl shadow-xl p-12 text-center transition-all duration-300 hover:shadow-2xl">
              <div class="flex justify-center mb-6">
                <div class="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No short links yet</h3>
              <p class="text-gray-500 mb-6">Get started by creating your first short link.</p>
              <a 
                href="/" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create your first link
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}