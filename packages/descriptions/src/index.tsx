import React, { useContext, useEffect } from 'react';
import type { DescriptionsProps, FormInstance, FormProps } from 'antd';
import { Descriptions, Space, Form, ConfigProvider } from 'antd';
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import toArray from 'rc-util/lib/Children/toArray';
import ProForm, { ProFormField } from '@ant-design/pro-form';
import type {
  ProSchema,
  ProCoreActionType,
  RowEditableConfig,
  UseEditableMapUtilType,
  ProFieldValueType,
  ProSchemaComponentTypes,
} from '@ant-design/pro-utils';
import {
  InlineErrorFormItem,
  LabelIconTip,
  useEditableMap,
  ErrorBoundary,
  getFieldPropsOrFormItemProps,
} from '@ant-design/pro-utils';
import get from 'rc-util/lib/utils/get';
import { stringify } from 'use-json-comparison';
import ProSkeleton from '@ant-design/pro-skeleton';
import type { RequestData } from './useFetchData';
import useFetchData from './useFetchData';
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import type { LabelTooltipType } from 'antd/lib/form/FormItemLabel';

import './index.less';

// todo remove it
export interface DescriptionsItemProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  children: React.ReactNode;
  span?: number;
}

export type ProDescriptionsItemProps<T = Record<string, any>, ValueType = 'text'> = ProSchema<
  T,
  Omit<DescriptionsItemProps, 'children'> & {
    // 隐藏这个字段，是个语法糖，方便一下权限的控制
    hide?: boolean;
    plain?: boolean;
    copyable?: boolean;
    ellipsis?: boolean;
    mode?: ProFieldFCMode;
    children?: React.ReactNode;
    order?: number;
  },
  ProSchemaComponentTypes,
  ValueType
>;
export type ProDescriptionsActionType = ProCoreActionType;

export type ProDescriptionsProps<
  RecordType = Record<string, any>,
  ValueType = 'text',
> = DescriptionsProps & {
  /** Params 参数 params 改变的时候会触发 reload */
  params?: Record<string, any>;
  /** 网络请求报错 */
  onRequestError?: (e: Error) => void;
  /** 获取数据的方法 */
  request?: (params: Record<string, any>) => Promise<RequestData>;

  columns?: ProDescriptionsItemProps<RecordType, ValueType>[];

  /** 一些简单的操作 */
  actionRef?: React.MutableRefObject<ProCoreActionType<any> | undefined>;

  loading?: boolean;

  onLoadingChange?: (loading?: boolean) => void;

  tooltip?: LabelTooltipType | string;
  /** @deprecated 你可以使用 tooltip，这个更改是为了与 antd 统一 */
  tip?: string;
  /** Form props 的相关配置 */
  formProps?: FormProps;
  /** @name 编辑相关的配置 */
  editable?: RowEditableConfig<RecordType>;
  /** 默认的数据源 */
  dataSource?: RecordType;
  /** 受控数据源改变 */
  onDataSourceChange?: (value: RecordType) => void;
};

/**
 * 根据 dataIndex 获取值，支持 dataIndex 为数组
 *
 * @param item
 * @param entity
 */
const getDataFromConfig = (item: ProDescriptionsItemProps, entity: any) => {
  const { dataIndex } = item;
  if (dataIndex) {
    const data = Array.isArray(dataIndex)
      ? get(entity, dataIndex as string[])
      : entity[dataIndex as string];

    if (data !== undefined || data !== null) {
      return data;
    }
  }
  return item.children as string;
};

/**
 * 这里会处理编辑的功能
 *
 * @param props
 */
export const FieldRender: React.FC<
  ProDescriptionsItemProps<any> & {
    text: any;
    valueType: ProFieldValueType;
    entity: any;
    action: ProCoreActionType<any>;
    index: number;
    editableUtils?: UseEditableMapUtilType;
  }
> = (props) => {
  const {
    valueEnum,
    action,
    index,
    text,
    entity,
    mode,
    render,
    editableUtils,
    valueType,
    plain,
    dataIndex,
    request,
    renderFormItem,
    params,
  } = props;

  const fieldConfig = {
    text,
    valueEnum,
    mode: mode || 'read',
    proFieldProps: {
      render: render
        ? () =>
            render?.(text, entity, index, action, {
              ...props,
              type: 'descriptions',
            })
        : undefined,
    },
    ignoreFormItem: true,
    valueType,
    request,
    params,
    plain,
  };

  /** 如果是只读模式，fieldProps 的 form是空的，所以需要兜底处理 */
  if (mode === 'read' || !mode || valueType === 'option') {
    const fieldProps = getFieldPropsOrFormItemProps(props.fieldProps, undefined, {
      ...props,
      rowKey: dataIndex,
      isEditable: false,
    });

    return <ProFormField name={dataIndex} {...fieldConfig} fieldProps={fieldProps} />;
  }

  return (
    <div
      style={{
        marginTop: -5,
        marginBottom: -5,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <Form.Item noStyle shouldUpdate>
        {(form: FormInstance<any>) => {
          const formItemProps = getFieldPropsOrFormItemProps(props.formItemProps, form, {
            ...props,
            rowKey: dataIndex,
            isEditable: true,
          });
          const fieldProps = getFieldPropsOrFormItemProps(props.fieldProps, form, {
            ...props,
            rowKey: dataIndex,
            isEditable: true,
          });
          const dom = renderFormItem
            ? renderFormItem?.(
                {
                  ...props,
                  type: 'descriptions',
                },
                {
                  isEditable: true,
                  recordKey: dataIndex,
                  record: form.getFieldValue([dataIndex].flat(1) as React.ReactText[]),
                  defaultRender: () => <ProFormField {...fieldConfig} fieldProps={fieldProps} />,
                  type: 'descriptions',
                },
                form,
              )
            : undefined;
          return (
            <Space>
              <InlineErrorFormItem
                style={{
                  margin: 0,
                }}
                name={dataIndex}
                {...formItemProps}
                initialValue={text || formItemProps?.initialValue}
              >
                {dom || (
                  <ProFormField
                    {...fieldConfig}
                    // @ts-ignore
                    proFieldProps={{ ...fieldConfig.proFieldProps }}
                    fieldProps={fieldProps}
                  />
                )}
              </InlineErrorFormItem>
              {editableUtils?.actionRender?.(dataIndex || index, form as FormInstance<any>, {
                cancelText: <CloseOutlined />,
                saveText: <CheckOutlined />,
                deleteText: false,
              })}
            </Space>
          );
        }}
      </Form.Item>
    </div>
  );
};

const schemaToDescriptionsItem = (
  items: ProDescriptionsItemProps<any>[],
  entity: any,
  action: ProCoreActionType<any>,
  editableUtils?: UseEditableMapUtilType,
) => {
  const options: JSX.Element[] = [];
  // 因为 Descriptions 只是个语法糖，children 是不会执行的，所以需要这里处理一下
  const children = items
    ?.map?.((item, index) => {
      if (React.isValidElement(item)) {
        return item;
      }
      const {
        valueEnum,
        render,
        renderText,
        mode,
        plain,
        dataIndex,
        request,
        params,
        editable,
        ...restItem
      } = item as ProDescriptionsItemProps;

      const title =
        typeof restItem.title === 'function'
          ? restItem.title(item, 'descriptions', restItem.title)
          : restItem.title;

      const defaultData = getDataFromConfig(item, entity) ?? restItem.children;
      const text = renderText ? renderText(defaultData, entity, index, action) : defaultData;

      //  dataIndex 无所谓是否存在
      // 有些时候不需要 dataIndex 可以直接 render
      const valueType =
        typeof restItem.valueType === 'function'
          ? (restItem.valueType(entity || {}, 'descriptions') as ProFieldValueType)
          : (restItem.valueType as ProFieldValueType);

      const isEditable = editableUtils?.isEditable(dataIndex || index);

      const fieldMode = mode || isEditable ? 'edit' : 'read';

      const showEditIcon =
        editableUtils &&
        fieldMode === 'read' &&
        editable !== false &&
        editable?.(text, entity, index) !== false;

      const Component = showEditIcon ? Space : React.Fragment;
      const field = (
        <Descriptions.Item
          {...restItem}
          key={restItem.label?.toString() || index}
          label={
            (title || restItem.label || restItem.tooltip || restItem.tip) && (
              <LabelIconTip
                label={title || restItem.label}
                tooltip={restItem.tooltip || restItem.tip}
              />
            )
          }
        >
          <Component>
            <FieldRender
              {...item}
              dataIndex={item.dataIndex || index}
              mode={fieldMode}
              text={text}
              valueType={valueType}
              entity={entity}
              index={index}
              action={action}
              editableUtils={editableUtils}
            />
            {showEditIcon && valueType !== 'option' && (
              <EditOutlined
                onClick={() => {
                  editableUtils?.startEditable(dataIndex || index);
                }}
              />
            )}
          </Component>
        </Descriptions.Item>
      );
      // 如果类型是 option 自动放到右上角
      if (valueType === 'option') {
        options.push(field);
        return null;
      }
      return field;
    })
    .filter((item) => item);
  return {
    // 空数组传递还是会被判定为有值
    options: options?.length ? options : null,
    children,
  };
};

const ProDescriptionsItem: React.FC<ProDescriptionsItemProps> = (props) => {
  return <Descriptions.Item {...props}>{props.children}</Descriptions.Item>;
};

const DefaultProDescriptionsDom = (dom: { children: any }) => dom.children;

const ProDescriptions = <RecordType extends Record<string, any>, ValueType = 'text'>(
  props: ProDescriptionsProps<RecordType, ValueType>,
) => {
  const {
    request,
    columns,
    params = {},
    dataSource,
    onDataSourceChange,
    formProps,
    editable,
    loading,
    onLoadingChange,
    actionRef,
    onRequestError,
    ...rest
  } = props;

  const context = useContext(ConfigProvider.ConfigContext);

  const action = useFetchData<RequestData>(
    async () => {
      const data = request ? await request(params) : { data: {} };
      return data;
    },
    {
      onRequestError,
      effects: [stringify(params)],
      manual: !request,
      dataSource,
      loading,
      onLoadingChange,
      onDataSourceChange,
    },
  );

  /*
   * 可编辑行的相关配置
   */
  const editableUtils = useEditableMap<any>({
    ...props.editable,
    childrenColumnName: undefined,
    dataSource: action.dataSource,
    setDataSource: action.setDataSource,
  });

  /** 支持 reload 的功能 */
  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        reload: action.reload,
        ...editableUtils,
      };
    }
  }, [action, actionRef, editableUtils]);

  // loading 时展示
  // loading =  undefined 但是 request 存在时也应该展示
  if (action.loading || (action.loading === undefined && request)) {
    return <ProSkeleton type="descriptions" list={false} pageHeader={false} />;
  }

  const getColumns = () => {
    // 因为 Descriptions 只是个语法糖，children 是不会执行的，所以需要这里处理一下
    const childrenColumns = toArray(props.children).map((item) => {
      const {
        valueEnum,
        valueType,
        dataIndex,
        request: itemRequest,
      } = item.props as ProDescriptionsItemProps;

      if (!valueType && !valueEnum && !dataIndex && !itemRequest) {
        return item;
      }

      return {
        ...item.props,
        entity: dataSource,
      };
    });
    return [...(columns || []), ...childrenColumns]
      .filter((item) => {
        if (['index', 'indexBorder'].includes(item?.valueType)) {
          return false;
        }
        return !item?.hideInDescriptions;
      })
      .sort((a, b) => {
        if (b.order || a.order) {
          return (b.order || 0) - (a.order || 0);
        }
        return (b.index || 0) - (a.index || 0);
      });
  };

  const { options, children } = schemaToDescriptionsItem(
    getColumns(),
    action.dataSource || {},
    actionRef?.current || action,
    editable ? editableUtils : undefined,
  );

  /** 如果不是可编辑模式，没必要注入 ProForm */
  const FormComponent = editable ? ProForm : DefaultProDescriptionsDom;

  /** 即使组件返回null了, 在传递的过程中还是会被Description检测到为有值 */
  let title = null;
  if (rest.title || rest.tooltip || rest.tip) {
    title = <LabelIconTip label={rest.title} tooltip={rest.tooltip || rest.tip} />;
  }

  const className = context.getPrefixCls('pro-descriptions');
  return (
    <ErrorBoundary>
      <FormComponent
        key="form"
        form={props.editable?.form}
        component={false}
        submitter={false}
        {...formProps}
        onFinish={undefined}
      >
        <Descriptions
          className={className}
          {...rest}
          extra={
            rest.extra ? (
              <Space>
                {options}
                {rest.extra}
              </Space>
            ) : (
              options
            )
          }
          title={title}
        >
          {children}
        </Descriptions>
      </FormComponent>
    </ErrorBoundary>
  );
};

ProDescriptions.Item = ProDescriptionsItem;

export default ProDescriptions;
