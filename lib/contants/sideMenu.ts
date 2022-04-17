import {
  CalendarOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons'
const studentSideMenu = {}

const teacherSideMenu = {}

// Overview
// Student
// 	Student List
// Teacher
// 	Teacher List
// Course
// 	All Course
// 	Add Course
// 	Edit Course
// Message

interface SideMenuItem {
  icon: JSX.Element
  menuName: string
  path: string
  subMenu?: SideMenuItem[]
}

// const overview: SideMenuItem = {
//   path: '/',
//   menuName: 'Overview',
//   icon: <DashboardOutlined />,
//   subMenu: [],
// }
