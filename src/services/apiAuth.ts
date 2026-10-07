import { cnToEnSlug } from "../lib/utils/helpers";
import type {
  LoginObj,
  UpdateUserDataFormInput,
  UserFromSupabase,
} from "../types/types";
import supabase, { supabaseUrl } from "./supabase";

/*
问题：
signUp 服务函数直接接收完整的 SignUpFormInput 类型（包含 confirmPassword），
但 Supabase 注册接口完全不需要确认密码字段，属于无效参数，且服务层与表单层类型强耦合，不利于后续维护。

修复方案：
给 signUp 单独定义入参类型，只包含需要的字段, 调用时按需传参，避免透传无效字段。

2. 错误包装丢失原始错误上下文
问题：
signUp 函数中对未知错误重新包装为 Error 时，丢失了原始错误的栈信息、状态码等内容，不利于线上调试排查。
修复方案：
使用 Error 的 cause 属性保留原始错误：
 */
interface SignUpParams {
  username: string;
  email: string;
  password: string;
}
export async function signUp({ username, email, password }: SignUpParams) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar: "",
        },
      },
    });

    if (error) {
      throw new Error("注册失败：" + error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("注册过程中发生了未知错误。", { cause: error });
  }
}

export async function login({ email, password }: LoginObj) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error("登录失败：" + error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("登录过程中发生了未知错误。");
  }
}

export async function getCurrentUser(): Promise<UserFromSupabase | null> {
  try {
    // 获取会话
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error("获取会话失败：" + error.message);
    }
    // 检查会话是否存在
    if (!sessionData.session) return null;

    // 获取当前用户
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("获取当前用户失败：" + userError.message);
    }
    return (data?.user as UserFromSupabase) ?? null;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("获取当前用户过程中发生了未知错误。");
  }
}

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("注销过程中发生了未知错误。");
  }
}

// 更新用户信息
export async function updateUser({
  username,
  avatar,
  password,
}: UpdateUserDataFormInput) {
  try {
    // 1. 更新用户的密码和姓名
    let updateData = {};
    if (password) updateData = { password };
    if (username) updateData = { data: { username } };

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) throw new Error(`更新用户信息失败： ${error.message}`);
    if (!avatar || avatar.length === 0) return data;

    // 2. 如何用户更新了头像，则上传头像
    const file = avatar[0];
    const generateImageName = (file: File): string => {
      // const namePrefix = cnToEnSlug(file.name.split(".")[0]);
      const nameParts = file.name.split(".");
      // 保留原文件扩展名，避免格式不匹配
      const ext = nameParts.length > 1 ? nameParts.pop()! : "jpg";
      const namePrefix = cnToEnSlug(nameParts.join("."));
      const uuid = crypto.randomUUID();
      // return `${namePrefix}-${uuid}.jpg`.replaceAll("/", "");
      return `${namePrefix}-${uuid}.${ext}`.replaceAll("/", "");
    };
    // https://ssaqafewdtcpnbgshmzb.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
    const imageName = generateImageName(file);
    const imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${imageName}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(imageName, file);

    if (storageError) {
      throw new Error(`上传头像失败：${storageError.message}`);
    }

    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser(
      {
        data: {
          avatar: imagePath,
        },
      },
    );

    if (error2) {
      // 回滚：用户信息更新失败，删除已上传的图片
      await supabase.storage.from("avatars").remove([imageName]);
      throw new Error(`更新用户信息失败: ${error2.message}`);
    }
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("更新用户信息过程中发生了未知错误。");
  }
}
