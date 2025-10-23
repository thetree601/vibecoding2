import React from "react";
import DiariesDetail from "@/components/diaries-detail";
import { AuthGuard } from "@/commons/providers/auth/auth.guard";

interface PageProps {
  params: {
    id: string;
  };
}

const DiariesDetailPage: React.FC<PageProps> = () => {
  return (
    <AuthGuard>
      <DiariesDetail />
    </AuthGuard>
  );
};

export default DiariesDetailPage;
