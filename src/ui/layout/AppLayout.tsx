import { Outlet } from "react-router";

import Header from "./Header";
import Sidebar from "./Sidebar";

/*
比起随机向元素添加间距，使用 Container 可以统一元素间距，避免元素间距不一致的问题。
 */
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto my-0 flex max-w-480 flex-col gap-8">{children}</div>
  );
}

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        {/* flex-1 = 让这个元素“自动占满父容器剩下的所有空间”。 */}
        <main className="flex-1 overflow-auto bg-gray-100 px-16 pt-8 pb-24">
          <Container>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
}
