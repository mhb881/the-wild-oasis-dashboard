import { Uploader } from "../../data/Uploader";
import Logo from "./Logo";
import { MainNav } from "./MainNav";

function Sidebar() {
  return (
    <aside className="bg-gray-0 flex min-w-70 flex-col items-center gap-8 border-r border-solid border-gray-200 px-6 py-12">
      <Logo />
      <MainNav />
      <Uploader />
    </aside>
  );
}

export default Sidebar;
