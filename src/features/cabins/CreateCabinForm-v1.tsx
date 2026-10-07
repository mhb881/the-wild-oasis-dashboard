import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";

import { createCabin } from "../../services/apiCabins";
import type { CabinInput } from "../../types/types";
import { Button, FileInput, Form, FormRow, Input, Label, Textarea } from "../../ui";

function CreateCabinForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinInput>();

  const { errors } = formState;

  const { isPending: isCreating, mutate: createCabinMutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("成功创建Cabin");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: () => {
      toast.error("创建Cabin失败");
    },
  });

  const onSubmit: SubmitHandler<CabinInput> = (data) => {
    createCabinMutate(data);
  };

  const onError: SubmitErrorHandler<CabinInput> = (errors) => {
    // console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow error={errors.name?.message}>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register("name", {
            required: "请输入Cabin名称",
          })}
        />
      </FormRow>

      <FormRow error={errors.maxCapacity?.message}>
        <Label htmlFor="maxCapacity">Max Capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
          {...register("maxCapacity", {
            required: "请输入最大容量",
            min: {
              value: 1,
              message: "最大容量不能小于1",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.regularPrice?.message}>
        <Label htmlFor="regularPrice">Regular Price</Label>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating}
          {...register("regularPrice", {
            required: "请输入常规价格",
          })}
        />
      </FormRow>

      <FormRow error={errors.discount?.message}>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isCreating}
          {...register("discount", {
            required: "请输入折扣",
            validate: (val) => {
              if (val > Number(getValues().regularPrice)) {
                return "折扣不能大于常规价格";
              }
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.description?.message}>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isCreating}
          {...register("description", {
            required: "请输入描述",
          })}
        />
      </FormRow>

      <FormRow error={errors.image?.message}>
        <Label htmlFor="image">Image</Label>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isCreating}
          type="file"
          {...register("image", {
            required: "请上传图片",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <div className="col-span-3 flex w-full justify-end gap-3">
          <Button variant="secondary" type="reset">
            Reset
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create cabin"}
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
