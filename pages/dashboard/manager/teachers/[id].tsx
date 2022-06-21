import Head from 'next/head'
import { getTeacher } from '../../../../lib/request'
import { useState, useEffect } from 'react'
import { Row, Col, Card, Tabs, Rate } from 'antd'
import { GetServerSideProps } from 'next/types'
import { TeacherWithProfile } from '../../../../lib/model'
import DetailInfoCard from '../../../../components/common/detailInfoCard'
import DetailAboutInfo from '../../../../components/common/detailAboutInfo'
import { getUserInfo } from '../../../../lib/util'

const { TabPane } = Tabs

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.query.id)
  return {
    props: { id },
  }
}

export default function Page({ id }: { id: number }) {
  const [info, setInfo] = useState<{
    avatar: string
    tableData: { label: string; value: string | number | null; span: number }[]
  } | null>(null)
  const [about, setAbout] = useState<{ label: string; value: string | Date }[]>(
    []
  )
  const [teacher, setTeacher] = useState<TeacherWithProfile | null>(null)

  const userInfo = getUserInfo()

  useEffect(() => {
    ;(async () => {
      const { data: teacher } = await getTeacher(id)
      const info = {
        avatar: teacher.profile.avatar,
        tableData: [
          { label: 'Name', value: teacher.name, span: 1 },
          { label: 'Country', value: teacher.country, span: 1 },
          { label: 'Email', value: teacher.email, span: 1 },
          { label: 'Phone', value: teacher.phone, span: 1 },
          {
            label: 'Address',
            value: teacher.profile.address!.join(' '),
            span: 2,
          },
        ],
      }
      const about = [
        { label: 'Birthday', value: teacher.profile.birthday },
        {
          label: 'Gender',
          value: teacher.profile.gender === 1 ? 'Male' : 'Female',
        },
        { label: 'Create Time', value: teacher.createdAt },
        { label: 'Update Time', value: teacher.updatedAt },
      ]

      setInfo(info)
      setAbout(about)
      setTeacher(teacher)
    })()
  }, [id])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Teacher Detail'}</title>
      </Head>
      <Row gutter={[6, 16]}>
        <Col flex="0 1 400px">{info && <DetailInfoCard info={info} />}</Col>
        <Col flex="1 1 500px">
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <div>
                  <h3 className="detail_about_title">Information</h3>
                  <DetailAboutInfo about={about} />
                </div>
                <div>
                  <h3 className="detail_about_title">Skills</h3>

                  {teacher?.skills.map((item, index) => (
                    <Row key={index} gutter={[6, 16]} align="middle">
                      <Col span={4}>
                        <b>{item.name}:</b>
                      </Col>
                      <Col>
                        <Rate disabled defaultValue={item.level} />
                      </Col>
                    </Row>
                  ))}
                </div>
                <div>
                  <h3 className="detail_about_title">Description</h3>

                  <Row gutter={[6, 16]}>
                    <Col style={{ lineHeight: 2 }}>
                      {teacher?.profile?.description}
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </>
  )
}
