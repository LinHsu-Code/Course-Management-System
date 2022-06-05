import { List, Skeleton, Divider, Avatar } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType, MessageCount } from '../../lib/model'
import { CodeSandboxCircleFilled, UserOutlined } from '@ant-design/icons'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  getMessages,
  getMessageStatics,
  markMessageAsRead,
} from '../../lib/request'
import { formatDistanceToNow } from 'date-fns'
import styled from 'styled-components'

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
  unReadCount,
  setUnReadCount,
  newMessage,
}: {
  messageType: MessageType
  activeMarkAsRead: number
  unReadCount: number
  setUnReadCount: Dispatch<SetStateAction<MessageCount>>
  newMessage: Message | null
}) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<number>(1)
  const [data, setData] = useState<Message[]>([])

  const loadMoreData = (
    isReset: boolean = false,
    page: number = nextPage,
    type: MessageType = messageType,
    limit: number = 20
  ) => {
    if (loading) {
      return
    }
    setLoading(true)
    return getMessages({
      page,
      limit,
      type,
    })
      .then((res) => {
        if (res.data) {
          if (isReset) {
            setData(res.data.messages)
          } else {
            setData([...data, ...res.data.messages])
          }
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
    loadMoreData()
  }, [])

  // list didn't re-render after data changed
  // infinite scroll => same message => same key error
  // useEffect(() => {
  //   if (newMessage) {
  //     setData((pre) => [...pre, newMessage])
  //   }
  // }, [newMessage])

  useEffect(() => {
    if (newMessage) {
      loadMoreData(true, 1)
    }
  }, [newMessage])

  // const handleMarkMessageAsRead = () => {
  //   getMessages({ status: 0,
  //     type: messageType,
  //     limit: unReadCount}).then((res) => {
  //     if (res.data) {
  //       console.log(res.data)
  //       const ids = res.data.messages
  //         .filter((item) => item.status === 0)
  //         .map((item) => item.id)

  //       console.log(ids)
  //       if (ids.length) {
  //         markMessageAsRead({ ids, status: 1 }).then((res) => {
  //           if (res.data) {
  //             setData((pre) => pre.map((item) => ({ ...item, status: 1 })))
  //             setUnReadCount((pre) => ({ ...pre, [messageType]: 0 }))
  //           }
  //         })
  //       }
  //     }
  //   })
  // }

  // useEffect(() => {
  //   if (activeMarkAsRead) {
  //     handleMarkMessageAsRead()
  //   }
  // }, [activeMarkAsRead])

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
                  setUnReadCount((pre) => ({ ...pre, [messageType]: 0 }))
                }
              })
            }
          }
        })
      }
    })
  }, [messageType, setUnReadCount])

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
        next={loadMoreData}
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

                    setUnReadCount((pre) => ({
                      ...pre,
                      [messageType]: unReadCount - 1,
                    }))
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
