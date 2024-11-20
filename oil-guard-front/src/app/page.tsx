import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import { AuthGuard } from "@/components/Auth/auth-guard";
import { UserProvider } from "@/contexts/user-context";

export const metadata: Metadata = {
  title: "Oil Guard",
  description: "Dashboard for Oil Guard",
};

export default function Home() {
  return (
    <DefaultLayout>
      <UserProvider>
        <AuthGuard>
          <ECommerce />
        </AuthGuard>
      </UserProvider>
    </DefaultLayout>
  );
}
