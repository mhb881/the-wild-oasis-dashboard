import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import { Heading, RowLayout } from "../ui";

function Account() {
  return (
    <>
      <RowLayout type="vertical" className="gap-6">
        <Heading type="h2">更新用户信息</Heading>
        <UpdateUserDataForm />
        <UpdatePasswordForm />
      </RowLayout>
    </>
  );
}

export default Account;
