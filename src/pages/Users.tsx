import UserTable from "../features/users/UserTable";
import UserTableOperations from "../features/users/UserTableOperations";
import { Heading, RowLayout } from "../ui";

function Users() {
  return (
    <>
      <RowLayout type="horizontal">
        <Heading type={"h1"}>用户管理</Heading>
        <UserTableOperations />
      </RowLayout>

      <section className="flex w-full flex-col">
        <UserTable />
      </section>
    </>
  );
}

export default Users;
