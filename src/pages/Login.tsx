import LoginForm from "../features/authentication/LoginForm";
import { Logo } from "../ui";

function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* 背景色块 */}
      <div className="absolute top-[-8rem] -left-32 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="absolute top-24 right-[-6rem] h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      {/* 轻微纹理 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.18)_1px,transparent_0)] bg-size-[24px_24px] opacity-40" />

      {/* 内容 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
