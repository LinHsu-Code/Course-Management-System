import Head from 'next/head'
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Rate,
  Row,
  Select,
  Tag,
  Tooltip,
  Upload,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { FormListFieldData } from 'antd/lib/form/FormList'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import EditableItem from '../../../../components/common/editableText'
import { Country, TeacherProfile } from '../../../../lib/model'
import { beforeUploadAvatar, getBase64 } from '../../../../lib/util'
import addressOptions from '../../../../public/address.json'
import styled from 'styled-components'
import {
  Gender,
  PROGRAM_LANGUAGE_COLORS,
  SkillLevels,
} from '../../../../lib/constants'
import { getCountries, getProfile, editProfile } from '../../../../lib/request'
import { getUserInfo } from '../../../../lib/util'
import moment from 'moment'
import type { UploadFile } from 'antd/es/upload/interface'
import { RcFile } from 'antd/lib/upload'

export const OverviewIconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`

export const OverviewCol = styled(Col)`
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`

export const Indicator = styled.div`
  position: relative;
  left: 50%,
  margin-top: 10px;
  transform: translateX(50%);
`

// type Profile = TeacherProfile &
//   Pick<Teacher, 'country' | 'email' | 'name' | 'phone' | 'skills'>

export default function Page() {
  const [data, setData] = useState<TeacherProfile | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const userInfo = getUserInfo()

  const updateProfile = (value: Partial<TeacherProfile>) => {
    if (value.birthday) {
      value.birthday = moment(value.birthday).format('YYYY-MM-DD')
    }

    console.log('value:', value)

    data &&
      editProfile({ id: data.id, ...value }).then((res) => {
        if (res.data) {
          setData(res.data)
        }
      })
  }

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  useEffect(() => {
    userInfo.userId &&
      getProfile().then((res) => {
        if (res.data) {
          setData(res.data)
          const avatar = res.data.avatar
            ? [
                {
                  uid: '1',
                  name: 'cover',
                  url: res.data.avatar,
                  response: { url: res.data.avatar },
                },
              ]
            : []
          setFileList(avatar)
        }
      })

    getCountries().then((res) => {
      if (res.data) {
        setCountries(res.data)
      }
    })
  }, [userInfo.userId])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Profile'}</title>
      </Head>
      <Card
        title="My Profile"
        extra={
          <Tooltip title="Double click content to edit" placement="left">
            <QuestionCircleOutlined />
          </Tooltip>
        }
      >
        <ImgCrop rotate shape="round">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUploadAvatar}
            onPreview={handlePreview}
            onChange={({ fileList: newFileList, file }) => {
              if (file?.response) {
                const { url } = file.response

                updateProfile({ avatar: url as string })
              }
              setFileList(newFileList)
            }}
          >
            {!fileList.length && '+ Upload'}
          </Upload>
        </ImgCrop>

        <Divider />

        {data && (
          <>
            <Descriptions
              title="Basic Info"
              column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item
                label="Name"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem
                  allowEnterToSave
                  onSave={updateProfile}
                  textNode={data?.name}
                >
                  <Form.Item
                    initialValue={data?.name}
                    rules={[{ required: true }]}
                    name="name"
                  >
                    <Input />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item
                label="Birthday"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem
                  textNode={moment(data?.birthday).format('YYYY-MM-DD')}
                  onSave={updateProfile}
                >
                  <Form.Item
                    name="birthday"
                    initialValue={moment(data?.birthday)}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item
                label="Gender"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem
                  textNode={Gender[data?.gender]}
                  onSave={updateProfile}
                >
                  <Form.Item name="gender" initialValue={data?.gender}>
                    <Radio.Group>
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item
                label="Phone"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem textNode={data?.phone} onSave={updateProfile}>
                  <Form.Item name="phone" initialValue={data?.phone}>
                    <Input />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item
                label="Email"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto', color: ' #ADB5BD' }}
              >
                {data?.email}
              </Descriptions.Item>

              <Descriptions.Item
                label="Country"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem textNode={data?.country} onSave={updateProfile}>
                  <Form.Item name="country" initialValue={data?.country}>
                    <Select>
                      {countries.map((item, index) => (
                        <Select.Option value={item.en} key={index}>
                          {item.en}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item
                label="Address"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem
                  textNode={data?.address.join(' ')}
                  onSave={updateProfile}
                >
                  <Form.Item name="address">
                    <Cascader
                      options={addressOptions}
                      fieldNames={{
                        label: 'name',
                        value: 'name',
                        children: 'children',
                      }}
                    />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Introduction" column={6} layout="vertical">
              <Descriptions.Item label="Skills" span={3}>
                <EditableItem
                  textContainerStyles={{ width: '100%' }}
                  textNode={data?.skills.map((item, index) => (
                    <Row
                      gutter={[16, 24]}
                      key={index}
                      style={{ marginBottom: 8 }}
                    >
                      <Col span={4}>
                        <Tag
                          color={PROGRAM_LANGUAGE_COLORS[index]}
                          key={item.name}
                          style={{ padding: '5px 10px' }}
                        >
                          {item.name}
                        </Tag>
                      </Col>
                      <Col offset={1}>
                        <Rate
                          value={item.level}
                          tooltips={SkillLevels}
                          count={5}
                          disabled
                        />
                      </Col>
                    </Row>
                  ))}
                  onSave={updateProfile}
                  initialValues={{ skills: data?.skills }}
                  layout="column"
                >
                  <Form.List name="skills">
                    {(fields: FormListFieldData[], { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={[16, 24]} key={field.key}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'name']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Skill Name" />
                              </Form.Item>
                            </Col>

                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'level']}
                                rules={[{ required: true }]}
                              >
                                <Rate tooltips={SkillLevels} count={5} />
                              </Form.Item>
                            </Col>

                            <Col span={2}>
                              <Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(field.name)
                                    } else {
                                      message.warn(
                                        'You must set at least one skill.'
                                      )
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}

                        <Row>
                          <Col span={20}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                size="large"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Skill
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Intro" span={3}>
                <EditableItem
                  textNode={data?.description}
                  onSave={updateProfile}
                  layout="column"
                >
                  <Form.Item
                    name="description"
                    initialValue={data?.description}
                  >
                    <TextArea />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Descriptions title="Education" layout="vertical" column={3}>
              <Descriptions.Item span={3}>
                {data?.education.map((item, index) => (
                  <Row
                    gutter={[16, 24]}
                    key={index}
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={5}>{item.startAt}</Col>
                    <Col span={5}>{item.endAt}</Col>
                    <Col span={5}>{item.degree}</Col>
                    <Col span={5}>{item.level}</Col>
                  </Row>
                ))}
              </Descriptions.Item>
            </Descriptions>

            {/* <Descriptions title="Education" layout="vertical">
              <Descriptions.Item>
                <EditableItem
                  textContainerStyles={{ width: '100%' }}
                  textNode={data?.education.map((item, index) => (
                    <Row
                      gutter={[16, 24]}
                      key={index}
                      style={{ marginBottom: 8 }}
                    >
                      <Col span={5}>{item.startAt}</Col>
                      <Col span={5}>{item.endAt}</Col>
                      <Col span={5}>{item.degree}</Col>
                      <Col span={5}>{item.level}</Col>
                    </Row>
                  ))}
                  onSave={updateProfile}
                  initialValues={{ education: data?.education }}
                  layout="column"
                >
                  <Form.List name="education">
                    {(fields: FormListFieldData[], { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={[16, 24]} key={field.key}>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'startAt']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="start at" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'endAt']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="end at" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'degree']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="degree" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'level']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="level" />
                              </Form.Item>
                            </Col>

                            <Col span={4}>
                              <Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(field.name)
                                    } else {
                                      message.warn(
                                        'You must set at least one degree.'
                                      )
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}

                        <Row>
                          <Col span={20}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                size="large"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Education
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </EditableItem>
              </Descriptions.Item>
            </Descriptions> */}

            <Divider />
            <Descriptions title="Work Experience" layout="vertical">
              <Descriptions.Item>
                {data?.workExperience.map((item, index) => (
                  <Row
                    gutter={[16, 24]}
                    key={index}
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={5}>{item.startAt}</Col>
                    <Col span={5}>{item.endAt}</Col>
                    <Col span={5}>{item.company}</Col>
                    <Col span={5}>{item.post}</Col>
                  </Row>
                ))}
              </Descriptions.Item>
            </Descriptions>

            {/* <Descriptions title="Work Experience" layout="vertical">
              <Descriptions.Item>
                <EditableItem
                  textContainerStyles={{ width: '100%' }}
                  textNode={data?.workExperience.map((item, index) => (
                    <Row
                      gutter={[16, 24]}
                      key={index}
                      style={{ marginBottom: 8 }}
                    >
                      <Col span={5}>{item.startAt}</Col>
                      <Col span={5}>{item.endAt}</Col>
                      <Col span={5}>{item.company}</Col>
                      <Col span={5}>{item.post}</Col>
                    </Row>
                  ))}
                  onSave={updateProfile}
                  initialValues={{ workExperience: data?.workExperience }}
                  layout="column"
                >
                  <Form.List name="workExperience">
                    {(fields: FormListFieldData[], { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={[16, 24]} key={field.key}>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'startAt']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="start at" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'endAt']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="end at" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'company']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="company" />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'post']}
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="post" />
                              </Form.Item>
                            </Col>

                            <Col span={4}>
                              <Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(field.name)
                                    } else {
                                      message.warn(
                                        'You must set at least one work experience.'
                                      )
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}

                        <Row>
                          <Col span={20}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                size="large"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Education
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </EditableItem>
              </Descriptions.Item>
            </Descriptions> */}
          </>
        )}
      </Card>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}
