export type LoginFields = {
  adminId: string
  password: string
}

export type ChangePasswordFields = {
  currentPassword: string
  newPassword: string
  rePassword: string
}

export type SharedFields = {
  readonly id?: string
  readonly created?: string
  readonly updated?: string
}

export type Paginated<Fields extends SharedFields> = {
  readonly pageCount?: number
  readonly rowCount: number
  readonly fields: Fields[]
}

export type Fee = SharedFields & {
  description: string
  amount: number
}

export type Discount = SharedFields & {
  isPercent: boolean
  description: string
  amount: number
  validFrom?: string
  validUntil?: string
}

export type Student = {
  readonly id: string
  readonly type: string
  readonly course: string
  readonly yearLevel: string
  readonly lastName: string
  readonly firstName: string
  readonly midName: string
  readonly extName: string
  readonly country: string
  readonly province: string
  readonly city: string
  readonly street: string
  readonly dob: string
  readonly birthPlace: string
  readonly age: number
  readonly gender: string
  readonly civilStatus: string
  readonly religion: string
  readonly email: string
  readonly phone: string
  readonly lastSchool: string
  readonly fatherLastName: string
  readonly fatherFirstName: string
  readonly fatherMidName: string
  readonly fatherExtName: string
  readonly fatherWork: string
  readonly fatherPhone: string
  readonly motherMaidenName: string
  readonly motherLastName: string
  readonly motherFirstName: string
  readonly motherMidName: string
  readonly motherWork: string
  readonly motherPhone: string
  readonly dswdHouseNo: string
  readonly householdIncome: string
  readonly emergencyName: string
  readonly emergencyRelationship: string
  readonly emergencyContact: string
  readonly regDate: string
  readonly enrollmentStatus: string
  readonly payingStatus: string
  readonly totalUnitsFinished: number
  readonly gpa: number
}

export type StudentLite = // Stripped down version
  Pick<Student,
    'id'
    | 'lastName'
    | 'firstName'
    | 'midName'
    | 'type'
    | 'payingStatus'
    | 'course'
    | 'yearLevel'
    | 'phone'
    | 'email'
  >

export type Bill = SharedFields & {
  readonly studentId?: string
  remarks: string
  status: string
  totalAmount: number
  totalPaid: number
  dueDate: string
  fees: string[]
  discounts?: string[]
}

export type Payment = SharedFields & {
  readonly billId: string
  amount: number
  method: string
  remarks: string
}

export type Receipt = SharedFields & {
  readonly paymentId: string
  totalPaid: number
  balance: number
  payment: Payment
}

export type Outflow = SharedFields & {
  description: string
  amount: number
}