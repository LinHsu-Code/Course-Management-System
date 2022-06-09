import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import {
  GetCourseStatisticsResponse,
  GetStatisticsOverviewResponse,
  GetStudentStatisticsResponse,
  GetTeacherStatisticsResponse,
} from '../model'
import axios from 'axios'

const getStatisticsOverview = (): Promise<GetStatisticsOverviewResponse> =>
  getInstance('/statistics/overview')

const getStudentStatistics = (): Promise<GetStudentStatisticsResponse> =>
  getInstance('/statistics/student')

const getTeacherStatistics = (): Promise<GetTeacherStatisticsResponse> =>
  getInstance('/statistics/teacher')

const getCourseStatistics = (): Promise<GetCourseStatisticsResponse> =>
  getInstance('/statistics/course')

const getWorld = async () => {
  return await axios.get(
    'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
  )
}

export {
  getStatisticsOverview,
  getStudentStatistics,
  getTeacherStatistics,
  getCourseStatistics,
  getWorld,
}
