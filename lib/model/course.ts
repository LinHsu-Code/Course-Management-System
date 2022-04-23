export interface CourseType {
  id: number
  name: string
  courseId?: number
}

export interface StudentCourse {
  createdAt: Date
  updatedAt: Date
  id: number
  courseDate: Date
  studentId: number
  name: string
  courseId: number
  type: any[]
}
