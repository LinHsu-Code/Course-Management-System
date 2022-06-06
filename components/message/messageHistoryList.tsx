import { List, Skeleton, Divider, Avatar, Typography, Row, Col } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  Message,
  MessageType,
  MessageHistory,
  MessageCount,
} from '../../lib/model'
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getMessages, markMessageAsRead } from '../../lib/request'
import { format } from 'date-fns'

const { Title } = Typography

export default function MessageHistoryList({
  messageType,
  unReadCount,
  setUnReadCount,
}: {
  messageType: MessageType | ''
  unReadCount: number
  setUnReadCount: Dispatch<SetStateAction<MessageCount>>
}) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nextPage, setNextPage] = useState<number>(1)
  const [data, setData] = useState<MessageHistory>({})

  const loadMoreData = (
    isReset: boolean = false,
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
          const initialData = isReset ? {} : data
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
    loadMoreData(true, 1)
  }, [messageType, unReadCount])

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
                          setUnReadCount((pre) => ({
                            ...pre,
                            [item.type]: pre[item.type] - 1,
                          }))
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
