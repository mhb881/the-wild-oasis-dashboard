import { User } from "lucide-react";
import { useNavigate } from "react-router";

import Logout from "../../features/authentication/Logout";
import Button from "../buttons/Button";
import DarkModeToggle from "../feedback/DarkModeToggle";

function HeaderMenu() {
  const navigate = useNavigate();

  return (
    <ul className="flex gap-2">
      <li>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/account")}
        >
          <User />
        </Button>
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
    </ul>
  );
}

export default HeaderMenu;
