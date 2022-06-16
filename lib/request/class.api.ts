import { getInstance } from './common'
import { GetClassScheduleRequest, GetClassScheduleResponse } from '../model'

const getClassSchedule = (
  params: GetClassScheduleRequest
): Promise<GetClassScheduleResponse> => getInstance('/class/schedule')

export { getClassSchedule }
