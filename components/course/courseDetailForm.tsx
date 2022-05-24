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
import { disabledDate } from '../../lib/util'
import { CourseType, OptionValue } from '../../lib/model'
import { ValidateMessages } from '../../lib/constants'
import DebouncedSearchSelect from '../common/debouncedSearchSelect'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment'
import styled from 'styled-components'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useForm } from 'antd/lib/form/Form'
import styles from './courseDetailForm.module.scss'

const FullHeightFormItem = styled(Form.Item)`
  width: 100%;
  .ant-form-item {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .ant-form-item-control {
    flex: 1;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content {
    height: 100% !important;
  }
`
const FullHeightFormItemUpload = styled(FullHeightFormItem)`
  //   animation-duration: 0s !important;
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-upload-list-picture-card,
  .ant-upload,
  .ant-upload-list-picture-card-container,
  .ant-upload-list-item,
  .ant-upload-list-item-removed,
  .ant-upload-list-item-list-type-picture-card {
    width: 100%;
    height: 100%;
    animation-duration: 0s;
  }
  //   .ant-upload-picture-card-wrapper img {
  //     object-fit: cover !important;
  //   }
`
async function fetchTeacherList(teacherName: string): Promise<OptionValue[]> {
  return getTeachers({ query: teacherName }).then((res) =>
    res.data.teachers.map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    }))
  )
}

export default function CourseDetailForm({}: {}) {
  const [form] = useForm()
  const [uid, setUid] = useState<string>('')
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [unit, setUnit] = useState<number>(2)
  const [isReady, setIsReady] = useState(true)
  //const [imageUrl, setImageUrl] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    console.log('onChange', info)
    // const { fileList: newFileList, file } = info
    if (info.file.status === 'uploading') {
      //   setImageUrl('')
      setIsReady(false)
    }
    if (info.file.status === 'done') {
      setIsReady(true)
      //   setFileList(info.fileList)
      //setImageUrl(info.file.response.url)
      setFileList(info.fileList)
      message.success('Course image uploaded successfully.')
    }
    if (info.file.status === 'removed') {
      setFileList(info.fileList)
      //setImageUrl('')
    }
    if (info.file.status === 'error') {
      setIsReady(false)
      //setImageUrl('')
      message.error('Course image upload failed.')
    }
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

  useEffect(() => {
    getCourseTypes().then((res) => {
      if (res.data) {
        setCourseTypes(res.data)
      }
    })
  }, [])

  const genCode = async () => {
    const { data } = await generateCourseCode()
    form.setFieldsValue({ uid: data })
  }

  const uploadButton = (
    <div className={styles.upload}>
      <p className={styles.icon}>
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </div>
  )

  const selectAfter = (
    <Select
      value={unit}
      className="select-after"
      onChange={(newUnit) => setUnit(newUnit)}
    >
      <Select.Option value={1}>year</Select.Option>
      <Select.Option value={2}>month</Select.Option>
      <Select.Option value={3}>day</Select.Option>
      <Select.Option value={4}>week</Select.Option>
      <Select.Option value={5}>hour</Select.Option>
    </Select>
  )

  const onFinish = async (values: any) => {
    const startTime = moment(values.startTime).format('YYYY-MM-DD')

    console.log('values:', {
      ...values,
      startTime,
      durationUnit: unit,
      //   cover: imageUrl,
    })
  }
  return (
    <Form
      name="add_course"
      form={form}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      validateMessages={ValidateMessages}
      autoComplete="off"
      layout="vertical"
    >
      {/* <Row gutter={[16, 24]}>
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
              placeholder="search and select teacher"
              fetchOptions={fetchTeacherList}
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
          <Form.Item
            label="Course Code"
            name="uid"
            rules={[{ required: true }]}
            initialValue={genCode()}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row> */}
      <Row gutter={[16, 24]}>
        <Col xs={24} md={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Student Limit"
            name="maxStudents"
            rules={[{ required: true, type: 'number', min: 1, max: 10 }]}
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
        <Col xs={24} md={8} style={{ display: 'flex' }}>
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
            <Input.TextArea
              placeholder="Course description"
              style={{ height: '100%' }}
            />
          </FullHeightFormItem>
        </Col>
        <Col xs={24} md={8} style={{ display: 'flex' }}>
          <FullHeightFormItemUpload label="Cover" name="cover">
            <ImgCrop rotate>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={handleChange}
                //fileList={fileList}
                maxCount={1}
              >
                {fileList.length > 0 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </FullHeightFormItemUpload>
          {/* <FullHeightFormItemUpload label="Cover" name="cover">
            <ImgCrop rotate>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={handleChange}
                // fileList={fileList}
                maxCount={1}
              >
                {imageUrl || !isReady ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </FullHeightFormItemUpload> */}
        </Col>
      </Row>
      <Row>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create Course
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}
