import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useUser } from "../../features/authentication/useUser";
import Spinner from "../feedback/Spinner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // 1. 加载已登录的用户
  const { user, isPending, error, isAuthenticated } = useUser();

  // 3. 如果是非登录用户，重定向到登录页
  // 副作用（导航跳转）必须放在 useEffect 中执行
  useEffect(() => {
    if (!isAuthenticated && !isPending) {
      navigate("/login");
    }
  }, [isAuthenticated, isPending, navigate]);

  // 2. 加载时，展示 spinner
  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  // 4. 如果是登录用户，渲染应用程序
  if (isAuthenticated) {
    return children;
  }

  // 5. 兜底处理：如果既没有加载中，也没有被授权（此时 useEffect 正在执行跳转），
  // 返回 null 防止受保护的页面内容闪现。
  return null;
}

export default ProtectedRoute;

