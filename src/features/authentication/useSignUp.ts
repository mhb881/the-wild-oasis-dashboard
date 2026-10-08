import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { signUp } from "../../services/apiAuth";

export function useSignUp() {
  const {
    mutate: signUpMutation,
    isPending: isSignUpPending,
    error,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success("注册成功，请前往邮箱完成验证后登录");
    },
    onError: (error) => {
      console.error(error);
      // 可针对限流做专门的友好提示
      const msg = error.message || "注册失败";
      if (msg.includes("rate limit")) {
        toast.error("该邮箱注册请求过于频繁，请1小时后再试");
      } else {
        toast.error(msg);
      }
    },
  });

  return {
    signUpMutation,
    isSignUpPending,
    error,
  };
}
