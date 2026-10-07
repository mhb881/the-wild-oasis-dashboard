import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export function useLocalStorageState<T>(
  initialState: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  // 只在首次渲染时执行一次，useState 回调函数的作用
  const [value, setValue] = useState<T>(() => {
    const storageVal = localStorage.getItem(key);
    return storageVal ? (JSON.parse(storageVal) as T) : initialState;
  });

  // 首次渲染：
  // 1. 从 localStorage 读取 false
  // 2. value = false
  // 3. 触发 useEffect
  // 4. 如果不检查，会立即写回 false 到 localStorage ❌ 浪费！
  const isInitialRender = useRef(true);

  useEffect(() => {
    // 步骤1：跳过初始渲染
    if (isInitialRender.current) {
      isInitialRender.current = false; // 标记为"非初始渲染"
      return; // 提前退出
    }

    // 步骤2：异步保存到 localStorage
    // 浏览器提供的 API，在主线程空闲时执行低优先级任务
    requestIdleCallback(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    });
  }, [key, value]);

  return [value, setValue];
}
