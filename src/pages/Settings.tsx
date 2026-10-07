import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import { Heading } from "../ui";

function Settings() {
  return (
    <>
      <div className="flex flex-col gap-10">
        <Heading type={"h1"}>酒店设置</Heading>
        <UpdateSettingsForm />
      </div>
    </>
  );
}

export default Settings;
