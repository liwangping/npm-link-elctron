import React, { useState } from 'react'
import { Table, Input, Popconfirm, Form, Button, Switch } from 'antd'

interface Item {
  key: string
  name: string
  path: string
  isOpen: boolean
}

const originData: Item[] = []
for (let i = 0; i <= 2; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    path: 'test',
    isOpen: false
  })
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'text'
  record: Item
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`
            }
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const LinksFormTable = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')

  const isEditing = (record: Item) => record.key === editingKey

  const onEdit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
    setEditingKey(record.key)
  }

  const onCancel = () => {
    setEditingKey('')
  }

  const onSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item

      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const onSwitchOpenStatus = async (key: React.Key, isOpen: boolean) => {
    try {
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      const item = newData.find((item) => key === item.key) as Item
      newData.splice(index, 1, {
        ...item,
        isOpen
      })
      setData(newData)
    } catch (errInfo) {
      console.log('Switch Open Status Failed:', errInfo)
    }
  }

  const onAddLinkRule = () => {
    const newData = [...data]
    const newLinkRuleKey = newData.length.toString()
    newData.push({
      key: newLinkRuleKey,
      name: '',
      path: '',
      isOpen: false
    })
    setData(newData)
    form.setFieldsValue({
      key: newLinkRuleKey,
      name: '',
      path: '',
      isOpen: false
    })
    setEditingKey(newLinkRuleKey)
  }

  const onDeleteLinkRule = (key: React.Key) => {
    try {
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      newData.splice(index, 1)
      setData(newData)
    } catch (errInfo) {
      console.log('delete Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: '包名',
      dataIndex: 'name',
      width: 200,
      editable: true
    },
    {
      title: '包地址',
      dataIndex: 'path',
      width: 400,
      editable: true
    },
    {
      title: '是否启用',
      dataIndex: 'isOpen',
      width: 100,
      render: (_: any, record: Item) => {
        return (
          <span>
            <Switch
              disabled={editingKey !== ''}
              defaultChecked
              checked={record.isOpen}
              onChange={(value) => onSwitchOpenStatus(record.key, value)}
            />
          </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 250,
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => onSave(record.key)}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Button type="link" onClick={() => onCancel()}>
              取消
            </Button>
          </span>
        ) : (
          <span>
            <Button
              style={{ marginRight: 8 }}
              disabled={editingKey !== ''}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除?"
              onConfirm={() => onDeleteLinkRule(record.key)}
            >
              <Button
                disabled={editingKey !== ''}
                type="primary"
                style={{ marginRight: 8 }}
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </span>
        )
      }
    }
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ padding: '10px 0' }}>npm link命令对应规则</h2>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={onAddLinkRule}
        >
          增加新的npm link规则
        </Button>
      </Form>
    </div>
  )
}

export default LinksFormTable
