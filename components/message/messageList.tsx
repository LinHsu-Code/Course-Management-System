import { List, Skeleton, Divider, Avatar, message, Space } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType } from '../../lib/model'
import { UserOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import { getMessages, markMessageAsRead } from '../../lib/request'
import { formatDistanceToNow } from 'date-fns'
import styled from 'styled-components'

const CustomList = styled(List)`
  .ant-list-item {
    padding-left: 16px;
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
}: {
  messageType: MessageType
  activeMarkAsRead: number
  unReadCount: {
    [key in MessageType]: number
  }
  setUnReadCount: ({
    notification,
    message,
  }: {
    notification: number
    message: number
  }) => void
}) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<number>(1)
  const [data, setData] = useState<Message[]>([])

  const loadMoreData = (
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
          setData([...data, ...res.data.messages])
          setLoading(false)
          if (res.data.total <= nextPage * 20) {
            setHasMore(false)
          }
          setNextPage(nextPage + 1)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadMoreData()
  }, [])

  const handleMarkMessageAsRead = useCallback(() => {
    console.log(11111111111111)
    // const ids = getUnreadIds()
    let ids: number[] = []
    getMessages({ type: messageType }).then((res) => {
      if (res.data) {
        console.log(res.data)
        ids = res.data.messages
          .filter((item) => item.status === 0)
          .map((item) => item.id)
      }
    })
    if (ids.length) {
      markMessageAsRead({ ids, status: 1 }).then((res) => {
        if (res.data) {
          setData((pre) => pre.map((item) => ({ ...item, status: 1 })))
          setUnReadCount({ ...unReadCount, [messageType]: 0 })
        }
      })
    }
  }, [messageType])

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
                    const newDate = [...data]
                    const target = newDate.findIndex(
                      (msg) => item.id === msg.id
                    )
                    if (target !== -1) {
                      newDate[target].status = 1
                    }
                    setData(newDate)

                    setUnReadCount({
                      ...unReadCount,
                      [messageType]: unReadCount[messageType] - 1,
                    })
                  }
                })
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.from.nickname}
                description={item.content}
              />
              {/* <div>Content</div> */}
            </List.Item>
          ))}
        </CustomList>
      </InfiniteScroll>
    </div>
  )
}
