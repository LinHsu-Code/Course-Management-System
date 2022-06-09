import styled from 'styled-components'
import { Row, Col, Card, Progress } from 'antd'

const OverviewIconCol = styled(Col)`
  display: flex;
  align-items: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`

const OverviewCol = styled(Col)`
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`
export interface OverviewProps {
  backgroundColor: string
  icon: JSX.Element
  title: string
  data: number
  percentage: number
  dataDescription: string
}

const Overview = ({
  backgroundColor,
  icon,
  title,
  data,
  percentage,
  dataDescription,
}: OverviewProps) => {
  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', backgroundColor }}>
      <Row>
        <OverviewIconCol>{icon}</OverviewIconCol>
        <OverviewCol offset={1} flex={1}>
          <h3>{title}</h3>
          <h2>{data}</h2>
          <Progress
            percent={percentage}
            size="small"
            showInfo={false}
            strokeColor="lightgreen"
            trailColor="white"
          />
          <p>{`${percentage.toFixed(1)}% ${dataDescription}`}</p>
        </OverviewCol>
      </Row>
    </Card>
  )
}

export default Overview
