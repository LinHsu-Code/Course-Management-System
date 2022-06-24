import { getInstance } from './common'
import {
  GetCourseStatisticsResponse,
  GetStatisticsOverviewResponse,
  GetTeacherStatisticsResponse,
  GetStudentStatisticsRequest,
} from '../model'
import axios from 'axios'

const getStatisticsOverview = (): Promise<GetStatisticsOverviewResponse> =>
  getInstance('/statistics/overview')

const getStudentStatistics = <T>(
  params: GetStudentStatisticsRequest
): Promise<T> => getInstance('/statistics/student', params)

const getTeacherStatistics = (): Promise<GetTeacherStatisticsResponse> =>
  getInstance('/statistics/teacher')

const getCourseStatistics = (): Promise<GetCourseStatisticsResponse> =>
  getInstance('/statistics/course')

const getWorldMap = async () => {
  return await axios.get(
    'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
  )
}

export {
  getStatisticsOverview,
  getStudentStatistics,
  getTeacherStatistics,
  getCourseStatistics,
  getWorldMap,
}
