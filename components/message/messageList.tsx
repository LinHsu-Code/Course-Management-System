import { List, Skeleton, Divider, Avatar } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType, MessageCount } from '../../lib/model'
import { UserOutlined } from '@ant-design/icons'
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

  const loadMoreData = useCallback((isReset, page, type, limit) => {
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
            setData((pre) => [...pre, ...res.data.messages])
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
  }, [])

  useEffect(() => {
    if (newMessage) {
      setUnReadCount((pre) => ({ ...pre, [messageType]: pre[messageType] + 1 }))
    }
  }, [messageType, newMessage, setUnReadCount])

  useEffect(() => {
    loadMoreData(true, 1, messageType, 20)
  }, [loadMoreData, messageType, unReadCount])

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
        next={() => loadMoreData(false, nextPage, messageType, 20)}
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
