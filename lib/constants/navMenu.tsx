import { NAV_LABEL_TO_PATH } from '../constants'
import { DynamicNav, Role } from '../model'
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

const students: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Student,
  label: 'Student',
  icon: <SolutionOutlined />,
  isHideInBreadcrumb: true,
  subNav: [{ path: [''], label: 'Student List', icon: <TeamOutlined /> }],
}

const courses: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Course,
  label: 'Course',
  icon: <ReadOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    {
      path: NAV_LABEL_TO_PATH['Add Course'],
      label: 'Add Course',
      icon: <FileAddOutlined />,
    },
    {
      path: NAV_LABEL_TO_PATH['Edit Course'],
      label: 'Edit Course',
      icon: <EditOutlined />,
    },
  ],
}

const teachers: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Teacher,
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    {
      path: [''],
      label: 'Teacher List',
      icon: <TeamOutlined />,
    },
  ],
}

const overview: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Overview,
  label: 'Overview',
  icon: <DashboardOutlined />,
}

const studentCourses: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Course,
  label: 'Course',
  icon: <ReadOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    {
      path: NAV_LABEL_TO_PATH['My Course'],
      label: 'My Courses',
      icon: <FileAddOutlined />,
    },
  ],
}

const classSchedule: DynamicNav = {
  path: NAV_LABEL_TO_PATH['Class Schedule'],
  label: 'Class Schedule',
  icon: <CalendarOutlined />,
}

const profile: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Profile,
  label: 'Profile',
  isHideInSiderNav: true,
  icon: <ProfileOutlined />,
}

const messages: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Message,
  label: 'Message',
  icon: <MessageOutlined />,
}

export const routes: Map<Role, DynamicNav[]> = new Map([
  ['manager', [overview, students, teachers, courses, messages]],
  ['teacher', [overview, classSchedule, students, courses, profile, messages]],
  ['student', [overview, studentCourses, classSchedule, profile, messages]],
])

// const routes = [
//   {
//     path: 'index',
//     breadcrumbName: 'First-level Menu',
//   },
//   {
//     path: 'first',
//     breadcrumbName: 'Second-level Menu',
//   },
//   {
//     path: 'second',
//     breadcrumbName: 'Third-level Menu',
//   },
// ]
