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

const STUDENTS: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Student,
  label: 'Student',
  icon: <SolutionOutlined />,
  isHideInBreadcrumb: true,
  subNav: [{ path: '', label: 'Student List', icon: <TeamOutlined /> }],
}

const COURSES: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Course,
  label: 'Course',
  icon: <ReadOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    { path: '', label: 'All Courses', icon: <ProjectOutlined /> },
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

const TEACHERS: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Teacher,
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    {
      path: '',
      label: 'Teacher List',
      icon: <TeamOutlined />,
    },
  ],
}

const OVERVIEW: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Overview,
  label: 'Overview',
  icon: <DashboardOutlined />,
}

const STUDENT_COURSES: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Course,
  label: 'Course',
  icon: <ReadOutlined />,
  isHideInBreadcrumb: true,
  subNav: [
    { path: '', label: 'All Courses', icon: <ProjectOutlined /> },
    {
      path: NAV_LABEL_TO_PATH['My Course'],
      label: 'My Courses',
      icon: <FileAddOutlined />,
    },
  ],
}

const CLASS_SCHEDULE: DynamicNav = {
  path: NAV_LABEL_TO_PATH['Class Schedule'],
  label: 'Class Schedule',
  icon: <CalendarOutlined />,
}

const PROFILE: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Profile,
  label: 'Profile',
  isHideInSiderNav: true,
  icon: <ProfileOutlined />,
}

const MESSAGES: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Message,
  label: 'Message',
  icon: <MessageOutlined />,
}

export const ROUTES: Map<Role, DynamicNav[]> = new Map([
  ['manager', [OVERVIEW, STUDENTS, TEACHERS, COURSES, MESSAGES]],
  ['teacher', [OVERVIEW, CLASS_SCHEDULE, STUDENTS, COURSES, PROFILE, MESSAGES]],
  ['student', [OVERVIEW, STUDENT_COURSES, CLASS_SCHEDULE, PROFILE, MESSAGES]],
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
