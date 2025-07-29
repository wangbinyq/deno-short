import { useState, useEffect } from "preact/hooks";

export default function DashboardLink() {
  const [showDialog, setShowDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  // Load access code from localStorage on component mount
  useEffect(() => {
    const savedAccessCode = localStorage.getItem("dashboardAccessCode");
    if (savedAccessCode) {
      setAccessCode(savedAccessCode);
    }
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (accessCode) {
      // Save access code to localStorage
      localStorage.setItem("dashboardAccessCode", accessCode);
      window.location.href = `/dashboard?accesscode=${encodeURIComponent(accessCode)}`;
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleClear = () => {
    localStorage.removeItem("dashboardAccessCode");
    setAccessCode("");
  };

  return (
    <>
      <div class="text-center mt-8">
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          Go to Dashboard
        </button>
      </div>

      {showDialog && (
        <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-gray-800">Dashboard Access</h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p class="text-gray-600 mb-6">Please enter your access code to continue to the admin dashboard.</p>
              
              <form onSubmit={handleSubmit}>
                <div class="mb-6">
                  <label for="accesscode" class="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="accesscode"
                      value={accessCode}
                      onInput={(e) => setAccessCode(e.currentTarget.value)}
                      class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your access code"
                      required
                    />
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleClear}
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Clear saved code
                  </button>
                  
                  <div class="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      class="px-5 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Access Dashboard
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}