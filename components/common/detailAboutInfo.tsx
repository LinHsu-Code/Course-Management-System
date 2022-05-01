import { Row, Col } from 'antd'
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
    // <Row gutter={[16, 24]}>
    //   <Col>
    //     {props.about.map((item, index) => (
    //       <Row key={index}>
    //         <Col flex="200px">
    //           <strong>{item.label}:</strong>
    //         </Col>

    //         <Col flex="auto">
    //           <span>{item.value}</span>
    //         </Col>
    //       </Row>
    //     ))}
    //   </Col>
    // </Row>
  )
}
