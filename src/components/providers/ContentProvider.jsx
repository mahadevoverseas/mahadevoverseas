"use client";

import { createContext, useContext } from "react";
import { defaultContent } from "@/lib/site";

const ContentContext = createContext(defaultContent);

/** Makes the admin-editable website content available to client components. */
export function ContentProvider({ content, children }) {
  return <ContentContext value={content}>{children}</ContentContext>;
}

export const useSite = () => useContext(ContentContext);
