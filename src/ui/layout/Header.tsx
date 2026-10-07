import UserAvatar from "../../features/authentication/UserAvatar";
import HeaderMenu from "./HeaderMenu";

function Header() {
  return (
    <header className="bg-gray-0 flex justify-between border-b border-solid border-gray-200 px-16 py-5">
      <h1 className="flex items-center text-2xl font-bold">Wild Oasis</h1>
      <section className="flex items-center gap-2">
        <UserAvatar />
        <HeaderMenu />
      </section>
    </header>
  );
}

export default Header;

