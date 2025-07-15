import { FilePlus2, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Collection1({selectedWorkspace, setSelectedWorkspace, searchQuery, setSearchQuery, workspaces}) {
    return(
      <>
         {/* Collections Slide-in Panel */}
      <aside
        className={`fixed left-0 top-0 z-10 w-[260px] h-screen bg-[#141415] text-white border-1 border-zinc-100 px-4 py-4 transition-transform duration-300 ease-in-out transform ${
          selectedWorkspace ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">{selectedWorkspace}</div>
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => setSelectedWorkspace(null)}
          >
            Close
          </Button>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Search collections"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-zinc-400 uppercase mb-2">Collections</div>
          <div className="space-y-2">
            {(workspaces.find((ws) => ws.name === selectedWorkspace)?.collections || [])
              .filter((collection) =>
                collection.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((collection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FilePlus2 className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm">{collection.title}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{collection.date}</span>
                </div>
              ))}
          </div>
        </div>
      </aside>      
      </> 
    );
}