"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface WorkspaceContextType {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  jumpToPage: (page: number) => void;
  currentHighlight: string | null;
  setCurrentHighlight: (highlight: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);

  const jumpToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        jumpToPage,
        currentHighlight,
        setCurrentHighlight,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
