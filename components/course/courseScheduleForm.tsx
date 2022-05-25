import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Space,
  TimePicker,
} from 'antd'
import Form from 'antd/lib/form'
import { useForm } from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem'
import { FormListFieldData } from 'antd/lib/form/FormList'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Weekdays } from '../../lib/constants'
// import { gutter, validateMessages, weekDays } from '../../lib/constant'
// import { ScheduleRequest } from '../../lib/model'
// import apiService from '../../lib/services/api-service'
// import TimePicker from '../common/time-picker'

const { Option } = Select
const classTime = 'classTime'
const chapters = 'chapters'

type ScheduleFormValue = {
  [chapters]: {
    name: string
    content: string
  }[]
  [classTime]: {
    weekday: string
    time: Date
  }[]
}

const initialValues = {
  [chapters]: [{ name: '', content: '' }],
  [classTime]: [{ weekday: '', time: '' }],
}

export default function CourseScheduleForm({
  courseId,
  scheduleId,
  afterUpdateScheduleSuccess,
}: {
  courseId: number
  scheduleId: number
  afterUpdateScheduleSuccess: (res: boolean) => void
}) {
  const [form] = useForm<ScheduleFormValue>()
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  // const [weekdays, setWeekdays] = useState({
  //   Sunday: 0,
  //   Monday: 0,
  //   Tuesday: 0,
  //   Wednesday: 0,
  //   Thursday: 0,
  //   Friday: 0,
  //   Saturday: 0,
  // })

  // const updateSelectedWeekdays = (namePath?: (string | number)[]) => {
  //   const selected: {
  //     weekday: string
  //     time: string
  //   }[] = form.getFieldValue(classTime) || []
  //   let result = selected.map((item) => item?.weekday)

  //   if (namePath) {
  //     const value = form.getFieldValue(namePath)

  //     result = result.filter((item) => item !== value)
  //   }

  //   setSelectedWeekdays(result)
  // }

  const onFinish = (values: ScheduleFormValue) => {
    if (!courseId && !scheduleId) {
      message.error('You must select a course to update!')
      return
    }

    const { classTime: origin, chapters } = values
    const classTime = origin.map(
      ({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`
    )
    const req: ScheduleRequest = {
      chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
      classTime,
      scheduleId,
      courseId,
    }

    apiService.updateSchedule(req).then((res) => {
      const { data } = res

      if (!!afterUpdateScheduleSuccess && data) {
        afterUpdateScheduleSuccess(true)
      }
    })
  }

  // useEffect(() => {
  //   (async () => {
  //     if (!scheduleId || isAdd) {
  //       return;
  //     }

  //     const { data } = await apiService.getScheduleById({ scheduleId });

  //     if (!!data) {
  //       const classTimes = data.classTime.map((item) => {
  //         const [weekday, time] = item.split(' ');

  //         return { weekday, time: new Date(`2020-11-11 ${time}`) }; // 日期无所谓，随便设置的
  //       });

  //       form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
  //       setSelectedWeekdays(classTimes.map((item) => item.weekday));
  //     }
  //   })();
  // }, [scheduleId]);

  return (
    <Form
      //form={form}
      name="schedule"
      //onFinish={onFinish}
      //autoComplete="off"
      //validateMessages={validateMessages}
      //style={{ padding: '0 1.6%' }}
      initialValues={initialValues}
    >
      <Row gutter={[16, 24]}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List
            name="chapters"
            // rules={[
            //   {
            //     validator: async (_, chapters) => {
            //       if (!chapters || chapters.length < 1) {
            //         return Promise.reject(
            //           new Error('You must set at least one chapter')
            //         )
            //       }
            //     },
            //   },
            // ]}
          >
            {/* {(fields, { add, remove }, { errors }) => ( */}
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing chapter name',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="chapter name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'content']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing chapter content',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="chapter content" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(name)
                        } else {
                          message.warn('You must set at least one chapter.')
                        }
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    size="large"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Chapter
                  </Button>
                  {/* <Form.ErrorList errors={errors} /> */}
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'weekday']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing a specific day',
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        onChange={(value: string) =>
                          setSelectedWeekdays([...selectedWeekdays, value])
                        }
                      >
                        {Weekdays.map((day) => (
                          <Option
                            key={day}
                            value={day}
                            disabled={selectedWeekdays.includes(day)}
                          >
                            {day}
                          </Option>
                        ))}
                      </Select>
                      {/* <Input size="large" placeholder="chapter name" /> */}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'time']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing a specific time',
                        },
                      ]}
                    >
                      <TimePicker size="large" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={(v) => {
                        if (fields.length > 1) {
                          console.log(v)
                          console.log([classTime, name, 'weekday'])

                          // updateSelectedWeekdays([classTime, field.name, 'weekday']);
                          remove(name)
                        } else {
                          message.warn('You must set at least one class time.')
                        }
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    size="large"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Class Time
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
