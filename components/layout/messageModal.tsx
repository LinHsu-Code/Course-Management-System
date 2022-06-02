import { Layout, Row, Col, Modal, Button, Tabs } from 'antd'

const { TabPane } = Tabs

export default function MessageModal({
  modal1Visible,
  setModal1Visible,
}: {
  modal1Visible: boolean
  setModal1Visible: (modal1Visible: boolean) => void
}) {
  return (
    <Modal
      closable={false}
      style={{ top: 68, marginRight: 56, marginLeft: 'auto' }}
      visible={modal1Visible}
      onOk={() => setModal1Visible(false)}
      onCancel={() => setModal1Visible(false)}
      width={400}
      footer={[
        <Row key="footer" style={{ textAlign: 'center' }}>
          <Col span={12} style={{ borderRight: '1px solid #f0f0f0' }}>
            <Button type="text">Mark all as read</Button>
          </Col>
          <Col span={12}>
            <Button style={{ border: 'none' }}>View history</Button>
          </Col>
        </Row>,
      ]}
    >
      <Tabs defaultActiveKey="1" style={{ height: 500 }}>
        <TabPane tab={`notification(0)`} key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab={`message(0)`} key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </Modal>
  )
}
