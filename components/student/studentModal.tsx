import { Modal, Select, Form, Input } from 'antd'
import { time } from 'console'
import { CountryList } from '../../lib/contants'

export default function StudentModal(props: any) {
  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <Modal
        title="Add Student"
        cancelText="Cancel"
        okText="Add"
        destroyOnClose
        centered
        visible={props.isModalVisible}
        onOk={() => props.setIsModalVisible(false)}
        onCancel={() => props.setIsModalVisible(false)}
      >
        <Form
          name="student_modal"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={
            {
              // remember: true,
            }
          }
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
    </>
  )
}
