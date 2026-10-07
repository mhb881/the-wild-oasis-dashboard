import DashboardFilter from "~/features/dashboard/DashboardFilter";
import DashboardLayout from "~/features/dashboard/DashboardLayout";
import { Heading, RowLayout } from "~/ui";

function Dashboard() {
  return (
    <>
      <RowLayout>
        <Heading type="h1">首页</Heading>

        <DashboardFilter />
      </RowLayout>
      <DashboardLayout>
        
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
