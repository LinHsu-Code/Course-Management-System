import { List, Skeleton, Divider, Avatar, Typography, Row, Col } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType, MessageHistory } from '../../lib/model'
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { getMessages, markMessageAsRead } from '../../lib/request'
import { format } from 'date-fns'
import MessageContext from '../../providers/messageContext'
import { ActionType } from '../../providers/messageReducer'

const { Title } = Typography

export default function MessageHistoryList({
  messageType,
}: {
  messageType: MessageType | ''
}) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<number>(1)
  const [data, setData] = useState<MessageHistory>({})
  const {
    state: { newMessage, markedIdsFromModal },
    dispatch,
  } = useContext(MessageContext)

  const loadMoreData = (
    page: number = nextPage,
    type = messageType,
    limit: number = 20
  ) => {
    if (loading) {
      return
    }
    setLoading(true)
    const params = type
      ? {
          page,
          limit,
          type,
        }
      : {
          page,
          limit,
        }
    getMessages(params)
      .then((res) => {
        if (res.data) {
          const initialData = data
          const formateData = res.data.messages.reduce((acc, cur) => {
            const key: string = format(new Date(cur.createdAt), 'yyyy-MM-dd')
            if (!acc[key]) {
              acc[key] = [cur]
            } else {
              acc[key].push(cur)
            }
            return acc
          }, initialData)
          setData(formateData)
          setLoading(false)
          if (res.data.total <= page * 20) {
            setHasMore(false)
          }
          setNextPage(page + 1)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const params = messageType
      ? {
          page: 1,
          limit: 20,
          type: messageType,
        }
      : {
          page: 1,
          limit: 20,
        }
    getMessages(params).then((res) => {
      if (res.data) {
        const initialData = {} as MessageHistory
        const formateData = res.data.messages.reduce((acc, cur) => {
          const key: string = format(new Date(cur.createdAt), 'yyyy-MM-dd')
          if (!acc[key]) {
            acc[key] = [cur]
          } else {
            acc[key].push(cur)
          }
          return acc
        }, initialData)
        setData(formateData)
        if (res.data.total <= 20) {
          setHasMore(false)
        }
        setNextPage(2)
      }
    })
  }, [messageType])

  const [lastNewMessageId, setLastNewMessageId] = useState(0)
  useEffect(() => {
    if (
      newMessage &&
      newMessage.id !== lastNewMessageId &&
      (!messageType || newMessage.type === messageType)
    ) {
      const key: string = format(new Date(newMessage.createdAt), 'yyyy-MM-dd')
      setData((pre) => {
        return { ...pre, [key]: [newMessage, ...pre[key]] }
      })
      setLastNewMessageId(newMessage.id)
    }
  }, [newMessage, messageType, lastNewMessageId])

  useEffect(() => {
    if (
      markedIdsFromModal &&
      (!messageType || markedIdsFromModal.messageType === messageType)
    ) {
      setData((pre) => {
        const newData = { ...pre }
        markedIdsFromModal.ids.forEach((id) => {
          let flag = false
          for (let data in newData) {
            if (flag) {
              break
            }
            for (let message of newData[data])
              if (message.id === id) {
                message.status = 1
                flag = true
                break
              }
          }
        })
        return { ...newData }
      })
      dispatch({ type: ActionType.ResetMarkAsReadFromModal })
    }
  }, [dispatch, markedIdsFromModal, messageType])

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <InfiniteScroll
        dataLength={Object.entries(data).length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List itemLayout="vertical">
          {Object.entries(data).map(([date, messages]: [string, Message[]]) => (
            <div key={`Date:${date}`}>
              <Title level={4}>{date}</Title>
              {messages.map((item) => (
                <List.Item
                  key={item.id}
                  style={{ opacity: item.status ? 0.6 : 1 }}
                  actions={[<div key="time">{item.createdAt}</div>]}
                  onClick={() => {
                    if (item.status === 1) {
                      return
                    }
                    markMessageAsRead({ ids: [item.id], status: 1 }).then(
                      (res) => {
                        if (res.data) {
                          const dayMessages = Object.entries(data)
                          for (let i = 0; i < dayMessages.length; i++) {
                            const targetIndex = dayMessages[i][1].findIndex(
                              (msg) => item.id === msg.id
                            )
                            if (targetIndex !== -1) {
                              data[dayMessages[i][0]][targetIndex].status = 1
                              setData({ ...data })
                              break
                            }
                          }

                          dispatch({
                            type: ActionType.MarkAsReadFromPage,
                            payload: {
                              ids: [item.id],
                              messageType: item.type,
                            },
                          })

                          dispatch({
                            type: ActionType.DecreaseUnreadCount,
                            payload: {
                              messageType: item.type,
                              count: 1,
                            },
                          })
                        }
                      }
                    )
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Row>
                        <Col style={{ marginRight: 'auto' }}>
                          {item.from.nickname}
                        </Col>
                        <Col>
                          {item.type === 'notification' ? (
                            <AlertOutlined />
                          ) : (
                            <MessageOutlined />
                          )}
                        </Col>
                      </Row>
                    }
                    description={item.content}
                  />
                </List.Item>
              ))}
            </div>
          ))}
        </List>
      </InfiniteScroll>
    </div>
  )
}
