import { Card, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Descriptions } from 'antd'

export default function DetailInfoCard({
  info,
}: {
  info: {
    avatar: string
    tableData: { label: string; value: string | number | null; span: number }[]
  }
}) {
  return (
    <Card
      headStyle={{ textAlign: 'center' }}
      title={
        <Avatar
          shape="circle"
          size={100}
          src={info.avatar}
          icon={<UserOutlined />}
        />
      }
    >
      <Descriptions layout="vertical" column={2} colon={false}>
        {info.tableData.map((item, index) => (
          <Descriptions.Item
            key={index}
            span={item.span}
            label={<strong>{item.label}</strong>}
            labelStyle={{ width: '100%', justifyContent: 'center' }}
            contentStyle={{ justifyContent: 'center' }}
          >
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  )
}
