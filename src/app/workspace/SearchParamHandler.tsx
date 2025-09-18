"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "@/config";
import { IoIosArrowForward } from "react-icons/io";
import { SearchIcon } from "lucide-react";
import { useSession } from "next-auth/react";

// Define a type for our snippet data for better type safety
interface Snippet {
  _id: string;
  workspace_id: string;
  category_id: string;
  title: string;
  description: string;
  tags: string[];
  // Add other snippet properties here if any
}

interface SearchParam {
  closeGlobalSearch: () => void;
}

const SearchParamsHandler = ({ closeGlobalSearch }: SearchParam) => {
  const [inpText, setInpText] = useState("");
  // Use the Snippet type for our state
  const [searchData, setSearchData] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  // --- NO LOGIC CHANGE: useEffect for searching remains the same ---
  useEffect(() => {
    // Debounce mechanism to prevent API calls on every keystroke
    const handler = setTimeout(async () => {
      if (inpText) {
        setLoading(true);
        try {
          const token = (session as any).backendJwt;

          if (!token) {
            throw new Error("No authentication token found");
          }

          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.get(
            `${baseURL}/v1/api/snippet/global?text=${inpText}`,
            { headers }
          );
          setSearchData(response.data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setSearchData([]); // Clear results on error
        } finally {
          setLoading(false);
        }
      } else {
        setSearchData([]);
      }
    }, 300); // 300ms delay

    // Cleanup function to cancel the timeout if the component unmounts or text changes
    return () => {
      clearTimeout(handler);
    };
  }, [inpText, session]);

  // --- NO LOGIC CHANGE: URL update function remains the same ---
  const updateURL = (snippet: Snippet) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    searchParams.set("workspace", snippet.workspace_id);
    searchParams.set("collection", snippet.category_id);
    searchParams.set("snippet", snippet._id);

    const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${searchParams.toString()}`;

    window.history.replaceState({}, "", newUrl);
    closeGlobalSearch();
  };

  return (
    <div className="p-4 md:p-6">
      {/* --- MODERN UI: Search Input --- */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={inpText}
          onChange={(e) => setInpText(e.target.value)}
          type="text"
          className="w-full h-12 bg-gray-800 text-white pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="Find by Tag, Description, Title..."
        />
      </div>

      {/* --- MODERN UI: Search Results --- */}
      {inpText && (
        <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400 p-8">Searching...</p>
          ) : searchData.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {searchData.map((snippet) => (
                <div
                  key={snippet._id} // Use a unique ID for the key
                  onClick={() => updateURL(snippet)}
                  className="p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                >
                  {/* Breadcrumb style path */}
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <span>Workspace</span>
                    <IoIosArrowForward className="mx-1" />
                    <span>Collection</span>
                    <IoIosArrowForward className="mx-1" />
                    <span className="font-semibold text-gray-300 truncate">
                      {snippet.title}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-3">
                    <p className="text-lg font-semibold text-white truncate">
                      {snippet.title}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {snippet.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {snippet.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 p-8">No snippets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchParamsHandler;
