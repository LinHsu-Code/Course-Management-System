import { List, Skeleton, Divider, Avatar } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType } from '../../lib/model'
import { UserOutlined } from '@ant-design/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
import {
  getMessages,
  getMessageStatics,
  markMessageAsRead,
} from '../../lib/request'
import { formatDistanceToNow } from 'date-fns'
import styled from 'styled-components'
import MessageContext from '../../providers/messageContext'
import { ActionType } from '../../providers/messageReducer'

const CustomList = styled(List)`
  .ant-list-item {
    padding: 10px 16px;
    cursor: pointer;
    &:hover {
      background: #1890ff45;
    }
  }
`

export default function MessageList({
  messageType,
  activeMarkAsRead,
}: {
  messageType: MessageType
  activeMarkAsRead: number
}) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<number>(1)
  const [data, setData] = useState<Message[]>([])
  const {
    state: { newMessage, markedIdsFromPage },
    dispatch,
  } = useContext(MessageContext)

  const loadMoreData = useCallback(
    (page, limit, type) => {
      if (loading) {
        return
      }
      setLoading(true)
      getMessages({
        page,
        limit,
        type,
      })
        .then((res) => {
          if (res.data) {
            setData((pre) => [...pre, ...res.data.messages])
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
    },
    [loading]
  )

  useEffect(() => {
    if (newMessage && newMessage.type === messageType)
      setData((pre) => [newMessage, ...pre])
  }, [newMessage, messageType])

  useEffect(() => {
    if (markedIdsFromPage && markedIdsFromPage.messageType === messageType) {
      setData((pre) => {
        const newData = [...pre]
        markedIdsFromPage.ids.forEach((id) => {
          for (let message of newData) {
            if (message.id === id) {
              message.status = 1
              break
            }
          }
        })
        return [...newData]
      })
      dispatch({ type: ActionType.ResetMarkAsReadFromPage })
    }
  }, [dispatch, markedIdsFromPage, messageType])

  useEffect(() => {
    getMessages({
      page: 1,
      limit: 20,
      type: messageType,
    }).then((res) => {
      if (res.data) {
        setData(res.data.messages)
        if (res.data.total <= 20) {
          setHasMore(false)
        }
        setNextPage(2)
      }
    })
  }, [messageType])

  const handleMarkMessageAsRead = useCallback(() => {
    getMessageStatics({}).then((res) => {
      if (res.data) {
        getMessages({
          status: 0,
          type: messageType,
          limit: res.data.receive[messageType].unread,
        }).then((res) => {
          if (res.data) {
            const ids = res.data.messages
              .filter((item) => item.status === 0)
              .map((item) => item.id)

            if (ids.length) {
              markMessageAsRead({ ids, status: 1 }).then((res) => {
                if (res.data) {
                  setData((pre) => pre.map((item) => ({ ...item, status: 1 })))

                  dispatch({
                    type: ActionType.MarkAsReadFromModal,
                    payload: {
                      ids,
                      messageType,
                    },
                  })

                  dispatch({
                    type: ActionType.DecreaseUnreadCount,
                    payload: {
                      messageType,
                      count: ids.length,
                    },
                  })
                }
              })
            }
          }
        })
      }
    })
  }, [dispatch, messageType])

  useEffect(() => {
    if (activeMarkAsRead) {
      handleMarkMessageAsRead()
    }
  }, [activeMarkAsRead, handleMarkMessageAsRead])

  return (
    <div
      id={messageType}
      style={{
        height: 400,
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingRight: 16,
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={() => loadMoreData(nextPage, 20, messageType)}
        hasMore={hasMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget={messageType}
      >
        <CustomList>
          {data.map((item) => (
            <List.Item
              key={item.id}
              style={{ opacity: item.status ? 0.6 : 1 }}
              onClick={() => {
                if (item.status === 1) {
                  return
                }
                markMessageAsRead({ ids: [item.id], status: 1 }).then((res) => {
                  if (res.data) {
                    const targetIndex = data.findIndex(
                      (msg) => item.id === msg.id
                    )
                    if (targetIndex !== -1) {
                      data[targetIndex].status = 1
                    }
                    setData([...data])

                    dispatch({
                      type: ActionType.MarkAsReadFromModal,
                      payload: {
                        ids: [item.id],
                        messageType,
                      },
                    })

                    dispatch({
                      type: ActionType.DecreaseUnreadCount,
                      payload: {
                        messageType,
                        count: 1,
                      },
                    })
                  }
                })
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.from.nickname}
                description={
                  <div>
                    <div style={{ marginTop: 5 }}>{item.content}</div>
                    <div style={{ marginTop: 5 }}>
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                }
              />
            </List.Item>
          ))}
        </CustomList>
      </InfiniteScroll>
    </div>
  )
}
