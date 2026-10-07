import { LogOut } from "lucide-react";

import { Button } from "../../ui";
import { useLogout } from "./useLogout";

function Logout() {
  const { logoutMutation, isLoggingOutPending } = useLogout();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isLoggingOutPending}
      onClick={() => logoutMutation()}
      className="flex gap-2"
    >
      <LogOut />
      {isLoggingOutPending ? "登出..." : "退出登录"}
    </Button>
  );
}

export default Logout;
