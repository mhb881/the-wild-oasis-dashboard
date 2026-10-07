import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import type { SettingInput } from "../../types/types";
import { Form, FormRow, Input, Label, Spinner } from "../../ui";
import useSettings from "./useSettings";
import useUpdateSettings from "./useUpdateSettings";
/*
问题

问题原因：
当页面刷新时，useForm 的 defaultValues 在组件挂载时只设置一次，
但此时 settings 数据还未加载完成（处于 isPending 状态），导致初始默认值为 undefined。
后续数据加载完成后，表单值不会自动更新。

解决方案：
使用 useForm 的 reset 函数配合 useEffect，在 settings 数据加载完成后动态重置表单值。
   */

function UpdateSettingsForm() {
  const { settings, isPending } = useSettings();
  const { isUpdating, updateSettingsMutate } = useUpdateSettings();

  const { register, formState, reset, trigger, getValues } =
    useForm<SettingInput>({
      defaultValues: settings,
    });
  const { errors } = formState;

  const handleOnBlur = async (field: keyof SettingInput) => {
    const value = getValues(field);
    if (!value) return;
    if (!settings || Number(settings[field]) === Number(value)) return;
    // 先触发该字段的验证
    const isValid = await trigger(field);
    if (isValid) {
      // 验证通过后，获取当前表单所有值并更新
      const formValues = getValues();
      updateSettingsMutate(formValues);
    }
  };

  // 只在组件首次挂载时初始化表单值
  const isInitialized = useRef(false);
  useEffect(() => {
    if (settings && !isInitialized.current) {
      reset(settings);
      isInitialized.current = true;
    }
  }, [reset, settings]);

  if (isPending) return <Spinner />;

  return (
    <Form>
      <FormRow error={errors.minBookingLength?.message}>
        <Label htmlFor="min-nights">最小入住天数</Label>
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          {...register("minBookingLength", {
            required: { value: true, message: "请输入最小入住天数" },
            min: 1,
          })}
          onBlur={(e) => {
            handleOnBlur("minBookingLength");
          }}
        />
      </FormRow>
      <FormRow error={errors.maxBookingLength?.message}>
        <Label htmlFor="max-nights">最大入住天数</Label>
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdating}
          {...register("maxBookingLength", {
            required: { value: true, message: "请输入最大入住天数" },
            min: 1,
          })}
          onBlur={(e) => {
            handleOnBlur("maxBookingLength");
          }}
        />
      </FormRow>
      <FormRow error={errors.maxGuestsPerBooking?.message}>
        <Label htmlFor="max-guests">最大入住人数</Label>
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdating}
          {...register("maxGuestsPerBooking", {
            required: { value: true, message: "请输入最大入住人数" },
            min: 1,
          })}
          onBlur={(e) => {
            handleOnBlur("maxGuestsPerBooking");
          }}
        />
      </FormRow>
      <FormRow error={errors.breakfastPrice?.message}>
        <Label htmlFor="breakfast-price">早餐价格</Label>
        <Input
          type="number"
          id="breakfast-price"
          disabled={isUpdating}
          {...register("breakfastPrice", {
            required: { value: true, message: "请输入早餐价格" },
            min: { value: 0, message: "不能为负数" },
          })}
          onBlur={(e) => {
            handleOnBlur("breakfastPrice");
          }}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
