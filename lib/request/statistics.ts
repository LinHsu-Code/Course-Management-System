import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import { GetOverviewResponse } from '../../lib/model'

const getOverview = (): Promise<GetOverviewResponse> =>
  getInstance('/statistics/overview')

export { getOverview }
