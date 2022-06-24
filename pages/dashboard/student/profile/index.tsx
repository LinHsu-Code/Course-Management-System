import Head from 'next/head'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Card,
  Cascader,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Tag,
  Tooltip,
  Upload,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import EditableItem from '../../../../components/common/editableText'
import {
  Country,
  CourseType,
  Degree,
  StudentProfile,
} from '../../../../lib/model'
import { beforeUploadAvatar, getBase64 } from '../../../../lib/util'
import addressOptions from '../../../../public/address.json'
import styled from 'styled-components'
import { Gender, PROGRAM_LANGUAGE_COLORS } from '../../../../lib/constants'
import {
  getCountries,
  getProfile,
  editProfile,
  getDegrees,
  getCourseTypes,
} from '../../../../lib/request'
import { getUserInfo } from '../../../../lib/util'
import type { UploadFile } from 'antd/es/upload/interface'
import { RcFile } from 'antd/lib/upload'
import Image from 'next/image'

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

export default function Page() {
  const [data, setData] = useState<StudentProfile | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [existInterests, setExistInterests] = useState<CourseType[]>([])
  const [degrees, setDegrees] = useState<Degree[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const userInfo = getUserInfo()

  const updateProfile = (value: Partial<StudentProfile>) => {
    data &&
      editProfile<StudentProfile>({ id: data.id, ...value }, 'student').then(
        (res) => {
          if (res.data) {
            setData(res.data)
          }
        }
      )
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
      getProfile<StudentProfile>().then((res) => {
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

    getCourseTypes().then((res) => {
      if (res.data) {
        setExistInterests(res.data)
      }
    })

    getDegrees().then((res) => {
      if (res.data) {
        setDegrees(res.data)
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
                label="Age"
                labelStyle={{ flex: '0 1 80px' }}
                contentStyle={{ flex: 'auto' }}
              >
                <EditableItem textNode={data?.age} onSave={updateProfile}>
                  <Form.Item name="age" initialValue={data?.age}>
                    <InputNumber min={0} max={100} />
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

            <Descriptions title="Member">
              <Descriptions.Item
                label="Duration"
                contentStyle={{ color: ' #ADB5BD' }}
              >
                From: {data.memberStartAt} To: {data.memberEndAt}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Other" column={6}>
              <Descriptions.Item label="Degree" span={2}>
                <EditableItem textNode={data?.education} onSave={updateProfile}>
                  <Form.Item name="education" initialValue={data?.education}>
                    <Select
                      defaultValue={data?.education}
                      style={{ minWidth: 100 }}
                    >
                      {degrees.map((item, index) => (
                        <Select.Option value={item.short} key={index}>
                          {item.short}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Interest" span={4}>
                <EditableItem
                  textNode={data?.interest.map((item, index) => (
                    <Tag
                      color={PROGRAM_LANGUAGE_COLORS[index]}
                      key={item}
                      style={{ padding: '5px 10px' }}
                    >
                      {item}
                    </Tag>
                  ))}
                  onSave={updateProfile}
                >
                  <Form.Item name="interest" initialValue={data?.interest}>
                    <Select
                      mode="tags"
                      placeholder="select one interest language"
                      defaultValue={data?.interest}
                      style={{ minWidth: '10em' }}
                    >
                      {existInterests.map((item, index) => (
                        <Select.Option value={item.name} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>

              <Descriptions.Item label="Intro">
                <EditableItem
                  textNode={data?.description}
                  onSave={updateProfile}
                >
                  <Form.Item
                    name="description"
                    initialValue={data?.description}
                  >
                    <TextArea style={{ minWidth: '50vw' }} />
                  </Form.Item>
                </EditableItem>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={300}
      >
        <Image
          alt="Preview"
          style={{ width: '100%' }}
          src={previewImage}
          width={300}
          height={300}
        />
      </Modal>
    </>
  )
}
