import styles from './home-layout.module.scss'
import { Layout } from 'antd'
const { Header, Footer, Content } = Layout

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <Header className={styles.header}>Home Header</Header>
      <Content className={styles.main}>{children}</Content>
      <Footer className={styles.footer}>Home Footer</Footer>
    </div>
  )
}
