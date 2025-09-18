import React, { Suspense, useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import SnippetCard from "./SnippetCard/Card";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Welcome from "./Welcome";
import useFetch from "@/network/useFetch";
import { baseURL } from "@/config";
import { useSession } from "next-auth/react";
interface SnippetSectionProps {
  isRefresh: any;
}

const SnippetSection: React.FC<SnippetSectionProps> = ({ isRefresh }) => {
  const [openSnippet, setIsOpenSnippet] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const Router = useRouter();

  const collection = searchParams.get("collection") || "";
  const snippet = searchParams.get("snippet") || "";

  const updateUrl = (name: string) => {
    const workspace = searchParams.get("workspace") || "";
    const collection = searchParams.get("collection") || "";
    const query: Record<string, string> = {
      workspace,
      collection,
    };
    if (name) {
      query.snippet = name;
    }
    Router.push(`?${new URLSearchParams(query).toString()}`);
    setIsOpenSnippet(true);
  };

  const [isSnippet, setIsSnippet] = useState<any>([]);
  const { data: session, status } = useSession();
  useLayoutEffect(() => {
    const fetchSnippets = async () => {
      const token = (session as any).backendJwt;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(
          `${baseURL}/v1/api/snippet?cat_id=${collection}`,
          { headers }
        );
        setIsSnippet(response.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (collection) {
      fetchSnippets();
    }
  }, [collection, isRefresh]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {collection ? (
          <div
            style={{ height: "100vh" }}
            className="h-screen-full w-full overflow-y-auto"
          >
            <div className={`w-full flex flex-col `}>
              <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isSnippet?.map((snip: any) => (
                  <button key={snip._id}>
                    <SnippetCard {...snip} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : collection == "" || snippet == "" ? (
          <div className=" m-auto">
            <Welcome />
          </div>
        ) : (
          <div>
            <div className="h-10 w-10">+</div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SnippetSection;
