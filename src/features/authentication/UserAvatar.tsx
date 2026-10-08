import { useUser } from "./useUser";

function UserAvatar() {
  const { user } = useUser();
  console.log(user);
  const { username, avatar } = user?.user_metadata || {};

  let curAvatar = avatar;
  if (!avatar && user) {
    // 没有头像，但是有用户ID，获取随机头像
    curAvatar = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(user.id)}`;
  }

  // 2. 首字母字母头像
  const userInitial = username?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div
      className="group flex cursor-pointer items-center gap-1.5 rounded p-1 pr-1.5 text-base font-medium text-gray-600 transition-all duration-200 select-none"
      title={`查看 ${username} 的个人资料`}
    >
      {/* 头像容器：精简至 w-6 (24px)，边框改为 ring-1 以适应小尺寸 */}
      <div className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-100 transition-transform duration-200 group-hover:scale-110">
        {curAvatar ? (
          <img
            className="h-full w-full object-cover object-center"
            src={curAvatar}
            alt={`Avatar of ${username}`}
          />
        ) : (
          /* 首字母：因为容器变小到 24px，字号微调为 text-[10px] 视觉比例最完美 */
          <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-base font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            {userInitial}
          </div>
        )}
      </div>

      {/* 用户名：使用标准 text-xs，最大宽度限制为 max-w-20 (80px) 避免撑开 */}
      {username && (
        <span className="max-w-30 truncate transition-colors duration-200">
          {username}
        </span>
      )}
    </div>
  );
}

export default UserAvatar;
