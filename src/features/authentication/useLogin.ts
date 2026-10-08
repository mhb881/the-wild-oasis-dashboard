import { useMutation, useQueryClient } from "@tanstack/react-query"; // 1. 引入 useQueryClient
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { login } from "../../services/apiAuth";
import type { LoginObj } from "../../types/types";

/*
出现“跳转没有发生”的表象，实际上的过程是这样的：
你点击登录成功了。
useLogin 触发了 Maps("/")，页面确实成功跳转到了首页 /。
首页被 ProtectedRoute 包裹，ProtectedRoute 立即挂载并执行 useUser()。
问题出在这里：React Query 的缓存中还没有更新用户的数据，useUser() 此时仍然认为 isAuthenticated 为 false。
结果，我们刚刚在 ProtectedRoute 里写的代码立即生效，瞬间又把你 Maps("/login") 踢回了登录页。
因为这个过程发生在几毫秒内，肉眼根本看不见页面切换，看起来就像是“点击登录后毫无反应，没有发生跳转”。
 */
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 2. 初始化 queryClient

  const { isPending: isLoggingIn, mutate: loginMutate } = useMutation({
    mutationFn: (input: LoginObj) => login(input),
    onSuccess: (data) => {
      // 3. 关键步骤：手动将用户数据注入缓存
      // 注意：这里的缓存 key（如 ["user"]）必须与你 useUser 钩子中 queryKey 一模一样！
      // 如果你使用的是 Supabase，返回的数据结构可能是 user.user，请根据 console.log 调整
      queryClient.setQueryData(["user"], data.user);

      toast.success("登录成功");

      // 4. 推荐加上 { replace: true }，这样登录后，用户按浏览器的“后退”键不会再回到登录页
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Error: ", error);
      toast.error("登录失败，请检查邮箱和密码");
    },
  });

  return { isLoggingIn, loginMutate };
}
