import { Student } from "@/types/schemas";

// This is just for testing/mocking purposes
const data: Student[] = [
  {
    "age": 76,
    "birthPlace": "Elit Aliquam Sunt L",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BEED",
    "dob": "2002-05-08",
    "dswdHouseNo": "Dolor Quis Asperiore",
    "email": "bubeku@mailinator.com",
    "emergencyContact": "+1 (116) 511-4646",
    "emergencyName": "Quynn Conner",
    "emergencyRelationship": "Nisi Ea Aperiam Libe",
    "enrollmentStatus": "FE",
    "extName": "Karly Delaney",
    "fatherExtName": "Gareth Spears",
    "fatherFirstName": "Ethan",
    "fatherLastName": "Best",
    "fatherMidName": "Calista Meadows",
    "fatherPhone": "+1 (854) 142-4422",
    "fatherWork": "Enim Molestias Dolor",
    "firstName": "Rae",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "540",
    "id": "2024100008",
    "lastName": "Fernandez",
    "lastSchool": "Odio Veniam Dolor E",
    "midName": "Madaline Merrill",
    "motherFirstName": "Julie",
    "motherLastName": "Wallace",
    "motherMaidenName": "Christopher Nichols",
    "motherMidName": "Thor Hutchinson",
    "motherPhone": "+1 (309) 438-6596",
    "motherWork": "Est Quis Unde Quidem",
    "payingStatus": "Regular",
    "phone": "+1 (392) 298-1113",
    "province": "test",
    "regDate": "2024-08-27T02:24:38.930742Z",
    "religion": "Eu Qui Occaecat Aute",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Freshman"
  },
  {
    "age": 32,
    "birthPlace": "Sequi Cumque Ab Duis",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "TCP",
    "dob": "1982-10-10",
    "dswdHouseNo": "Laboris Velit Ipsa",
    "email": "caja@mailinator.com",
    "emergencyContact": "+1 (207) 738-7079",
    "emergencyName": "Avram Houston",
    "emergencyRelationship": "Soluta Quaerat Cupid",
    "enrollmentStatus": "FE",
    "extName": "Martena Schwartz",
    "fatherExtName": "Sebastian Copeland",
    "fatherFirstName": "Noelle",
    "fatherLastName": "Hebert",
    "fatherMidName": "Kylynn Irwin",
    "fatherPhone": "+1 (382) 204-2743",
    "fatherWork": "In Ratione In Quibus",
    "firstName": "Slade",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "262",
    "id": "2024100009",
    "lastName": "Kirk",
    "lastSchool": "Sed Commodo Repellen",
    "midName": "Wilma Benjamin",
    "motherFirstName": "Brendan",
    "motherLastName": "Everett",
    "motherMaidenName": "Sharon Pratt",
    "motherMidName": "Micah Gaines",
    "motherPhone": "+1 (647) 704-1803",
    "motherWork": "Eos Aliquam Aliquam",
    "payingStatus": "Regular",
    "phone": "+1 (551) 475-3598",
    "province": "test",
    "regDate": "2024-08-27T02:25:01.169070Z",
    "religion": "Nostrum Velit Et Ull",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Senior"
  },
  {
    "age": 13,
    "birthPlace": "Quae Vel Sunt Nobis",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "BEED",
    "dob": "1970-10-25",
    "dswdHouseNo": "Consectetur Id Sim",
    "email": "bytawyvyw@mailinator.com",
    "emergencyContact": "+1 (262) 891-1638",
    "emergencyName": "Leilani Swanson",
    "emergencyRelationship": "Incidunt Illum Ea",
    "enrollmentStatus": "FE",
    "extName": "Isadora Hull",
    "fatherExtName": "Mira Rodriquez",
    "fatherFirstName": "Lani",
    "fatherLastName": "Mcdowell",
    "fatherMidName": "Daniel Terrell",
    "fatherPhone": "+1 (305) 438-9778",
    "fatherWork": "Consequatur In In Se",
    "firstName": "Harriet",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "464",
    "id": "2024100010",
    "lastName": "Sanford",
    "lastSchool": "Voluptas Perferendis",
    "midName": "Montana Grant",
    "motherFirstName": "Stuart",
    "motherLastName": "Frazier",
    "motherMaidenName": "John Holloway",
    "motherMidName": "Tana Lambert",
    "motherPhone": "+1 (662) 623-6156",
    "motherWork": "Id Culpa Eum Minim",
    "payingStatus": "Regular",
    "phone": "+1 (793) 674-8907",
    "province": "test",
    "regDate": "2024-08-27T02:26:03.935739Z",
    "religion": "Temporibus Rem Est S",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Senior"
  },
  {
    "age": 23,
    "birthPlace": "Lanao Del Sur",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "BSCrim",
    "dob": "2024-08-11",
    "dswdHouseNo": "Not Applicable",
    "email": "sohrahmacapanton@yahoo.com",
    "emergencyContact": "09212274567",
    "emergencyName": "Alisanie Lomala",
    "emergencyRelationship": "Brother",
    "enrollmentStatus": "FE",
    "extName": "",
    "fatherExtName": "N/A",
    "fatherFirstName": "Efd",
    "fatherLastName": "Abcd",
    "fatherMidName": "Ed",
    "fatherPhone": "not applicable",
    "fatherWork": "Farmer",
    "firstName": "Junair",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "30000",
    "id": "2024100011",
    "lastName": "Tocalo",
    "lastSchool": "Datu Palawan Disomimba MNHS",
    "midName": "Casar",
    "motherFirstName": "Rrreee",
    "motherLastName": "Ssdfff",
    "motherMaidenName": "Addfg",
    "motherMidName": "N/A",
    "motherPhone": "091202039387",
    "motherWork": "Housewife",
    "payingStatus": "Regular",
    "phone": "09515579602",
    "province": "test",
    "regDate": "2024-08-27T06:11:34.539223Z",
    "religion": "Islam",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Freshman"
  },
  {
    "age": 30,
    "birthPlace": "Eos soluta repellen",
    "city": "test",
    "civilStatus": "separated",
    "country": "Philippines",
    "course": "BEED",
    "dob": "2011-06-21",
    "dswdHouseNo": "Est tempor quos assu",
    "email": "rogej@mailinator.com",
    "emergencyContact": "+1 (442) 793-7032",
    "emergencyName": "Jameson Dudley",
    "emergencyRelationship": "Eiusmod recusandae",
    "enrollmentStatus": "FE",
    "extName": "Giacomo Steele432",
    "fatherExtName": "Teegan Tyler",
    "fatherFirstName": "Griffith",
    "fatherLastName": "Koch",
    "fatherMidName": "Elizabeth Macias",
    "fatherPhone": "+1 (547) 593-3212",
    "fatherWork": "Laboris officia atqu",
    "firstName": "Ebony",
    "gender": "male",
    "gpa": 3.1,
    "householdIncome": "825321321",
    "id": "2024100089",
    "lastName": "Cohen1",
    "lastSchool": "Possimus asperiores",
    "midName": "Perry Waller543",
    "motherFirstName": "Amal",
    "motherLastName": "Fleming",
    "motherMaidenName": "Cally Rogers",
    "motherMidName": "Arsenio Barrera",
    "motherPhone": "+1 (876) 602-2702",
    "motherWork": "Dolore cum sed aut c",
    "payingStatus": "double_orphan",
    "phone": "+1 (343) 811-7972",
    "province": "test",
    "regDate": "2024-09-15T03:23:54.141227Z",
    "religion": "Perspiciatis volupt1",
    "street": "test",
    "totalUnitsFinished": 3,
    "type": "old",
    "yearLevel": "Senior"
  },
  {
    "age": 53,
    "birthPlace": "Eum reiciendis persp",
    "city": "test",
    "civilStatus": "separated",
    "country": "Philippines",
    "course": "BSSW",
    "dob": "2015-04-17",
    "dswdHouseNo": "Perspiciatis fugiat",
    "email": "fowovamuv@mailinator.com",
    "emergencyContact": "+1 (962) 167-5866",
    "emergencyName": "Alexander Vang",
    "emergencyRelationship": "Quo vel qui alias ex",
    "enrollmentStatus": "PE",
    "extName": "Rigel Mccoy",
    "fatherExtName": "Adele Potter",
    "fatherFirstName": "Clinton",
    "fatherLastName": "Sanchez",
    "fatherMidName": "Chandler Ashley",
    "fatherPhone": "+1 (582) 451-4555",
    "fatherWork": "Corporis molestiae n",
    "firstName": "Warren",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "553",
    "id": "2024100108",
    "lastName": "Lowe",
    "lastSchool": "Soluta deleniti in u",
    "midName": "Xantha Pitts",
    "motherFirstName": "Chelsea",
    "motherLastName": "Chang",
    "motherMaidenName": "Bryar Valenzuela",
    "motherMidName": "Otto Dudley",
    "motherPhone": "+1 (487) 735-4463",
    "motherWork": "Minim temporibus Nam",
    "payingStatus": "sibling",
    "phone": "+1 (313) 701-2558",
    "province": "test",
    "regDate": "2024-09-23T18:56:57.972130Z",
    "religion": "Dolor unde omnis ame",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Sophomore"
  },
  {
    "age": 76,
    "birthPlace": "Cillum omnis qui ver",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BEED",
    "dob": "1997-02-16",
    "dswdHouseNo": "Voluptatum ad qui si",
    "email": "mepemola@mailinator.com",
    "emergencyContact": "+1 (462) 543-5073",
    "emergencyName": "Tamara Harrington",
    "emergencyRelationship": "Nisi occaecat ea off",
    "enrollmentStatus": "PE",
    "extName": "Kyle Bentley",
    "fatherExtName": "Zephr Maddox",
    "fatherFirstName": "Lucius",
    "fatherLastName": "Reyes",
    "fatherMidName": "Cheyenne Castillo",
    "fatherPhone": "+1 (809) 358-4347",
    "fatherWork": "Autem perspiciatis",
    "firstName": "Daphne",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "959",
    "id": "2024100109",
    "lastName": "Bolton",
    "lastSchool": "Sed enim odio aliqui",
    "midName": "Kaitlin Hutchinson",
    "motherFirstName": "Malachi",
    "motherLastName": "Cleveland",
    "motherMaidenName": "Bell Durham",
    "motherMidName": "Aspen Lott",
    "motherPhone": "+1 (873) 837-2222",
    "motherWork": "Amet et eaque lauda",
    "payingStatus": "double_orphan",
    "phone": "+1 (731) 381-9473",
    "province": "test",
    "regDate": "2024-09-23T18:57:00.621303Z",
    "religion": "Optio et Nam evenie",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Freshman"
  },
  {
    "age": 98,
    "birthPlace": "Lorem ea dolores mai",
    "city": "test",
    "civilStatus": "separated",
    "country": "Philippines",
    "course": "BSBA-HRM",
    "dob": "1977-02-25",
    "dswdHouseNo": "Amet est aliqua Vo",
    "email": "tapyp@mailinator.com",
    "emergencyContact": "+1 (789) 108-2163",
    "emergencyName": "Galvin Olsen",
    "emergencyRelationship": "Culpa adipisci mole",
    "enrollmentStatus": "PE",
    "extName": "Brynne Finley",
    "fatherExtName": "Zeus Beasley",
    "fatherFirstName": "Zenia",
    "fatherLastName": "English",
    "fatherMidName": "Yvonne Rodriquez",
    "fatherPhone": "+1 (546) 504-3849",
    "fatherWork": "Ea praesentium aut c",
    "firstName": "Hyacinth",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "137",
    "id": "2024100110",
    "lastName": "Perkins",
    "lastSchool": "Enim pariatur Dicta",
    "midName": "Raymond Fields",
    "motherFirstName": "Blaze",
    "motherLastName": "Santana",
    "motherMaidenName": "Montana Reeves",
    "motherMidName": "Hayes Clark",
    "motherPhone": "+1 (275) 159-7813",
    "motherWork": "Voluptatum voluptate",
    "payingStatus": "orphan",
    "phone": "+1 (212) 615-8979",
    "province": "test",
    "regDate": "2024-09-23T18:57:03.038674Z",
    "religion": "Fugiat tenetur illu",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Sophomore"
  },
  {
    "age": 59,
    "birthPlace": "Ea molestias hic dol",
    "city": "test",
    "civilStatus": "widower",
    "country": "Philippines",
    "course": "TCP",
    "dob": "1978-09-28",
    "dswdHouseNo": "Non corporis dolorem",
    "email": "wocijab@mailinator.com",
    "emergencyContact": "+1 (497) 602-5627",
    "emergencyName": "Eaton Chapman",
    "emergencyRelationship": "Quas quod corrupti",
    "enrollmentStatus": "PE",
    "extName": "Hop Oneill",
    "fatherExtName": "Murphy Hoover",
    "fatherFirstName": "Mechelle",
    "fatherLastName": "Bishop",
    "fatherMidName": "Jemima Michael",
    "fatherPhone": "+1 (939) 661-6751",
    "fatherWork": "Molestias enim quod",
    "firstName": "Whoopi",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "59",
    "id": "2024100111",
    "lastName": "May",
    "lastSchool": "Culpa tempora nemo",
    "midName": "Sasha Chase",
    "motherFirstName": "Amelia",
    "motherLastName": "Potter",
    "motherMaidenName": "Uriah Kerr",
    "motherMidName": "Bert Griffith",
    "motherPhone": "+1 (267) 395-4815",
    "motherWork": "Qui fuga Accusantiu",
    "payingStatus": "double_orphan",
    "phone": "+1 (625) 166-4169",
    "province": "test",
    "regDate": "2024-09-23T18:57:05.190095Z",
    "religion": "Aut voluptate ullamc",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Freshman"
  },
  {
    "age": 57,
    "birthPlace": "Quo sunt modi eu ad",
    "city": "test",
    "civilStatus": "separated",
    "country": "Philippines",
    "course": "BEED",
    "dob": "1978-06-23",
    "dswdHouseNo": "Officiis sunt distin",
    "email": "wikobo@mailinator.com",
    "emergencyContact": "+1 (258) 738-3871",
    "emergencyName": "Shelby Barnett",
    "emergencyRelationship": "Non nihil autem in d",
    "enrollmentStatus": "PE",
    "extName": "Adena Hinton",
    "fatherExtName": "Sonia Mcbride",
    "fatherFirstName": "Jerry",
    "fatherLastName": "House",
    "fatherMidName": "Teagan Mccormick",
    "fatherPhone": "+1 (674) 728-2666",
    "fatherWork": "Magni est adipisici",
    "firstName": "Allen",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "116",
    "id": "2024100112",
    "lastName": "Harrell",
    "lastSchool": "Minima culpa cupida",
    "midName": "Hilary Howe",
    "motherFirstName": "Ina",
    "motherLastName": "Willis",
    "motherMaidenName": "Molly Wiggins",
    "motherMidName": "Shelby Sampson",
    "motherPhone": "+1 (888) 168-2931",
    "motherWork": "Quo eiusmod proident",
    "payingStatus": "orphan",
    "phone": "+1 (766) 535-5498",
    "province": "test",
    "regDate": "2024-09-23T18:57:09.763950Z",
    "religion": "Fugiat a rerum veli",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Junior"
  },
  {
    "age": 87,
    "birthPlace": "Delectus et qui dol",
    "city": "test",
    "civilStatus": "separated",
    "country": "Philippines",
    "course": "BSBA-HRM",
    "dob": "1996-12-04",
    "dswdHouseNo": "Minima laborum venia",
    "email": "kohek@mailinator.com",
    "emergencyContact": "+1 (212) 988-3148",
    "emergencyName": "Sybil Gutierrez",
    "emergencyRelationship": "Sit ipsa quis perfe",
    "enrollmentStatus": "PE",
    "extName": "Coby Ayers",
    "fatherExtName": "Clarke Farley",
    "fatherFirstName": "Imogene",
    "fatherLastName": "Owen",
    "fatherMidName": "May Dunn",
    "fatherPhone": "+1 (416) 763-6933",
    "fatherWork": "Fugiat vel dolorem n",
    "firstName": "Dakota",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "71",
    "id": "2024100113",
    "lastName": "Simon",
    "lastSchool": "Eu aperiam rerum vol",
    "midName": "Quinn Estes",
    "motherFirstName": "Lois",
    "motherLastName": "Robles",
    "motherMaidenName": "Carl Dickerson",
    "motherMidName": "Janna Rosales",
    "motherPhone": "+1 (703) 708-3188",
    "motherWork": "Expedita quis autem",
    "payingStatus": "okile_scholar",
    "phone": "+1 (827) 923-7593",
    "province": "test",
    "regDate": "2024-09-23T18:57:12.841295Z",
    "religion": "Nobis porro cupidata",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Sophomore"
  },
  {
    "age": 84,
    "birthPlace": "Enim necessitatibus",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "TCP",
    "dob": "1989-03-26",
    "dswdHouseNo": "Voluptates maiores a",
    "email": "durofotat@mailinator.com",
    "emergencyContact": "+1 (622) 414-4619",
    "emergencyName": "Holmes Kinney",
    "emergencyRelationship": "Aut fuga Similique",
    "enrollmentStatus": "PE",
    "extName": "Reuben Collins",
    "fatherExtName": "Chanda Workman",
    "fatherFirstName": "Rajah",
    "fatherLastName": "Phillips",
    "fatherMidName": "Gillian Walsh",
    "fatherPhone": "+1 (939) 767-6938",
    "fatherWork": "Voluptas velit numqu",
    "firstName": "Rose",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "29",
    "id": "2024100116",
    "lastName": "Fernandez",
    "lastSchool": "Cillum dolore est si",
    "midName": "Solomon Cain",
    "motherFirstName": "Mufutau",
    "motherLastName": "Saunders",
    "motherMaidenName": "Xander Lara",
    "motherMidName": "Griffin Stephens",
    "motherPhone": "+1 (546) 505-5453",
    "motherWork": "Ut rerum vitae aut a",
    "payingStatus": "academic_scholar",
    "phone": "+1 (775) 128-6577",
    "province": "test",
    "regDate": "2024-09-23T19:00:03.998548Z",
    "religion": "Iure esse facere es",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Sophomore"
  },
  {
    "age": 35,
    "birthPlace": "Quis nobis maxime ex",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "BEED",
    "dob": "2005-05-23",
    "dswdHouseNo": "Repellendus Mollit",
    "email": "fodizac@mailinator.com",
    "emergencyContact": "+1 (672) 885-5662",
    "emergencyName": "Arthur Greene",
    "emergencyRelationship": "Laboriosam eligendi",
    "enrollmentStatus": "PE",
    "extName": "Erin Buchanan",
    "fatherExtName": "Orson Villarreal",
    "fatherFirstName": "Ray",
    "fatherLastName": "Bernard",
    "fatherMidName": "Mira Colon",
    "fatherPhone": "+1 (842) 741-4162",
    "fatherWork": "Quia enim ut delenit",
    "firstName": "Libby",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "824",
    "id": "2024100141",
    "lastName": "Slater",
    "lastSchool": "Provident ut aperia",
    "midName": "Shad Spence",
    "motherFirstName": "Jemima",
    "motherLastName": "Reese",
    "motherMaidenName": "Rebecca Matthews",
    "motherMidName": "Kevyn Clements",
    "motherPhone": "+1 (954) 827-3072",
    "motherWork": "Deleniti consectetur",
    "payingStatus": "orphan",
    "phone": "+1 (138) 763-8593",
    "province": "test",
    "regDate": "2024-09-28T14:18:28.768478Z",
    "religion": "Necessitatibus ipsum",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Junior"
  },
  {
    "age": 73,
    "birthPlace": "Ut consequatur Nost",
    "city": "test",
    "civilStatus": "widower",
    "country": "Philippines",
    "course": "BSIT",
    "dob": "1988-08-29",
    "dswdHouseNo": "Voluptas et impedit",
    "email": "kuhykoq@mailinator.com",
    "emergencyContact": "+1 (122) 106-3981",
    "emergencyName": "Blythe Underwood",
    "emergencyRelationship": "Molestiae qui aliqui",
    "enrollmentStatus": "PE",
    "extName": "Lara Russo",
    "fatherExtName": "Jin Patterson",
    "fatherFirstName": "Hoyt",
    "fatherLastName": "Harvey",
    "fatherMidName": "Tallulah Mcgee",
    "fatherPhone": "+1 (473) 927-1457",
    "fatherWork": "Nam quod et optio p",
    "firstName": "Nissim",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "220",
    "id": "2024100145",
    "lastName": "Kent",
    "lastSchool": "Proident cillum nec",
    "midName": "Deanna Fischer",
    "motherFirstName": "Kessie",
    "motherLastName": "Maxwell",
    "motherMaidenName": "Leo Duffy",
    "motherMidName": "Gabriel Rush",
    "motherPhone": "+1 (526) 434-2965",
    "motherWork": "Ut pariatur Proiden",
    "payingStatus": "orphan",
    "phone": "+1 (385) 474-6842",
    "province": "test",
    "regDate": "2024-09-28T17:18:38.408466Z",
    "religion": "Fugit eaque ut ea q",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Senior"
  },
  {
    "age": 70,
    "birthPlace": "Ipsum in praesentium",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BSSW",
    "dob": "1972-12-20",
    "dswdHouseNo": "Atque adipisci ipsum",
    "email": "vivi@mailinator.com",
    "emergencyContact": "+1 (435) 814-9748",
    "emergencyName": "Darryl Velasquez",
    "emergencyRelationship": "Consequatur totam i",
    "enrollmentStatus": "PE",
    "extName": "Cheryl Webster",
    "fatherExtName": "Rae Wolfe",
    "fatherFirstName": "Cora",
    "fatherLastName": "Thomas",
    "fatherMidName": "Clayton Ellis",
    "fatherPhone": "+1 (368) 403-5229",
    "fatherWork": "Ad culpa nisi ducim",
    "firstName": "Kane",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "704",
    "id": "2024100146",
    "lastName": "Cohen",
    "lastSchool": "Vitae laboriosam qu",
    "midName": "Jorden Morgan",
    "motherFirstName": "Nayda",
    "motherLastName": "Travis",
    "motherMaidenName": "Kennan Phelps",
    "motherMidName": "Isadora Haney",
    "motherPhone": "+1 (607) 409-9074",
    "motherWork": "Sit rem magna labor",
    "payingStatus": "orphan",
    "phone": "+1 (339) 972-9269",
    "province": "test",
    "regDate": "2024-09-28T17:21:54.824991Z",
    "religion": "Doloribus qui est an",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Junior"
  },
  {
    "age": 31,
    "birthPlace": "Sed Quia Consectetur",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "TCP",
    "dob": "2020-01-05",
    "dswdHouseNo": "Ad Sequi Eveniet Ap",
    "email": "rajyme@mailinator.com",
    "emergencyContact": "+1 (422) 224-7028",
    "emergencyName": "Ima Neal",
    "emergencyRelationship": "Ut Voluptatum Blandi",
    "enrollmentStatus": "PE",
    "extName": "Dominique William",
    "fatherExtName": "Ann Simon",
    "fatherFirstName": "Renee",
    "fatherLastName": "Cleveland",
    "fatherMidName": "Haley Cooley",
    "fatherPhone": "+1 (604) 305-3223",
    "fatherWork": "Et Quis Consectetur",
    "firstName": "Dane",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "861",
    "id": "2024100147",
    "lastName": "Francis",
    "lastSchool": "Eu Beatae Anim Et Ut",
    "midName": "Ciara Sanford",
    "motherFirstName": "Beverly",
    "motherLastName": "Patton",
    "motherMaidenName": "Neve Byrd",
    "motherMidName": "Nola Compton",
    "motherPhone": "+1 (128) 221-8333",
    "motherWork": "Quam Occaecat Volupt",
    "payingStatus": "okile_scholar",
    "phone": "+1 (151) 447-4479",
    "province": "test",
    "regDate": "2024-09-28T17:32:01.462154Z",
    "religion": "Culpa Et Omnis Nihil",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Freshman"
  },
  {
    "age": 92,
    "birthPlace": "Delectus Aliquip Eu",
    "city": "test",
    "civilStatus": "widower",
    "country": "Philippines",
    "course": "TCP",
    "dob": "2021-06-07",
    "dswdHouseNo": "Et Id Sint Velit Ad",
    "email": "zizipikuvi@mailinator.com",
    "emergencyContact": "+1 (905) 788-5381",
    "emergencyName": "Keaton Dickerson",
    "emergencyRelationship": "A Ipsum In Consequat",
    "enrollmentStatus": "PE",
    "extName": "Irma Knight",
    "fatherExtName": "Galvin Dominguez",
    "fatherFirstName": "Sawyer",
    "fatherLastName": "Sheppard",
    "fatherMidName": "Emerson Burke",
    "fatherPhone": "+1 (615) 374-8309",
    "fatherWork": "Ipsa Repellendus E",
    "firstName": "Leo",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "774",
    "id": "2024100148",
    "lastName": "Valentine",
    "lastSchool": "Omnis Aliquip Aut Om",
    "midName": "Georgia Hardin",
    "motherFirstName": "Bryar",
    "motherLastName": "Sweet",
    "motherMaidenName": "Kelly England",
    "motherMidName": "Yasir Reeves",
    "motherPhone": "+1 (354) 731-3453",
    "motherWork": "Incididunt Tenetur Q",
    "payingStatus": "sibling",
    "phone": "+1 (292) 102-3522",
    "province": "test",
    "regDate": "2024-09-28T17:32:14.891881Z",
    "religion": "Recusandae Architec",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Freshman"
  },
  {
    "age": 56,
    "birthPlace": "Quisquam Optio Ad P",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BEED",
    "dob": "1994-02-10",
    "dswdHouseNo": "Aut Aperiam Sint Do",
    "email": "dudygalud@mailinator.com",
    "emergencyContact": "+1 (341) 808-6312",
    "emergencyName": "Colorado Macdonald",
    "emergencyRelationship": "Dolore Omnis Delenit",
    "enrollmentStatus": "PE",
    "extName": "Hamish Weber",
    "fatherExtName": "Blake Lawrence",
    "fatherFirstName": "Charde",
    "fatherLastName": "Emerson",
    "fatherMidName": "Alma Boyer",
    "fatherPhone": "+1 (436) 935-6378",
    "fatherWork": "Omnis Laudantium Es",
    "firstName": "Rinah",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "756",
    "id": "2024100149",
    "lastName": "Cannon",
    "lastSchool": "Tenetur Ea Adipisci",
    "midName": "Emily Santiago",
    "motherFirstName": "Brady",
    "motherLastName": "Miles",
    "motherMaidenName": "Jasmine Palmer",
    "motherMidName": "Garrett Barber",
    "motherPhone": "+1 (769) 844-2338",
    "motherWork": "Aut Praesentium Qui",
    "payingStatus": "president_scholar",
    "phone": "+1 (882) 909-6098",
    "province": "test",
    "regDate": "2024-09-28T17:48:36.122323Z",
    "religion": "Facilis Ut Reprehend",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Freshman"
  },
  {
    "age": 80,
    "birthPlace": "Eaque Obcaecati Obca",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BSBA-HRM",
    "dob": "2001-07-21",
    "dswdHouseNo": "Eiusmod Lorem Vitae",
    "email": "hufocy@mailinator.com",
    "emergencyContact": "+1 (718) 887-7486",
    "emergencyName": "Devin Phillips",
    "emergencyRelationship": "Aut Accusantium Id",
    "enrollmentStatus": "PE",
    "extName": "Tobias Maddox",
    "fatherExtName": "Gabriel Mcclure",
    "fatherFirstName": "Slade",
    "fatherLastName": "Snyder",
    "fatherMidName": "Janna Stanton",
    "fatherPhone": "+1 (214) 851-9279",
    "fatherWork": "Cumque Unde Nam Impe",
    "firstName": "Elton",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "472",
    "id": "2024100150",
    "lastName": "Anthony",
    "lastSchool": "Labore Voluptatum Si",
    "midName": "Fleur Wooten",
    "motherFirstName": "Mannix",
    "motherLastName": "Meadows",
    "motherMaidenName": "Avye Hicks",
    "motherMidName": "Colleen Zimmerman",
    "motherPhone": "+1 (566) 311-3114",
    "motherWork": "Assumenda Quia Est P",
    "payingStatus": "orphan",
    "phone": "+1 (402) 406-5864",
    "province": "test",
    "regDate": "2024-09-28T17:49:23.796229Z",
    "religion": "Voluptate Expedita E",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Senior"
  },
  {
    "age": 58,
    "birthPlace": "Ipsa Nulla Dolor Co",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "TCP",
    "dob": "2001-07-11",
    "dswdHouseNo": "Totam Iusto Nobis Il",
    "email": "roziwybafy@mailinator.com",
    "emergencyContact": "+1 (244) 317-6162",
    "emergencyName": "Ursa Greene",
    "emergencyRelationship": "Consequuntur Aut Sin",
    "enrollmentStatus": "PE",
    "extName": "Ulla Stanley",
    "fatherExtName": "Raven Carney",
    "fatherFirstName": "Jack",
    "fatherLastName": "Sanford",
    "fatherMidName": "Wesley Patterson",
    "fatherPhone": "+1 (525) 535-2013",
    "fatherWork": "Aut Veritatis Nisi N",
    "firstName": "Adrienne",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "12",
    "id": "2024100151",
    "lastName": "Stephens",
    "lastSchool": "Sunt Aliquip Sunt V",
    "midName": "Elvis Gentry",
    "motherFirstName": "Graham",
    "motherLastName": "Swanson",
    "motherMaidenName": "Ursa Richardson",
    "motherMidName": "Clinton Pate",
    "motherPhone": "+1 (425) 265-5901",
    "motherWork": "Nesciunt Id Rerum E",
    "payingStatus": "okile_scholar",
    "phone": "+1 (533) 693-9869",
    "province": "test",
    "regDate": "2024-09-28T17:50:11.200920Z",
    "religion": "Quia Minim Dolorem L",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Sophomore"
  },
  {
    "age": 63,
    "birthPlace": "Rerum Culpa Eaque Do",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "BEED",
    "dob": "1989-12-21",
    "dswdHouseNo": "Tenetur Consequatur",
    "email": "papehym@mailinator.com",
    "emergencyContact": "+1 (315) 683-9821",
    "emergencyName": "Philip Macias",
    "emergencyRelationship": "Qui Ut Fugiat Except",
    "enrollmentStatus": "PE",
    "extName": "Baxter Schultz",
    "fatherExtName": "Gillian Holmes",
    "fatherFirstName": "Tanner",
    "fatherLastName": "Shannon",
    "fatherMidName": "Nerea Atkins",
    "fatherPhone": "+1 (487) 463-5343",
    "fatherWork": "Natus Rerum Tempora",
    "firstName": "Brendan",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "950",
    "id": "2024100152",
    "lastName": "Mcmillan",
    "lastSchool": "Corporis Cillum Irur",
    "midName": "Erasmus Roy",
    "motherFirstName": "Tarik",
    "motherLastName": "Snow",
    "motherMaidenName": "Dominic Adkins",
    "motherMidName": "Cassady Soto",
    "motherPhone": "+1 (465) 493-1461",
    "motherWork": "Excepturi Consequatu",
    "payingStatus": "academic_scholar",
    "phone": "+1 (953) 603-3538",
    "province": "test",
    "regDate": "2024-09-28T17:50:24.068365Z",
    "religion": "Non Quia Ea Est Lau",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "new",
    "yearLevel": "Sophomore"
  },
  {
    "age": 17,
    "birthPlace": "Possimus Hic Enim E",
    "city": "test",
    "civilStatus": "married",
    "country": "Philippines",
    "course": "BSBA-HRM",
    "dob": "2013-08-20",
    "dswdHouseNo": "Deserunt Velit Beat",
    "email": "wabuza@mailinator.com",
    "emergencyContact": "+1 (762) 352-1983",
    "emergencyName": "Britanni Pierce",
    "emergencyRelationship": "Consequatur Dolorem",
    "enrollmentStatus": "PE",
    "extName": "Piper Reyes",
    "fatherExtName": "Griffith Valenzuela",
    "fatherFirstName": "Hedwig",
    "fatherLastName": "Head",
    "fatherMidName": "Joelle Rodriguez",
    "fatherPhone": "+1 (495) 246-2185",
    "fatherWork": "Excepturi Dolorem Es",
    "firstName": "Aiko",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "481",
    "id": "2024100153",
    "lastName": "Short",
    "lastSchool": "Magnam Quasi Totam V",
    "midName": "Ramona Key",
    "motherFirstName": "Zena",
    "motherLastName": "Dudley",
    "motherMaidenName": "Kiayada Preston",
    "motherMidName": "Vladimir Cole",
    "motherPhone": "+1 (471) 357-1559",
    "motherWork": "Possimus Architecto",
    "payingStatus": "sibling",
    "phone": "+1 (743) 349-3242",
    "province": "test",
    "regDate": "2024-09-28T17:50:32.832066Z",
    "religion": "Dolor Exercitation E",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "old",
    "yearLevel": "Sophomore"
  },
  {
    "age": 82,
    "birthPlace": "Eum Tempor Ullam Fug",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "TCP",
    "dob": "1976-07-03",
    "dswdHouseNo": "Vel Quasi Officia Ex",
    "email": "pibuc@mailinator.com",
    "emergencyContact": "+1 (218) 299-5273",
    "emergencyName": "Griffin Mitchell",
    "emergencyRelationship": "Nihil Autem Architec",
    "enrollmentStatus": "PE",
    "extName": "Roanna Spencer",
    "fatherExtName": "Erica Tanner",
    "fatherFirstName": "Anika",
    "fatherLastName": "Salinas",
    "fatherMidName": "Jakeem Wilson",
    "fatherPhone": "+1 (465) 924-7235",
    "fatherWork": "Ad Voluptatem Ea Har",
    "firstName": "Samson",
    "gender": "female",
    "gpa": 0,
    "householdIncome": "624",
    "id": "2024100154",
    "lastName": "Mayo",
    "lastSchool": "Laboriosam Ipsam Al",
    "midName": "Lara Tyson",
    "motherFirstName": "Alisa",
    "motherLastName": "Reed",
    "motherMaidenName": "August Salazar",
    "motherMidName": "Shannon Mcdowell",
    "motherPhone": "+1 (695) 354-3142",
    "motherWork": "Esse Atque Tenetur A",
    "payingStatus": "okile_scholar",
    "phone": "+1 (317) 491-1259",
    "province": "test",
    "regDate": "2024-09-28T17:54:28.155702Z",
    "religion": "In Omnis Dicta In De",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Freshman"
  },
  {
    "age": 84,
    "birthPlace": "Mollit dicta sint a",
    "city": "test",
    "civilStatus": "single",
    "country": "Philippines",
    "course": "BSCrim",
    "dob": "2017-11-04",
    "dswdHouseNo": "Nihil ipsum amet la",
    "email": "kyqe@mailinator.com",
    "emergencyContact": "+1 (517) 259-1735",
    "emergencyName": "Brynn Stephens",
    "emergencyRelationship": "Non vel consequuntur",
    "enrollmentStatus": "PE",
    "extName": "Sandra Neal",
    "fatherExtName": "Christine Anthony",
    "fatherFirstName": "Trevor",
    "fatherLastName": "Rodriguez",
    "fatherMidName": "Naida Gallegos",
    "fatherPhone": "+1 (152) 653-3099",
    "fatherWork": "Accusamus similique",
    "firstName": "Deacon",
    "gender": "male",
    "gpa": 0,
    "householdIncome": "805",
    "id": "2024100155",
    "lastName": "Zamora",
    "lastSchool": "Praesentium numquam",
    "midName": "Germaine Callahan",
    "motherFirstName": "Kiona",
    "motherLastName": "Dawson",
    "motherMaidenName": "Kirsten Garcia",
    "motherMidName": "Tarik Finley",
    "motherPhone": "+1 (853) 119-1077",
    "motherWork": "Facere in quia aliqu",
    "payingStatus": "okile_scholar",
    "phone": "+1 (464) 674-2361",
    "province": "test",
    "regDate": "2024-09-28T18:04:54.495590Z",
    "religion": "Doloribus beatae qui",
    "street": "test",
    "totalUnitsFinished": 0,
    "type": "transferee",
    "yearLevel": "Freshman"
  }
]

export const getStudents = (multiplier: number = 1): Student[] =>
  Array<Student[]>(multiplier)
    .fill(data).flat()
    .map((student, index) => ({
      ...student,
      id: multiplier > 1 ? (index + 1).toString() : student.id,
      // payingStatus: lookupPayingStatus(student.payingStatus)
    }))