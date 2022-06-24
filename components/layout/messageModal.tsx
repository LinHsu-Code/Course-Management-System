import { Row, Col, Modal, Button, Tabs, notification } from 'antd'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MessageTypes } from '../../lib/constants'
import { MessageType, MessageCount, Message } from '../../lib/model'
import { getMessageStatistics, subscribeMessage } from '../../lib/request'
import { getUserInfo } from '../../lib/util'
import MessageContext from '../../providers/messageContext'
import { ActionType } from '../../providers/messageReducer'
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
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
}) {
  const [activeMarkAsRead, setActiveMarkAsRead] = useState<MessageCount>({
    notification: 0,
    message: 0,
  })
  const [messageType, setMessageType] = useState<MessageType>('notification')
  const {
    state: { unread },
    dispatch,
  } = useContext(MessageContext)

  const userInfo = getUserInfo()

  useEffect(() => {
    let sse: EventSource | null = null
    if (userInfo.userId) {
      getMessageStatistics().then((res) => {
        if (res.data) {
          dispatch({
            type: ActionType.IncreaseUnreadCount,
            payload: {
              messageType: 'notification',
              count: res.data.receive.notification.unread,
            },
          })
          dispatch({
            type: ActionType.IncreaseUnreadCount,
            payload: {
              messageType: 'message',
              count: res.data.receive.message.unread,
            },
          })
        }
      })

      sse = subscribeMessage(userInfo.userId)

      sse.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type !== 'heartbeat') {
          const message = data.content as Message
          notification.info({
            message: `You have a ${message.type} from ${message.from.nickname}`,
            description: message.content,
          })

          dispatch({
            type: ActionType.ReceiveNewMessage,
            payload: {
              message,
            },
          })

          dispatch({
            type: ActionType.IncreaseUnreadCount,
            payload: {
              messageType: message.type,
              count: 1,
            },
          })
        }
      }
    }

    return () => {
      sse && sse.close()
    }
  }, [dispatch, userInfo.userId])

  return (
    <CustomModal
      closable={false}
      style={{ top: 68, marginRight: 56, marginLeft: 'auto' }}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
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
                  [messageType]: (activeMarkAsRead[messageType] + 1) % 10,
                })
              }
              disabled={!unread[messageType]}
            >
              Mark all as read
            </Button>
          </Col>
          <Col span={12} style={{ padding: '10px 0' }}>
            <Button
              style={{ border: 'none' }}
              onClick={() => setModalVisible(false)}
            >
              <Link href={`/dashboard/${userInfo.role}/message`}>
                View history
              </Link>
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <Tabs
        defaultActiveKey={MessageTypes[0]}
        onChange={(key) => setMessageType(key as MessageType)}
      >
        {MessageTypes.map((item) => (
          <TabPane tab={`${item}(${unread[item]})`} key={item}>
            <MessageList
              messageType={item}
              activeMarkAsRead={activeMarkAsRead[item]}
            />
          </TabPane>
        ))}
      </Tabs>
    </CustomModal>
  )
}
