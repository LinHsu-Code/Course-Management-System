import { Descriptions } from 'antd'
export default function DetailAboutInfo({
  about,
}: {
  about: { label: string; value: string | Date }[]
}) {
  return (
    <Descriptions column={1}>
      {about.map((item, index) => (
        <Descriptions.Item
          key={index}
          label={<strong>{item.label}</strong>}
          labelStyle={{ flex: '0 1 150px' }}
          contentStyle={{ flex: 'auto' }}
        >
          {item.value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  )
}
