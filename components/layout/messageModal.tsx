import { Row, Col, Modal, Button, Tabs } from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MessageType } from '../../lib/model'
import { getMessageStatics } from '../../lib/request'
import MessageList from '../message/messageList'

const { TabPane } = Tabs

const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 4px;
  }
  .ant-modal-body {
    padding: 0px;
  }
  .ant-tabs-nav {
    padding: 10px 24px 0px 24px;
  }
  .ant-modal-footer {
    padding: 0;
  }
`

export default function MessageModal({
  modal1Visible,
  setModal1Visible,
}: {
  modal1Visible: boolean
  setModal1Visible: (modal1Visible: boolean) => void
}) {
  const [activeMarkAsRead, setActiveMarkAsRead] = useState<{
    [key in MessageType]: number
  }>({
    notification: 0,
    message: 0,
  })
  const [unReadCount, setUnReadCount] = useState<{
    [key in MessageType]: number
  }>({
    notification: 0,
    message: 0,
  })
  const [messageType, setMessageType] = useState<MessageType>('notification')

  useEffect(() => {
    getMessageStatics({}).then((res) => {
      if (res.data) {
        setUnReadCount({
          notification: res.data.receive.notification.unread,
          message: res.data.receive.message.unread,
        })
      }
    })
  }, [])

  return (
    <CustomModal
      closable={false}
      style={{ top: 68, marginRight: 56, marginLeft: 'auto' }}
      visible={modal1Visible}
      onOk={() => setModal1Visible(false)}
      onCancel={() => setModal1Visible(false)}
      width={400}
      footer={[
        <Row key="footer" style={{ textAlign: 'center' }}>
          <Col
            span={12}
            style={{ borderRight: '1px solid #f0f0f0', padding: '10px 0' }}
          >
            <Button
              type="text"
              onClick={() =>
                setActiveMarkAsRead({
                  ...activeMarkAsRead,
                  [messageType]: activeMarkAsRead[messageType] + 1,
                })
              }
              disabled={!unReadCount[messageType]}
            >
              Mark all as read
            </Button>
          </Col>
          <Col span={12} style={{ padding: '10px 0' }}>
            <Button
              style={{ border: 'none' }}
              onClick={() => setModal1Visible(false)}
            >
              <Link href="/dashboard/manager/message">View history</Link>
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <Tabs
        defaultActiveKey="notification"
        onChange={(key) => setMessageType(key as MessageType)}
      >
        <TabPane
          tab={`notification(${unReadCount.notification})`}
          key="notification"
        >
          <MessageList
            messageType="notification"
            activeMarkAsRead={activeMarkAsRead.notification}
            setUnReadCount={setUnReadCount}
            unReadCount={unReadCount}
          />
        </TabPane>
        <TabPane tab={`message(${unReadCount.message})`} key="message">
          <MessageList
            messageType="message"
            activeMarkAsRead={activeMarkAsRead.message}
            setUnReadCount={setUnReadCount}
            unReadCount={unReadCount}
          />
        </TabPane>
      </Tabs>
    </CustomModal>
  )
}
