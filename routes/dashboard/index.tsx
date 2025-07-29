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
      <div class="px-4 py-8 mx-auto bg-gray-100 min-h-screen">
        <div class="max-w-screen-md mx-auto">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p class="text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (authenticated === false) {
    return (
      <div class="px-4 py-8 mx-auto bg-gray-100 min-h-screen">
        <div class="max-w-screen-md mx-auto">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Dashboard Access</h1>
            <p class="text-gray-600 mb-4">Please provide the access code to view the dashboard.</p>
            <p class="text-gray-600 mb-4">
              Add <code>?accesscode=YOUR_CODE</code> to the URL or set the{" "}
              <code>DASHBOARD_ACCESS_CODE</code> environment variable.
            </p>
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
      <div class="px-4 py-8 mx-auto bg-gray-100 min-h-screen">
        <div class="max-w-screen-lg mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Short Link Dashboard</h1>
            <p class="text-gray-600">Manage your short links</p>
          </div>
          
          {links && links.length > 0 ? (
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Short Link
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original URL
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {links.map((link) => (
                      <tr key={link.id}>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={`/s/${link.id}`} 
                            class="text-blue-600 hover:underline"
                            target="_blank"
                          >
                            /s/{link.id}
                          </a>
                        </td>
                        <td class="px-6 py-4">
                          <a 
                            href={link.originalUrl} 
                            class="text-blue-600 hover:underline break-all"
                            target="_blank"
                          >
                            {link.originalUrl}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                          {link.clicks}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                          <form method="post" class="inline">
                            <input type="hidden" name="id" value={link.id} />
                            <input type="hidden" name="action" value="delete" />
                            <button
                              type="submit"
                              class="text-red-600 hover:text-red-900"
                              onClick={(e) => {
                                if (!confirm("Are you sure you want to delete this link?")) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <p class="text-gray-500">No short links created yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}