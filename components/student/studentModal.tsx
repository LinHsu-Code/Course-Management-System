import { Modal, Select, Form, Input } from 'antd'
import { CountryList } from '../../lib/constants'
import { AddStudent } from '../../lib/model'
import { addStudent } from '../../lib/httpRequest'

export default function StudentModal(props: any) {
  const [form] = Form.useForm()
  const handleOk = async () => {
    const formData: AddStudent = form.getFieldsValue(true)
    const res = await addStudent(formData)
    if (res.data) {
      form.resetFields()
      props.setIsModalVisible(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    props.setIsModalVisible(false)
  }
  return (
    <Modal
      title="Add Student"
      cancelText="Cancel"
      okText="Add"
      destroyOnClose={true}
      centered={true}
      visible={props.isModalVisible}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
    >
      <Form
        name="student_modal"
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={
          {
            // remember: true,
          }
        }
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Area"
          name="country"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            {CountryList.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Student Type"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            <Select.Option value={1}>Tester</Select.Option>
            <Select.Option value={2}>Developer</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
