import { cnToEnSlug } from "../lib/utils/helpers";
import type { CabinInput } from "../types/types";
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  // 从 Supabase 获取所有 cabin 数据
  const { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error("Error fetching cabins:", error);
    throw new Error("获取 cabin 失败");
  }
  return cabins || [];
}

// 前端要向 API 请求删除 cabin 数据时，要记得开启 RLS 权限，否则会报错
export async function delCabin(id: string | number) {
  try {
    // 1. 获取旧 cabin 数据
    const { data: oldCabin, error: fetchError } = await supabase
      .from("cabins")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`获取旧 cabin 数据失败: ${fetchError.message}`);
    }

    // 2. 删除 cabin 记录
    const { data, error } = await supabase.from("cabins").delete().eq("id", id);
    if (error) {
      console.error("Error deleting cabin:", error);
      throw new Error("删除 cabin 失败");
    }

    // 3. 删除旧图片
    const oldImageName = oldCabin?.image.split("/")?.pop();
    await supabase.storage.from("cabin-images").remove([oldImageName]);
    return data;
  } catch (err) {
    console.error("Delete cabin error:", err);
    throw err instanceof Error
      ? err
      : new Error("删除 cabin 过程中发生未知错误");
  }
}

/*
1. 创建 cabin 数据
2. 上传图片到 Supabase 存储
 */
export async function createCabin(newCabin: CabinInput) {
  // 1. 校验图片
  if (typeof newCabin.image === "string") {
    throw new Error("请选择要上传的图片");
  }

  const file = newCabin.image[0];
  if (!file) {
    throw new Error("请选择要上传图片");
  }

  // 2. 生成图片文件名
  const generateImageName = (file: File): string => {
    const namePrefix = cnToEnSlug(file.name.split(".")[0]);
    const uuid = crypto.randomUUID();
    return `${namePrefix}-${uuid}.jpg`.replaceAll("/", "");
  };

  // https://ssaqafewdtcpnbgshmzb.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  const imageName = generateImageName(file);
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  try {
    // 优化：先上传图片，再创建记录（避免回滚）
    const { error: uploadError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, file);

    if (uploadError) {
      throw new Error(`上传图片失败: ${uploadError.message}`);
    }

    // 图片上传成功后再创建 cabin 记录
    const { data, error } = await supabase
      .from("cabins")
      .insert({ ...newCabin, image: imagePath })
      .select();

    if (error) {
      // 创建记录失败，需要删除已上传的图片
      await supabase.storage.from("cabin-images").remove([imageName]);
      throw new Error(`创建 cabin 失败: ${error.message}`);
    }

    return data;
  } catch (err) {
    // 统一错误处理
    console.error("Create cabin error:", err);
    throw err instanceof Error
      ? err
      : new Error("创建 cabin 过程中发生未知错误");
  }
}

export async function updateCabin(newCabin: CabinInput, id: string | number) {
  // 图片名称生成工具函数
  const generateImageName = (file: File): string => {
    const namePrefix = cnToEnSlug(file.name.split(".")[0]);
    const uuid = crypto.randomUUID();
    return `${namePrefix}-${uuid}.jpg`.replaceAll("/", "");
  };

  // 获取旧的 cabin 数据，以便删除旧图片
  const { data: oldCabin, error: fetchError } = await supabase
    .from("cabins")
    .select("image")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(`获取旧 cabin 数据失败: ${fetchError.message}`);
  }

  const oldImagePath = oldCabin?.image;

  // 处理图片逻辑
  let imagePath;
  let newImageName: string | null = null;

  if (typeof newCabin.image === "string") {
    // 用户没有上传新图片，使用原图片路径
    imagePath = newCabin.image;
  } else {
    // 用户上传了新图片
    const file = newCabin.image[0];
    if (!file) throw new Error("请选择有效的图片文件");
    newImageName = generateImageName(file);
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${newImageName}`;

    // 上传图片到存储
    const { error: uploadError } = await supabase.storage
      .from("cabin-images")
      .upload(newImageName, file);

    if (uploadError) {
      throw new Error(`上传图片失败: ${uploadError.message}`);
    }
  }

  try {
    // 更新 cabin 数据
    const { data, error } = await supabase
      .from("cabins")
      .update({ ...newCabin, image: imagePath })
      .eq("id", id);

    if (error) {
      // 更新失败，删除刚上传的新图片（如果有的话）
      if (newImageName) {
        await supabase.storage.from("cabin-images").remove([newImageName]);
      }
      throw new Error(`更新 cabin 失败: ${error.message}`);
    }

    // 更新成功，如果上传了新图片且有旧图片，删除旧图片
    if (newImageName && oldImagePath) {
      const oldImageName = oldImagePath.split("/")?.pop();
      if (oldImageName && oldImageName !== newImageName) {
        await supabase.storage.from("cabin-images").remove([oldImageName]);
      }
    }

    return data;
  } catch (err) {
    console.error("Update cabin error:", err);
    throw err instanceof Error
      ? err
      : new Error("更新 cabin 过程中发生未知错误");
  }
}
