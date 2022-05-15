import { Modal, Select, Form, Input } from 'antd'
import { COUNTRY_LIST } from '../../lib/constants'
import { EditStudentRequest } from '../../lib/model'
import { addStudent, editStudent } from '../../lib/request'

export default function StudentModal(props: any) {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const formData: EditStudentRequest = form.getFieldsValue(true)
    const res =
      Object.keys(props.editContent).length === 0
        ? await addStudent(formData)
        : await editStudent(formData)

    if (res.data) {
      props.fetchStudents(props.queryParams)
      handleClose()
    }
  }

  const handleClose = () => {
    props.setIsModalVisible(false)
  }

  return (
    <Modal
      title={
        Object.keys(props.editContent).length === 0
          ? 'Add Student'
          : 'Edit Student'
      }
      cancelText="Cancel"
      okText={Object.keys(props.editContent).length === 0 ? 'Add' : 'Update'}
      centered={true}
      visible
      onOk={() => handleOk()}
      onCancel={() => handleClose()}
      destroyOnClose={true}
    >
      <Form
        name="student_modal"
        form={form}
        initialValues={props.editContent}
        preserve={false}
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
            {COUNTRY_LIST.map((item, index) => (
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
