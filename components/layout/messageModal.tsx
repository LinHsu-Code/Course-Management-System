import { Row, Col, Modal, Button, Tabs } from 'antd'
import styled from 'styled-components'
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
            <Button type="text">Mark all as read</Button>
          </Col>
          <Col span={12} style={{ padding: '10px 0' }}>
            <Button style={{ border: 'none' }}>View history</Button>
          </Col>
        </Row>,
      ]}
    >
      <Tabs defaultActiveKey="notification">
        <TabPane tab={`notification(0)`} key="notification">
          <MessageList messageType="notification" />
        </TabPane>
        <TabPane tab={`message(0)`} key="message">
          <MessageList messageType="message" />
        </TabPane>
      </Tabs>
    </CustomModal>
  )
}
