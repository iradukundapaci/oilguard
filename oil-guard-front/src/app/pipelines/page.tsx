import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PipelinesPage from "@/components/Tables/PipelineTable";

export const metadata: Metadata = {
  title: "Oil Guard",
  description: "List of pipelines",
};

export default function PipelinePage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pipelines" />
      <PipelinesPage />
    </DefaultLayout>
  );
}
