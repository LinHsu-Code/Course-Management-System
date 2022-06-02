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
  isNotPage: true,
  subNav: [
    {
      path: NAV_LABEL_TO_PATH.Student,
      label: 'Student List',
      icon: <TeamOutlined />,
    },
    {
      path: NAV_LABEL_TO_PATH.Detail,
      label: 'Detail',
      isHideInSiderNav: true,
    },
  ],
}

const COURSES: DynamicNav = {
  path: NAV_LABEL_TO_PATH.Course,
  label: 'Course',
  icon: <ReadOutlined />,
  isNotPage: true,
  subNav: [
    {
      path: NAV_LABEL_TO_PATH.Course,
      label: 'All Courses',
      icon: <ProjectOutlined />,
    },
    {
      path: NAV_LABEL_TO_PATH.Detail,
      label: 'Detail',
      isHideInSiderNav: true,
    },
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
  isNotPage: true,
  subNav: [
    {
      path: NAV_LABEL_TO_PATH.Teacher,
      label: 'Teacher List',
      icon: <TeamOutlined />,
    },
    {
      path: NAV_LABEL_TO_PATH.Detail,
      label: 'Detail',
      isHideInSiderNav: true,
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
  isNotPage: true,
  subNav: [
    {
      path: NAV_LABEL_TO_PATH.Course,
      label: 'All Courses',
      icon: <ProjectOutlined />,
    },
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

const MANAGER_ROUTES: DynamicNav = {
  path: '',
  label: 'CMS MANAGER SYSTEM',
  subNav: [OVERVIEW, STUDENTS, TEACHERS, COURSES, MESSAGES],
}

const TEACHER_ROUTES: DynamicNav = {
  path: '',
  label: 'CMS TEACHER SYSTEM',
  subNav: [OVERVIEW, CLASS_SCHEDULE, STUDENTS, COURSES, PROFILE, MESSAGES],
}

const STUDENT_ROUTES: DynamicNav = {
  path: '',
  label: 'CMS STUDENT SYSTEM',
  subNav: [OVERVIEW, STUDENT_COURSES, CLASS_SCHEDULE, PROFILE, MESSAGES],
}

export const ROUTES: Map<Role, DynamicNav[]> = new Map([
  ['manager', [MANAGER_ROUTES]],
  ['teacher', [TEACHER_ROUTES]],
  ['student', [STUDENT_ROUTES]],
])
