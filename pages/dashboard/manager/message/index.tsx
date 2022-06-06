import Head from 'next/head'
import MessageHistoryList from '../../../../components/message/messageHistoryList'
import { Row, Col, Select, Typography } from 'antd'
import { MessageCount, MessageType } from '../../../../lib/model'
import { Dispatch, SetStateAction, useState } from 'react'
import { MessageTypes } from '../../../../lib/constants'

const { Title } = Typography

export default function Page({
  setUnReadCount,
}: {
  setUnReadCount: Dispatch<SetStateAction<MessageCount>>
}) {
  const [messageType, setMessageType] = useState<MessageType | ''>('')
  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager-Message'}</title>
      </Head>
      <div>
        <Row align="middle">
          <Col style={{ marginRight: 'auto' }}>
            <Title level={2}>Recent Messages</Title>
          </Col>

          <Col style={{ textAlign: 'right' }}>
            <Select
              defaultValue={''}
              onSelect={(value: any) => {
                setMessageType(value as MessageType | '')
              }}
              style={{ width: 120 }}
            >
              <Select.Option value="">All</Select.Option>
              <Select.Option value={MessageTypes[0]}>
                Notification
              </Select.Option>
              <Select.Option value={MessageTypes[1]}>Message</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <MessageHistoryList
            messageType={messageType}
            setUnReadCount={setUnReadCount}
          />
        </Row>
      </div>
    </>
  )
}
