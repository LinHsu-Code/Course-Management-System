import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { BackTop } from 'antd'
import styles from './backTop.module.scss'

export default function CustomBackTop({
  targetId,
  visibilityHeight,
}: {
  targetId: string
  visibilityHeight: number
}) {
  return (
    <BackTop
      target={() => document.getElementById(targetId) || window}
      visibilityHeight={visibilityHeight}
      className={styles.backTop}
    >
      <div className={styles.backTopContent}>
        <VerticalAlignTopOutlined className={styles.backTopIcon} />
      </div>
    </BackTop>
  )
}
