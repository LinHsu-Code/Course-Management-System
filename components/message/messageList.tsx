import { List, Skeleton, Divider, Avatar } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Message, MessageType } from '../../lib/model'
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getMessages } from '../../lib/request'

export default function MessageList({
  messageType,
}: {
  messageType: MessageType
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

  return (
    <div
      id={messageType}
      style={{
        height: 400,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '0 16px',
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
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.from.nickname}
                description={item.content}
              />
              {/* <div>Content</div> */}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}
