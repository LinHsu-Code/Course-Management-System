/* eslint-disable @next/next/no-img-element */
import {
  Col,
  Form,
  Row,
  Button,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  message,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'
import {
  getCourseTypes,
  getTeachers,
  generateCourseCode,
} from '../../lib/request'
import { CourseType, OptionValue } from '../../lib/model'
import { ValidateMessages } from '../../lib/constants'
import DebouncedSearchSelect from '../common/debouncedSearchSelect'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment'
import styled from 'styled-components'
import { InboxOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'

const FullHeightFormItem = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    top: 30px;
    bottom: 24px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  textarea.ant-input {
    height: 100% !important;
  }
`

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < moment().endOf('day')
}

const selectAfter = (
  <Select defaultValue="month" className="select-after">
    <Select.Option value="year">year</Select.Option>
    <Select.Option value="day">day</Select.Option>
    <Select.Option value="week">week</Select.Option>
    <Select.Option value="hour">hour</Select.Option>
  </Select>
)

async function fetchTeacherList(teacherName: string): Promise<OptionValue[]> {
  return getTeachers({ query: teacherName }).then((res) =>
    res.data.teachers.map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    }))
  )
}

export default function CourseDetailForm({}: {}) {
  const [teacherId, setTeacherId] = useState()
  const [uid, setUid] = useState<string>()
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const props: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        //console.log(info.file, info.fileList)
        setLoading(true)
      }
      if (status === 'done') {
        setFileList(info.fileList)
        console.log(info.file, info.fileList)
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false)
          setImageUrl(url)
        })
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  useEffect(() => {
    getCourseTypes().then((res) => {
      if (res.data) {
        setCourseTypes(res.data)
      }
    })
    generateCourseCode().then((res) => {
      if (res.data) {
        setUid(res.data)
      }
    })
  }, [])

  return (
    <Form
      name="add_course"
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      validateMessages={ValidateMessages}
      autoComplete="off"
      layout="vertical"
    >
      <Row gutter={[16, 24]}>
        <Col xs={12} md={6}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item
            label="Teacher"
            name="teacherId"
            rules={[{ required: true }]}
          >
            <DebouncedSearchSelect
              value={teacherId}
              placeholder="search and select teacher"
              fetchOptions={fetchTeacherList}
              onChange={(newValue) => {
                setTeacherId(newValue)
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="select course types">
              {courseTypes.map((courseType) => (
                <Select.Option key={courseType.id} value={courseType.id}>
                  {courseType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          {/* <Form.Item
            label="Course Code"
            name="uid"
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="course code" disabled>
              {uid}
            </Input>
          </Form.Item> */}
        </Col>
      </Row>
      <Row gutter={[16, 24]}>
        <Col xs={24} md={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber prefix="￥" min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Student Limit"
            name="maxStudents"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }]}
            //rules={[{ required: true }, { validator: validateDuration }]}
          >
            <InputNumber
              min={1}
              addonAfter={selectAfter}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <FullHeightFormItem
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                min: 100,
                max: 1000,
                message:
                  'Description length must between 100 - 1000 characters.',
              },
            ]}
          >
            <Input.TextArea placeholder="Course description" />
          </FullHeightFormItem>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Cover" name="cover">
            <ImgCrop rotate>
              {imageUrl ? (
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={onPreview}
                >
                  {/* {fileList.length < 5 && '+ Upload'} */}
                </Upload>
              ) : (
                <Upload.Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Upload.Dragger>
              )}
            </ImgCrop>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        {' '}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}
