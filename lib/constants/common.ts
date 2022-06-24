import { MessageType, Weekday } from '../model'

export const COUNTRY_LIST: string[] = [
  'China',
  'New Zealand',
  'Canada',
  'Australia',
]

export const STUDENT_TYPE: string[] = ['Tester', 'Developer']

export const PROGRAM_LANGUAGE_COLORS: string[] = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'blue',
  'purple',
  'red',
  'lime',
]

export const Weekdays: Weekday[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const WeekdaysToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

export const NAV_LABEL_TO_PATH = {
  Overview: '',
  Teacher: 'teachers',
  Student: 'students',
  Course: 'courses',
  'Add Course': 'add-course',
  'Edit Course': 'edit-course',
  'Class Schedule': 'schedule',
  'My Course': 'own',
  Profile: 'profile',
  Message: 'message',
  Detail: '[id]',
}

export const ValidateMessages = {
  required: "'${name}' is required!",
  types: {
    email: "'${name}' is not a valid email!",
    number: "'${name}' is not a valid number!",
  },
  number: {
    range: "'${name}' must be between ${min} and ${max}",
  },
  string: {
    len: "'${name}' must be exactly ${len} characters",
    min: "'${name}' must be at least ${min} characters",
    max: "'${name}' cannot be longer than ${max} characters",
    range: "'${name}' must be between ${min} and ${max} characters",
  },
}

export const MessageTypes: MessageType[] = ['notification', 'message']

export const SkillLevels = [
  'Know',
  'Practiced',
  'Comprehend',
  'Expert',
  'Master',
]

export const phone = /^1[3-9]\d{9}$/

export enum Gender {
  Male = 1,
  Female,
}

export const OverviewBackground = ['#1890ff', '#673bb7', '#ffaa16']
