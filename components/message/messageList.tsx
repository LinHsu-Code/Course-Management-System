import { List, Skeleton, Divider, Avatar } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  GetMessageRequest,
  GetMessageResponseData,
  Message,
  MessageType,
} from '../../lib/model'
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
import { useDataListLoad } from '../../hooks/dataListLoad'

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
  const { setQueryParams, hasMore, data, setData } = useDataListLoad<
    GetMessageRequest,
    GetMessageResponseData,
    Message
  >(getMessages, 'messages', undefined, { type: messageType })

  const {
    state: { newMessage, markedIdsFromPage },
    dispatch,
  } = useContext(MessageContext)

  useEffect(() => {
    if (newMessage && newMessage.type === messageType)
      setData((pre) => [newMessage, ...pre])
  }, [newMessage, messageType, setData])

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
  }, [dispatch, markedIdsFromPage, messageType, setData])

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
  }, [dispatch, messageType, setData])

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
        next={() => {
          setQueryParams((prev) => ({
            ...prev,
            paginator: { ...prev.paginator, page: prev.paginator.page + 1 },
          }))
        }}
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
