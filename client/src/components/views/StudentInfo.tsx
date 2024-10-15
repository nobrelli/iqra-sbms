import { useGetStudentBalance } from "@/api/mockStudents"
import { Student } from "@/types/schemas"
import { formatAmount, formatDate, formatDateTime, joinNames } from '@/utils/formatters'
import { lookupEnrollmentStatus, lookupPayingStatus } from '@/utils/lookups'
import { Card, Divider, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core'

type StudentInfo = Record<string, string>

const InfoTable = ({ data }: { data: StudentInfo }) => {
  return (
    <Table>
      <Table.Tbody>
        {Object.entries(data).map((item, index) => (
          <Table.Tr key={index}>
            <Table.Td c="dimmed">{item[0]}</Table.Td>
            <Table.Td>{item[1]}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export const StudentInfo = ({ student }: { student: Student }) => {
  const { balance, isLoading } = useGetStudentBalance(student.id.toString())
  const generalData: StudentInfo = {
    'Date registered': formatDateTime(student.regDate.toString()),
    'Student type': student.type,
    'Program': student.course,
    'Enrollment status': lookupEnrollmentStatus(student.enrollmentStatus),
    'Paying status': lookupPayingStatus(student.payingStatus),
    'Total units finished': student.totalUnitsFinished.toString(),
    'GPA': student.gpa.toString(),
    'Last school attended': student.lastSchool
  }
  const personalData: StudentInfo = {
    'Student ID': student.id.toString(),
    'Last name': student.lastName,
    'First name': student.firstName,
    'Middle name': student.midName,
    'Extension name': student.extName,
    'Gender': student.gender,
    'Date of birth': formatDate(student.dob.toString()),
    'Age': student.age.toString(),
    'Birth place': student.birthPlace,
    'Civil status': student.civilStatus,
    'Religion': student.religion
  }
  const addressContactData: StudentInfo = {
    'Country': student.country,
    'Province': student.province,
    'City': student.city,
    'Street': student.street,
    'Email': student.email,
    'Phone number': student.phone
  }
  const parentsData: StudentInfo = {
    'Father\'s last name': student.fatherLastName,
    'Father\'s first name': student.fatherFirstName,
    'Father\'s middle name': student.fatherMidName,
    'Father\'s extension name': student.fatherExtName,
    'Father\'s occupation': student.fatherWork,
    'Father\'s contact number': student.fatherPhone,
    'Mother\'s maiden name': student.motherMaidenName,
    'Mother\'s last name': student.motherLastName,
    'Mother\'s first name': student.motherFirstName,
    'Mother\'s middle name': student.motherMidName,
    'Mother\'s occupation': student.motherWork,
    'Mother\'s contact number': student.motherPhone,
    'DSWD house no.': student.dswdHouseNo,
    'Household income': student.householdIncome
  }
  const emergencyData: StudentInfo = {
    'Emergency name': student.emergencyName,
    'Emergency relationship': student.emergencyRelationship,
    'Emergency contact number': student.emergencyContact
  }

  return (
    <Stack>
      <Card withBorder>
        <SimpleGrid cols={2}>
          <Stack gap={1}>
            <Text c="dimmed" size="sm">{student.id}</Text>
            <Title order={4} tt="uppercase">
              {joinNames(
                student.lastName,
                student.firstName,
                student.midName
              )}
            </Title>
          </Stack>
          <Stack gap={1}>
            <Text c="dimmed" size="sm">Outstanding Balance</Text>
            <Title order={4}>{isLoading ? '...' : formatAmount(balance)}</Title>
          </Stack>
        </SimpleGrid>
      </Card>
      <Card withBorder>
        <Title order={4}>General</Title>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <InfoTable data={generalData} />
      </Card>
      <Card withBorder>
        <Title order={4}>Personal</Title>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <InfoTable data={personalData} />
      </Card>
      <Card withBorder>
        <Title order={4}>Address & Contact Info</Title>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <InfoTable data={addressContactData} />
      </Card>
      <Card withBorder>
        <Title order={4}>Parents</Title>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <InfoTable data={parentsData} />
      </Card>
      <Card withBorder>
        <Title order={4}>Emergency Contact</Title>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <InfoTable data={emergencyData} />
      </Card>
    </Stack>
  )
}