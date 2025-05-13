import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MetaDataCompnent from "@/components/MetaData/MetaData";

const title = "Admin Dashboard | Sanatan Digital Solution";
const description = "Manage your admin settings and data in the dashboard.";

// Get the metadata dynamically
const metadata = MetaDataCompnent(title, description);

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
