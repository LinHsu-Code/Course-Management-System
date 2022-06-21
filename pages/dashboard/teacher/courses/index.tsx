import Head from 'next/head'
import { Col, Input, Row, Switch, Tooltip } from 'antd'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import CourseListScrollMode from '../../../../components/course/courseListScrollMode'
import { CourseListTableMode } from '../../../../components/course/CourseListTableMode'

export default function Page() {
  const [isScroll, setIsScroll] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Course List'}</title>
      </Head>
      <div style={{ overflowX: 'auto' }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <Col>
            {!isScroll && (
              <Input.Search
                placeholder="Search by name"
                onChange={debounce((e) => {
                  setQuery(e.target.value)
                }, 1000)}
              />
            )}
          </Col>

          <Col>
            <Tooltip title="switch to grid mode">
              <Switch
                checkedChildren="on"
                unCheckedChildren="off"
                onChange={setIsScroll}
              />
            </Tooltip>
          </Col>
        </Row>

        {isScroll ? (
          <CourseListScrollMode />
        ) : (
          <CourseListTableMode query={query} />
        )}
      </div>
    </>
  )
}
