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
import { useCallback, useEffect, useState } from 'react'
import {
  getCourseTypes,
  getTeachers,
  generateCourseCode,
  addCourse,
  updateCourse,
} from '../../lib/request'
import { disabledDate } from '../../lib/util'
import { CourseType, OptionValue, Course } from '../../lib/model'
import { ValidateMessages } from '../../lib/constants'
import DebouncedSearchSelect from '../common/debouncedSearchSelect'
import moment from 'moment'
import styled from 'styled-components'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
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
  .ant-upload-list-picture-card-container.ant-upload-animate-inline {
    display: none;
  }
`

export default function CourseDetailForm({
  afterSuccess,
  course,
}: {
  afterSuccess?: (course: Course) => void
  course: Course | null
}) {
  const [form] = Form.useForm()
  const [teacherId, setTeacherId] = useState<number>()
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
  const [unit, setUnit] = useState<number>(2)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      setFileList(info.fileList)
    }
    if (info.file.status === 'done') {
      setLoading(false)
      setFileList(info.fileList)
      message.success('Course image uploaded successfully.')
    }
    if (info.file.status === 'removed') {
      setFileList([])
    }
    if (info.file.status === 'error') {
      setLoading(false)
      setFileList(info.fileList)
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

  const coverRemoveButton = document.querySelector('.ant-btn-text')
  coverRemoveButton?.addEventListener('click', () => {
    setFileList([])
  })

  useEffect(() => {
    if (course) {
      const values = {
        ...course,
        type: course.type.map((item) => item.id),
        teacherId: course.teacherName,
        startTime: moment(course.startTime, 'YYYY-MM-DD'),
        cover: [
          {
            uid: '1',
            name: 'cover',
            url: course.cover,
            response: { url: course.cover },
          },
        ],
      }
      form.setFieldsValue(values)
      setTeacherId(course.teacherId)
      setFileList([
        {
          uid: '1',
          name: 'cover',
          url: course.cover,
          response: { url: course.cover },
        },
      ])
    } else {
      form.resetFields()
      setTeacherId(0)
      setUnit(2)
      setFileList([])
      setLoading(false)
    }
  }, [course, form])

  const genCode = useCallback(async () => {
    const { data } = await generateCourseCode()
    form.setFieldsValue({ uid: data })
  }, [form])

  useEffect(() => {
    if (!course) {
      getCourseTypes().then((res) => {
        if (res.data) {
          setCourseTypes(res.data)
        }
      })
      afterSuccess && genCode()
    }
  }, [afterSuccess, course, genCode])

  const uploadButton = loading ? (
    <LoadingOutlined />
  ) : (
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
    const startTime = values.startTime.format('YYYY-MM-DD')
    console.log('fileList:', fileList)
    const params =
      fileList.length > 0
        ? {
            ...values,
            startTime,
            durationUnit: unit,
            teacherId,
            cover: fileList[0].response.url,
          }
        : {
            ...values,
            startTime,
            teacherId,
            durationUnit: unit,
          }
    console.log(params)
    const res = course
      ? await updateCourse({ ...params, id: course.id })
      : await addCourse(params)
    if (res.data) {
      afterSuccess && afterSuccess(res.data)
    }
  }

  return (
    <Form
      name="add_course"
      form={form}
      onFinish={onFinish}
      validateMessages={ValidateMessages}
      autoComplete="off"
      layout="vertical"
    >
      <Row gutter={[16, 24]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={16}>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Teacher"
                name="teacherId"
                rules={[{ required: true }]}
              >
                <DebouncedSearchSelect
                  placeholder="search and select teacher"
                  fetchOptions={(
                    teacherName: string
                  ): Promise<OptionValue[]> => {
                    return getTeachers({ query: teacherName }).then((res) => {
                      return res.data
                        ? res.data.teachers.map((teacher) => ({
                            label: teacher.name,
                            value: teacher.id,
                          }))
                        : []
                    })
                  }}
                  onChange={(value) => setTeacherId(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item
                label="Course Code"
                name="uid"
                rules={[{ required: true }]}
              >
                <Input disabled type="text" placeholder="course code" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
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
                fileList={fileList}
                maxCount={1}
              >
                {fileList.length > 0 && !loading ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </FullHeightFormItemUpload>
        </Col>
      </Row>
      <Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}
