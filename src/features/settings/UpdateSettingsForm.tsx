import { useForm } from "react-hook-form";

import type { SettingInput } from "../../types/types";
import { Empty, Form, FormRow, Input, Label, Spinner } from "../../ui";
import useSettings from "./useSettings";
import useUpdateSettings from "./useUpdateSettings";

function UpdateSettingsForm() {
  const { settings, isPending, error } = useSettings();
  const { isUpdating, updateSettingsMutate } = useUpdateSettings();

  const { register, formState, trigger, getValues } = useForm<SettingInput>({
    values: settings,
  });
  const { errors } = formState;

  const handleOnBlur = async (field: keyof SettingInput) => {
    const value = getValues(field);
    if (value === undefined || value === null || isNaN(Number(value))) return;
    if (!settings || Number(settings[field]) === Number(value)) return;

    // 先触发该字段的验证
    const isValid = await trigger(field);
    if (isValid) {
      // 验证通过后更新字段
      updateSettingsMutate({
        [field]: Number(value),
      });
    }
  };

  if (isPending) return <Spinner />;
  if (error || !settings) return <Empty resourceName="酒店设置" />;

  return (
    <Form>
      <FormRow error={errors.minBookingLength?.message}>
        <Label htmlFor="min-nights">最小入住天数</Label>
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          defaultValue={settings.minBookingLength}
          {...register("minBookingLength", {
            required: { value: true, message: "请输入最小入住天数" },
            min: { value: 1, message: "最小入住天数至少为 1" },
            valueAsNumber: true,
          })}
          onBlur={(e) => {
            register("minBookingLength").onBlur(e);
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
          defaultValue={settings.maxBookingLength}
          {...register("maxBookingLength", {
            required: { value: true, message: "请输入最大入住天数" },
            min: { value: 1, message: "最大入住天数至少为 1" },
            valueAsNumber: true,
          })}
          onBlur={(e) => {
            register("maxBookingLength").onBlur(e);
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
          defaultValue={settings.maxGuestsPerBooking}
          {...register("maxGuestsPerBooking", {
            required: { value: true, message: "请输入最大入住人数" },
            min: { value: 1, message: "最大入住人数至少为 1" },
            valueAsNumber: true,
          })}
          onBlur={(e) => {
            register("maxGuestsPerBooking").onBlur(e);
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
          defaultValue={settings.breakfastPrice}
          {...register("breakfastPrice", {
            required: { value: true, message: "请输入早餐价格" },
            min: { value: 0, message: "不能为负数" },
            valueAsNumber: true,
          })}
          onBlur={(e) => {
            register("breakfastPrice").onBlur(e);
            handleOnBlur("breakfastPrice");
          }}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
