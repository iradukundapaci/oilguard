import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RepoPage from "@/components/Tables/ReportTable";

export const metadata: Metadata = {
  title: "Oil Guard",
  description: "List of reports",
};

export default function ReportsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Reports" />
      <RepoPage />
    </DefaultLayout>
  );
}
