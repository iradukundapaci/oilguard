import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SensorsTable from "@/components/Tables/TableOne";

export const metadata: Metadata = {
  title: "Oil Guard",
  description: "List of sensors",
};

export default function SensorPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sensors" />
      <SensorsTable />
    </DefaultLayout>
  );
}
