import { useState } from "preact/hooks";

interface UrlEditorProps {
  id: string;
  currentUrl: string;
}

export default function UrlEditor({ id, currentUrl }: UrlEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(currentUrl);

  const handleEdit = () => {
    setIsEditing(true);
    setNewUrl(currentUrl);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUrl(currentUrl);
  };

  return (
    <div>
      {isEditing ? (
        <div class="mt-2">
          <form method="post" class="flex">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="action" value="updateUrl" />
            <input
              type="text"
              name="newUrl"
              value={newUrl}
              onInput={(e) => setNewUrl(e.currentTarget.value)}
              class="flex-1 min-w-0 block w-full px-3 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="New URL"
            />
            <button
              type="submit"
              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-r-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Save
            </button>
          </form>
          <button
            type="button"
            class="mt-1 inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          class="mt-2 inline-flex items-center text-sm text-gray-500 hover:text-blue-600"
          onClick={handleEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit URL
        </button>
      )}
    </div>
  );
}