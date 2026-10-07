import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  return (
    // bg-gray-100
    <div className="flex min-h-screen flex-col items-center justify-center p-5 text-center">
      <div className="mb-5 text-[120px] font-bold text-gray-500 drop-shadow-md">
        404
      </div>
      <h1 className="mb-2.5 text-2xl font-semibold text-gray-800">
        页面未找到
      </h1>
      <p className="mb-7.5 max-w-[400px] text-base text-gray-500">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      <a
        onClick={() => navigate(-1)}
        className="inline-block cursor-pointer rounded bg-blue-500 px-7.5 py-3 text-base font-medium text-white no-underline shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
      >
        返回上一页
      </a>
    </div>
  );
}

export default NotFound;
