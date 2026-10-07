import { useDarkMode } from "../../context/DarkModeContext";

function Logo() {
  const { isDarkMode } = useDarkMode();

  const imgSrc = isDarkMode ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className="flex w-full items-center justify-center">
      <img src={imgSrc} alt="Logo" className="h-24 w-auto" />
    </div>
  );
}

export default Logo;

