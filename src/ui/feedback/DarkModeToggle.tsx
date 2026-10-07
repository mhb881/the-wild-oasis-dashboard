import { Moon, Sun } from "lucide-react";

import { useDarkMode } from "../../context/DarkModeContext";
import Button from "../buttons/Button";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button size="icon" variant="ghost" onClick={toggleDarkMode}>
      {isDarkMode ? <Sun /> : <Moon />}
    </Button>
  );
}

export default DarkModeToggle;

