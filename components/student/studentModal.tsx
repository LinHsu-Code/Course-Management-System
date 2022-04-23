import { Modal, Select, Form, Input } from 'antd'
import { CountryList } from '../../lib/constants'
import { AddStudentRequest } from '../../lib/model'
import { addStudent } from '../../lib/httpRequest'

export default function StudentModal(props: any) {
  const [form] = Form.useForm()
  props.isEdit && form.setFieldsValue(props.editContent)

  const handleOk = async () => {
    const formData: AddStudentRequest = form.getFieldsValue(true)
    const res = await addStudent(formData)
    if (res.data) {
      form.resetFields()
      props.setIsModalVisible(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    props.isEdit && props.setIsEdit(false)
    props.setIsModalVisible(false)
  }

  return (
    <Modal
      title={props.isEdit ? 'Edit Student' : 'Add Student'}
      cancelText="Cancel"
      okText={props.isEdit ? 'Update' : 'Add'}
      destroyOnClose
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
