import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Modal, Select, Form, Input, Row, Col, Slider, Button } from 'antd'
import { Dispatch, SetStateAction } from 'react'
import { COUNTRY_LIST, phone, SkillLevels } from '../../lib/constants'
import { EditTeacherRequest, Teacher } from '../../lib/model'
import { addTeacher, editTeacher } from '../../lib/request'

// const prefixSelector = (
//   <Form.Item name="prefix" initialValue="86" noStyle>
//     <Select style={{ width: 70 }}>
//       <Select.Option value="86">+86</Select.Option>
//       <Select.Option value="87">+87</Select.Option>
//     </Select>
//   </Form.Item>
// )

export default function TeacherModal({
  editContent,
  setIsModalVisible,
  setData,
}: {
  editContent: Teacher | null
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<Teacher[]>>
}) {
  const [form] = Form.useForm()

  const handleOk = async () => {
    const formData: EditTeacherRequest = form.getFieldsValue(true)
    const res = editContent
      ? await editTeacher(formData)
      : await addTeacher(formData)

    if (res.data) {
      editContent &&
        setData((prev) => {
          const index = prev.findIndex((item) => item.id === formData.id)
          if (index !== -1) {
            prev[index] = res.data
          }
          return [...prev]
        })
      handleClose()
    }
  }

  const handleClose = () => {
    setIsModalVisible(false)
  }

  return (
    <Modal
      title={editContent ? 'Edit Teacher' : 'Add Teacher'}
      cancelText="Cancel"
      okText={editContent ? 'Update' : 'Add'}
      centered={true}
      visible
      onOk={() => handleOk()}
      onCancel={() => handleClose()}
      destroyOnClose={true}
    >
      <Form
        name="teacher_modal"
        form={form}
        initialValues={{
          name: editContent?.name,
          email: editContent?.email,
          country: editContent?.country,
          phone: editContent?.phone,
          skills: editContent?.skills || [{ name: '', level: 1 }],
        }}
        preserve={false}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        autoComplete="off"
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input type="text" placeholder="teacher name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email' }, { required: true }]}
        >
          <Input type="email" placeholder="email" />
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
          label="Phone"
          name="phone"
          rules={[{ required: true }, { pattern: phone }]}
        >
          <Input
            //   addonBefore={prefixSelector}
            placeholder="mobile phone"
          />
        </Form.Item>

        <Form.Item label={<b>Skills</b>}> </Form.Item>

        <Form.List name="skills">
          {(fields, { add, remove }) => {
            console.log('fields:', fields)
            return (
              <>
                {fields.map((field) => (
                  <Row align="middle" justify="space-between" key={field.key}>
                    <Col span={7}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input style={{ textAlign: 'right' }} />
                      </Form.Item>
                    </Col>

                    <Col span={13}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'level']}
                        // initialValue={2}
                      >
                        <Slider
                          step={1}
                          min={1}
                          max={5}
                          tipFormatter={(value) =>
                            value ? SkillLevels[value] : SkillLevels[1]
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col style={{ alignSelf: 'stretch' }}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ margin: '10px 0 0 10px', color: 'red' }}
                        />
                      )}
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Skill
                  </Button>
                </Form.Item>
              </>
            )
          }}
        </Form.List>
      </Form>
    </Modal>
  )
}
