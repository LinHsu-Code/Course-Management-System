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
  Form,
} from 'antd'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Weekdays } from '../../lib/constants'

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
  const [form] = Form.useForm<ScheduleFormValue>()
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])

  const onFinish = (values: ScheduleFormValue) => {
    console.log(values)
    // if (!courseId && !scheduleId) {
    //   message.error('You must select a course to update!')
    //   return
    // }

    // const { classTime: origin, chapters } = values
    // const classTime = origin.map(
    //   ({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`
    // )
    // const req: ScheduleRequest = {
    //   chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
    //   classTime,
    //   scheduleId,
    //   courseId,
    // }

    // apiService.updateSchedule(req).then((res) => {
    //   const { data } = res

    //   if (!!afterUpdateScheduleSuccess && data) {
    //     afterUpdateScheduleSuccess(true)
    //   }
    // })
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
      form={form}
      name="schedule"
      onFinish={onFinish}
      //validateMessages={validateMessages}
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
                  <Row
                    key={key}
                    gutter={[16, 24]}
                    style={{ alignItems: 'baseline' }}
                  >
                    <Col span={8}>
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
                    </Col>

                    <Col span={12}>
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
                    </Col>

                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(name)
                          } else {
                            message.warn('You must set at least one chapter.')
                          }
                        }}
                      />
                    </Col>
                  </Row>
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
                  <Row
                    key={key}
                    gutter={[16, 24]}
                    style={{ alignItems: 'baseline' }}
                  >
                    <Col span={8}>
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
                      </Form.Item>
                    </Col>

                    <Col span={12}>
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
                        <TimePicker size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={(v) => {
                          if (fields.length > 1) {
                            console.log(selectedWeekdays.slice(0, name))
                            console.log(selectedWeekdays.slice(name + 1))
                            setSelectedWeekdays(
                              selectedWeekdays
                                .slice(0, name)
                                .concat(selectedWeekdays.slice(name + 1))
                            )
                            remove(name)
                          } else {
                            message.warn(
                              'You must set at least one class time.'
                            )
                          }
                        }}
                      />
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    size="large"
                    onClick={() => add()}
                    disabled={fields.length >= 7}
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
