import { BadgeStatus, CourseSearchBy } from '../model'

export const CourseStatusText = ['pending', 'processing', 'finished']

export const CourseBadgeStatus: BadgeStatus[] = [
  'warning',
  'processing',
  'success',
]

export const CourseStatusColor = ['gold', 'blue', 'green']

export const CourseSearchBySelect: { value: CourseSearchBy; label: string }[] =
  [
    { value: 'uid', label: 'Code' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Category' },
  ]

export const CourseDurationUnit = ['year', 'month', 'day', 'week', 'hour']

export enum CourseStatus {
  pending = 0,
  active,
  done,
}
