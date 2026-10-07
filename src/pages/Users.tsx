import SignUpForm from "../features/authentication/SignUpForm";
import { Heading, RowLayout } from "../ui";

function Users() {
  return (
    <>
      <RowLayout>
        <Heading type={"h1"}>创建用户</Heading>
      </RowLayout>
      <section className="flex w-full flex-col">
        <SignUpForm />
      </section>
    </>
  );
}

export default Users;
