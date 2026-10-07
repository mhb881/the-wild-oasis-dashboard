import type { SettingInput } from "../types/types";
import supabase from "./supabase";

export async function getSettings() {
  try {
    const { data: settings, error } = await supabase
      .from("settings")
      .select("*")
      .single();
    if (error) {
      console.error("Error fetching settings:", error);
      throw new Error("获取 settings 失败");
    }
    return settings;
  } catch (err) {
    console.error("Get cabin error:", err);
    throw err instanceof Error
      ? err
      : new Error("获取 settings 过程中发生未知错误");
  }
}

export async function updateSettings(newSettings: SettingInput) {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update(newSettings)
      .eq("id", 1)
      .single();
    if (error) {
      console.error("Error updating settings:", error);
      throw new Error("更新 settings 失败");
    }
    return data;
  } catch (err) {
    console.error("Update cabin error:", err);
    throw err instanceof Error
      ? err
      : new Error("更新 settings 过程中发生未知错误");
  }
}
