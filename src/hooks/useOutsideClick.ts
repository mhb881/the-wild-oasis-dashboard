// ../hooks/useOutsideClick.ts
import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing = true, // 默认是 true (捕获阶段)
) {
  // 创建一个 ref，用于绑定到需要检测的 DOM 元素
  // 返回给调用者，让他们绑定到目标元素
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // 检查条件：
      // 1. ref.current 存在（元素已挂载）
      // 2. 点击的目标不在元素内部
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler(); // 触发回调
      }
    }

    // 注册事件监听器
    document.addEventListener("mousedown", handleClick, listenCapturing);

    // 清理函数：移除事件监听器
    return () =>
      document.removeEventListener("mousedown", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
/*
为什么 listenCapturing = true 很重要？
📱 用户点击按钮

1️⃣ 捕获阶段 (Capture Phase) ← ⭐ listenCapturing=true 在这里
   ↓
   window → document → body → ... → 目标元素

2️⃣ 目标阶段 (Target Phase)
   ↓
   到达被点击的元素

3️⃣ 冒泡阶段 (Bubble Phase) ← ⭐ listenCapturing=false 在这里
   ↓
   目标元素 → ... → body → document → window
 */
