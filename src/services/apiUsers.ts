import type {
  CreateUserInput,
  SystemUser,
  UpdateUserInput,
} from "../features/users/types";
import { signUp } from "./apiAuth";
import supabase from "./supabase";

/**
 * 获取 Supabase 中的所有真实用户
 */
export async function getUsers(): Promise<SystemUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`获取用户列表失败: ${error.message}`);
  }

  return (data || []) as SystemUser[];
}

/**
 * 在 Supabase 中创建新用户：
 * 1. 若提供了密码，同步创建 Supabase Auth 账号供登录使用
 * 2. 在 public.users 表中插入用户记录
 */
// src/services/apiUsers.ts
export async function createUser(input: CreateUserInput): Promise<SystemUser> {
  // 1. 如果传递了密码，先在 Supabase Auth 中注册（会自动触发上面的 SQL 触发器）
  if (input.password) {
    await signUp({
      username: input.username,
      email: input.email,
      password: input.password,
    });
  }
  const defaultAvatar = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(input.username)}`;
  // 2. 使用 upsert，确保无论触发器是否已写入，都能平滑兼容并更新最新资料
  const { data, error } = await supabase
    .from("users")
    .upsert(
      [
        {
          username: input.username,
          email: input.email,
          avatar: input.avatar || defaultAvatar,
          role: input.role,
          status: input.status || "active",
        },
      ],
      { onConflict: "email" },
    )
    .select()
    .single();
  if (error) {
    throw new Error(`创建用户失败: ${error.message}`);
  }
  return data as SystemUser;
}

/**
 * 更新 Supabase 中的用户信息
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<SystemUser> {
  const { data, error } = await supabase
    .from("users")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新用户失败: ${error.message}`);
  }

  return data as SystemUser;
}

/**
 * 在 Supabase 中删除用户
 */
export async function deleteUser(id: string): Promise<string> {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    throw new Error(`删除用户失败: ${error.message}`);
  }

  return id;
}
