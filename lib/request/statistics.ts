import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import { GetStatisticsOverviewResponse } from '../../lib/model'

const getStatisticsOverview = (): Promise<GetStatisticsOverviewResponse> =>
  getInstance('/statistics/overview')

export { getStatisticsOverview }
