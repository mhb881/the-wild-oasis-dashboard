import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import type { Cabin, CabinInput } from "../../types/types";
import {
  Button,
  FileInput,
  Form,
  FormRow,
  Input,
  Label,
  Textarea,
  useOptionalModal,
} from "../../ui";
import useCreateCabin from "./useCreateCabin";
import useUpdateCabin from "./useUpdateCabin";

interface CreateCabinFormProps {
  cabinToCopy?: Cabin;
  cabinToEdit?: Cabin;
  onClose?: () => void;
}

function CreateCabinForm({
  cabinToCopy,
  cabinToEdit,
  onClose,
}: CreateCabinFormProps) {
  const modal = useOptionalModal();
  const handleClose = onClose ?? modal?.close;
  const { isCreating, createCabinMutate } = useCreateCabin();
  const { isUpdating, updateCabinMutate } = useUpdateCabin();

  // 编辑会话：从cabinToEdit中提取id和其他属性
  const { id: editId, ...editVal } = cabinToEdit || {};
  // 是否是编辑会话
  const isEditSession = Boolean(editId);
  // 创建会话：从cabinToCopy中提取所有属性
  const cabinRealCopy = { ...cabinToCopy, image: undefined, id: undefined };

  // react hook form
  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinInput>({
      defaultValues: isEditSession ? editVal : cabinRealCopy || {},
    });

  const { errors } = formState;

  // 合并提交逻辑：一个函数处理创建/编辑
  const onSubmit: SubmitHandler<CabinInput> = (data) => {
    if (isEditSession) {
      // 编辑：传递1个对象参数（符合React Query规则）
      // console.log(data);
      updateCabinMutate(
        { newCabin: data, id: editId! },
        {
          onSuccess: (data) => {
            reset();
            handleClose?.();
          },
          onError: () => {
            handleClose?.();
          },
        },
      );
    } else {
      // 创建：直接传数据
      createCabinMutate(data, {
        onSuccess: (data) => {
          reset();
          handleClose?.();
        },
        onError: () => {
          handleClose?.();
        },
      });
    }
  };

  const onError: SubmitErrorHandler<CabinInput> = (errors) => {
    console.error(errors);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={modal ? "modal" : "regular"}
    >
      <FormRow error={errors.name?.message}>
        <Label htmlFor="name">小屋名称</Label>
        <Input
          type="text"
          id="name"
          disabled={isCreating || isUpdating}
          {...register("name", {
            required: "请输入Cabin名称",
          })}
        />
      </FormRow>

      <FormRow error={errors.maxCapacity?.message}>
        <Label htmlFor="maxCapacity">最大入住人数</Label>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating || isUpdating}
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
        <Label htmlFor="regularPrice">常规价格</Label>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating || isUpdating}
          {...register("regularPrice", {
            required: "请输入常规价格",
          })}
        />
      </FormRow>

      <FormRow error={errors.discount?.message}>
        <Label htmlFor="discount">折扣</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isCreating || isUpdating}
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
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isCreating || isUpdating}
          {...register("description", {
            required: "请输入描述",
          })}
        />
      </FormRow>

      <FormRow error={errors.image?.message}>
        <Label htmlFor="image">图片</Label>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isCreating || isUpdating}
          type="file"
          {...register("image", {
            required: isEditSession ? false : "请上传图片",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <div className="col-span-3 flex w-full justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              if (handleClose) {
                handleClose();
              } else {
                reset();
              }
            }}
            disabled={isCreating || isUpdating}
          >
            {handleClose ? "取消" : "重置"}
          </Button>

          {isEditSession ? (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "更新..." : "更新民宿"}
            </Button>
          ) : (
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "创建..." : "创建民宿"}
            </Button>
          )}
        </div>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
