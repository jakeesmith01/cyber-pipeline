/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  var then = new Date(now)
  then.setMinutes(then.getMinutes() - 5)

  //#region ADD TESTING DATA -- FIELDS CREATION
  const useRecommended = true

  var numUsers = 5
  var numDistricts = 286      
  var numTeachers = 150      
  var numCourses = 8            
  var numCohorts = 5              
  const showPercentage = false
  const showData = false

  if (useRecommended) {
    numUsers = 5; numDistricts = 100; numTeachers = 150; numCourses = 15; numCohorts = 5;
  }

  //#region Set Maxes
  if (numCourses > 50) numCourses = 50;
  if (numCohorts > 50) numCohorts = 50;
  //#endregion
  

  console.log("Seeding... ")

  //#region Users
  const initialUsers = [
    { id: 1, eid: "test-admin", name: 'Test Administrator', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 2, eid: "russfeld", name: 'Russell Feldhausen', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 3, eid: "test-student", name: 'Test Student', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 4, eid: "weeser", name: 'Joshua Weese', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 5, eid: "nhbean", name: 'Nathan Bean', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
  ]
  const firstUsersLength = initialUsers.length+1

  const fakeFN = [
    "James", "Mary", "Michael", "Patricia", "Robert", "Jennifer", "John", "Linda", "David", "Elizabeth", "William", "Barbara", 
    "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", 
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Paul", "Ashley", "Steven", "Dorothy", "Andrew", "Kimberly", 
    "Kenneth", "Emily", "George", "Donna", "Joshua", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "Edward", "Melissa", 
    "Ronald", "Deborah", "Timothy", "Stephanie", "Jason", "Laura", "Larry", "Rebecca", "Frank", "Sharon", "Eric", "Cynthia", 
    "Raymond", "Kathleen", "Gerald", "Virginia", "Bobby", "Helen", "Walter", "Debra", "Patrick", "Marie", "Peter", "Harry", 
    "Teresa", "Douglas", "Henry", "Gloria", "Carl", "Kelly", "Arthur", "Judy", "Ryan", "Marilyn", "Roger", "Catherine", "Joe", 
    "Christine", "Albert", "Janet", "Jonathan", "Frances", "Justin", "Ann", "Terry", "Jacqueline", "Gary", "Ruth", "Brandon", 
    "Alice", "Billy", "Joan", "Bruce", "Theresa", "Willie", "Rose", "Jordan", "Aaron", "Kathryn", "Adam", "Louise", "Zachary", 
    "Sara", "Lawrence", "Anne", "Nicholas", "Roy", "Wanda", "Benjamin", "Bonnie", "Samuel", "Julia", "Ruby", "Norma", "Dennis", 
    "Paula", "Diane", "Wayne", "Heather", "Jesse", "Eva", "Alan", "Debbie", "Phillip", "April", "Leslie", "Johnny", "Lillian", 
    "Victor", "Joanne", "Martin", "Emma", "Lori", "Alexander", "Carrie", "Tina", "Martha", "Shirley", "Jerry", "Kathy", "Jeremy", 
    "Austin", "Pauline", "Chris", "Ethel", "Bryan", "Lorraine", "Lynn", "Loretta", "Marion", "Katie", "Dana", "Maureen", "Geraldine",
    "Tracy", "Peggy", "Gladys", "Holly", "Jo", "Eleanor", "Janice", "Sherry", "Doris", "Olivia", "Florence", "Jean", "Carla",
    "Vicki", "Tanya", "Regina", "Charlene", "Vivian", "Sylvia", "Marjorie", "Hilda", "Jill", "Kristin", "Veronica", "Jennie",
    "Nora", "Margie", "Nina", "Cassandra", "Leah", "Penny", "Kay", "Priscilla", "Naomi", "Carole", "Brandy", "Olga", "Billie",
  ]

  const fakeLN = [
    "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
    "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker",
    "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards",
    "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper",
    "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "Watson", "Brooks", "Kelly", "Sanders",
    "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes",
    "Flores", "Washington", "Butler", "Simmons", "Foster", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes",
    "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher",
    "Ellis", "Harrison", "Gibson", "Mcdonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson",
    "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon",
    "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols",
    "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne",
    "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart",
    "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence",
    "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr",
    "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston"
  ]

  function getName(index) {
    return [fakeFN[index], fakeLN[index]]
  }

  for (let i=0; i < Math.min(numUsers, fakeFN.length, fakeLN.length); i++) {
    const local_name = getName(i)
    const local_eid = [local_name[1], i.toString()].join('-')
    initialUsers.push({ 
      id: i+firstUsersLength, 
      eid: local_eid, 
      name: `${local_name.join(' ')}`, 
      created_at: now, updated_at: now, 
      created_by: 'test-admin', updated_by: 'test-admin' })
  }

  if (showData) console.log("Users: ", initialUsers);
  if (showPercentage) console.log("10%");
  //#endregion
  //#region Roles
  const initialRoles = [
    { id: 1, name: 'admin', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 2, name: 'student_admin', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 3, name: 'user', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { id: 4, name: 'guest', created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
  ]

  if (showData) console.log("Roles: ", initialRoles);
  if (showPercentage) console.log("20%");
  //#endregion
  //#region User Roles
  const initialUserRoles = [
    { user_id: 1, role_id: 1, created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { user_id: 2, role_id: 1, created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { user_id: 3, role_id: 2, created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { user_id: 4, role_id: 1, created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
    { user_id: 5, role_id: 1, created_at: now, updated_at: now, created_by: 'test-admin', updated_by: 'test-admin' },
  ]

  for (let i=0; i < Math.min(numUsers, fakeFN.length, fakeLN.length); i++) {
    const num = i+firstUsersLength
    const local_user_id = num;
    initialUserRoles.push(
    { 
      user_id: local_user_id, 
      role_id: 3, 
      created_at: now, updated_at: now, 
      created_by: 'test-admin', updated_by: 'test-admin' 
    })
  }

  if (showData) console.log("User Roles: ", initialUserRoles);
  if (showPercentage) console.log("30%");
  //#endregion
  //#region Districts
  
  // All Districts
  const allDistricts = [
    { usd: '101', name: 'Erie-Galesburg', locale: '33' }, 
    { usd: '102', name: 'Cimarron-Ensign', locale: '21' },
    { usd: '103', name: 'Cheylin', locale: '31' },
    { usd: '105', name: 'Rawlins County', locale: '11' },
    { usd: '106', name: 'Western Plains', locale: '13' },
    { usd: '107', name: 'Rock Hills', locale: '32' },
    { usd: '108', name: 'Washington County Schools', locale: '43' },
    { usd: '109', name: 'Republic County', locale: '31' },
    { usd: '110', name: 'Thunder Ridge Schools', locale: '12' },
    { usd: '111', name: 'Doniphan West Schools', locale: '22' },
    { usd: '112', name: 'Central Plains', locale: '23' },
    { usd: '113', name: 'Prairie Hills', locale: '13' },
    { usd: '114', name: 'Riverside', locale: '23' },
    { usd: '115', name: 'Nemaha Central', locale: '42' },
    { usd: '200', name: 'Greeley County Schools', locale: '23' },
    { usd: '202', name: 'Turner-Kansas City', locale: '22' },
    { usd: '203', name: 'Piper-Kansas City', locale: '32' },
    { usd: '204', name: 'Bonner Springs', locale: '21' },
    { usd: '205', name: 'Bluestem', locale: '32' },
    { usd: '206', name: 'Remington-Whitewater', locale: '42' },
    { usd: '207', name: 'Fort Leavenworth', locale: '33' },
    { usd: '208', name: 'Trego', locale: '13' },
    { usd: '209', name: 'Moscow Public Schools', locale: '23' },
    { usd: '210', name: 'Hugoton Public Schools', locale: '22' },
    { usd: '211', name: 'Norton Community Schools', locale: '42' },
    { usd: '212', name: 'Northern Valley', locale: '41' },
    { usd: '214', name: 'Ulysses', locale: '41' },
    { usd: '215', name: 'Lakin', locale: '13' },
    { usd: '216', name: 'Deerfield', locale: '32' },
    { usd: '217', name: 'Rolla', locale: '43' },
    { usd: '218', name: 'Elkhart', locale: '13' },
    { usd: '219', name: 'Minneola', locale: '23' },
    { usd: '220', name: 'Ashland', locale: '31' },
    { usd: '223', name: 'Barnes', locale: '33' },
    { usd: '224', name: 'Clifton-Clyde', locale: '22' },
    { usd: '225', name: 'Fowler', locale: '42' },
    { usd: '226', name: 'Meade', locale: '11' },
    { usd: '227', name: 'Unified School District 227', locale: '32' },
    { usd: '229', name: 'Blue Valley USD 229', locale: '21' },
    { usd: '230', name: 'Spring Hill', locale: '32' },
    { usd: '231', name: 'Gardner Edgerton', locale: '32' },
    { usd: '232', name: 'De Soto', locale: '32' },
    { usd: '233', name: 'Olathe', locale: '32' },
    { usd: '234', name: 'Fort Scott', locale: '33' },
    { usd: '235', name: 'Uniontown', locale: '41' },
    { usd: '237', name: 'Smith Center', locale: '21' },
    { usd: '239', name: 'North Ottawa County', locale: '32' },
    { usd: '240', name: 'Twin Valley', locale: '43' },
    { usd: '241', name: 'Wallace County Schools', locale: '42' },
    { usd: '242', name: 'Weskan', locale: '13' },
    { usd: '243', name: 'Lebo-Waverly', locale: '31' },
    { usd: '244', name: 'Burlington', locale: '22' },
    { usd: '245', name: 'LeRoy-Gridley', locale: '33' },
    { usd: '246', name: 'Northeast', locale: '31' },
    { usd: '247', name: 'Cherokee', locale: '23' },
    { usd: '248', name: 'Girard', locale: '31' },
    { usd: '249', name: 'Frontenac Public Schools', locale: '33' },
    { usd: '250', name: 'Pittsburg', locale: '12' },
    { usd: '251', name: 'North Lyon County', locale: '11' },
    { usd: '252', name: 'Southern Lyon County', locale: '21' },
    { usd: '253', name: 'Emporia', locale: '31' },
    { usd: '254', name: 'Barber County North', locale: '11' },
    { usd: '255', name: 'South Barber', locale: '12' },
    { usd: '256', name: 'Marmaton Valley USD 256', locale: '43' },
    { usd: '257', name: 'Iola', locale: '43' },
    { usd: '258', name: 'Humboldt', locale: '42' },
    { usd: '259', name: 'Wichita', locale: '22' },
    { usd: '260', name: 'Derby', locale: '32' },
    { usd: '261', name: 'Haysville', locale: '32' },
    { usd: '262', name: 'Valley Center Public Schools', locale: '13' },
    { usd: '263', name: 'Mulvane', locale: '33' },
    { usd: '264', name: 'Clearwater', locale: '41' },
    { usd: '265', name: 'Goddard', locale: '23' },
    { usd: '266', name: 'Maize', locale: '21' },
    { usd: '267', name: 'Renwick', locale: '22' },
    { usd: '268', name: 'Cheney', locale: '23' },
    { usd: '269', name: 'Palco', locale: '22' },
    { usd: '270', name: 'Plainville', locale: '11' },
    { usd: '271', name: 'Stockton', locale: '11' },
    { usd: '272', name: 'Waconda', locale: '12' },
    { usd: '273', name: 'Beloit', locale: '21' },
    { usd: '274', name: 'Oakley', locale: '31' },
    { usd: '275', name: 'Triplains', locale: '11' },
    { usd: '281', name: 'Graham County', locale: '33' },
    { usd: '282', name: 'West Elk', locale: '31' },
    { usd: '283', name: 'Elk Valley', locale: '33' },
    { usd: '284', name: 'Chase County', locale: '43' },
    { usd: '285', name: 'Cedar Vale', locale: '22' },
    { usd: '286', name: 'Chautauqua County Community', locale: '13' },
    { usd: '287', name: 'West Franklin', locale: '31' },
    { usd: '288', name: 'Central Heights', locale: '11' },
    { usd: '289', name: 'Wellsville', locale: '31' },
    { usd: '290', name: 'Ottawa', locale: '13' },
    { usd: '291', name: 'Grinnell Public Schools', locale: '31' },
    { usd: '292', name: 'Wheatland', locale: '13' },
    { usd: '293', name: 'Quinter Public Schools', locale: '12' },
    { usd: '294', name: 'Oberlin', locale: '41' },
    { usd: '297', name: 'St. Francis Community Schools', locale: '22' },
    { usd: '298', name: 'Lincoln', locale: '43' },
    { usd: '299', name: 'Sylvan Grove', locale: '11' },
    { usd: '300', name: 'Comanche County', locale: '41' },
    { usd: '303', name: 'Ness City', locale: '13' },
    { usd: '305', name: 'Salina', locale: '41' },
    { usd: '306', name: 'Southeast of Saline', locale: '42' },
    { usd: '307', name: 'Ell-Saline', locale: '32' },
    { usd: '308', name: 'Hutchinson Public Schools', locale: '23' },
    { usd: '309', name: 'Nickerson', locale: '43' },
    { usd: '310', name: 'Fairfield', locale: '32' },
    { usd: '311', name: 'Pretty Prairie', locale: '32' },
    { usd: '312', name: 'Haven Public Schools', locale: '23' },
    { usd: '313', name: 'Buhler', locale: '13' },
    { usd: '314', name: 'Brewster', locale: '43' },
    { usd: '315', name: 'Colby Public Schools', locale: '22' },
    { usd: '316', name: 'Golden Plains', locale: '22' },
    { usd: '320', name: 'Wamego', locale: '33' },
    { usd: '321', name: 'Kaw Valley', locale: '43' },
    { usd: '322', name: 'Onaga-Havensville-Wheaton', locale: '12' },
    { usd: '323', name: 'Rock Creek', locale: '42' },
    { usd: '325', name: 'Phillipsburg', locale: '11' },
    { usd: '326', name: 'Logan', locale: '33' },
    { usd: '327', name: 'Ellsworth', locale: '32' },
    { usd: '329', name: 'Wabaunsee', locale: '23' },
    { usd: '330', name: 'Mission Valley', locale: '42' },
    { usd: '331', name: 'Kingman-Norwich', locale: '42' },
    { usd: '332', name: 'Cunningham', locale: '32' },
    { usd: '333', name: 'Concordia', locale: '42' },
    { usd: '334', name: 'Southern Cloud', locale: '31' },
    { usd: '335', name: 'North Jackson', locale: '31' },
    { usd: '336', name: 'Holton', locale: '41' },
    { usd: '337', name: 'Royal Valley', locale: '22' },
    { usd: '338', name: 'Valley Falls', locale: '13' },
    { usd: '339', name: 'Jefferson County North', locale: '23' },
    { usd: '340', name: 'Jefferson West', locale: '33' },
    { usd: '341', name: 'Oskaloosa Public Schools', locale: '42' },
    { usd: '342', name: 'McLouth', locale: '23' },
    { usd: '343', name: 'Perry Public Schools', locale: '23' },
    { usd: '344', name: 'Pleasanton', locale: '21' },
    { usd: '345', name: 'Seaman', locale: '13' },
    { usd: '346', name: 'Jayhawk', locale: '13' },
    { usd: '347', name: 'Kinsley-Offerle', locale: '23' },
    { usd: '348', name: 'Baldwin City', locale: '32' },
    { usd: '349', name: 'Stafford', locale: '12' },
    { usd: '350', name: 'St John-Hudson', locale: '42' },
    { usd: '351', name: 'Macksville', locale: '33' },
    { usd: '352', name: 'Goodland', locale: '33' },
    { usd: '353', name: 'Wellington', locale: '33' },
    { usd: '355', name: 'Ellinwood Public Schools', locale: '12' },
    { usd: '356', name: 'Conway Springs', locale: '11' },
    { usd: '357', name: 'Belle Plaine', locale: '11' },
    { usd: '358', name: 'Oxford', locale: '42' },
    { usd: '359', name: 'Argonia Public Schools', locale: '32' },
    { usd: '360', name: 'Caldwell', locale: '32' },
    { usd: '361', name: 'Chaparral Schools', locale: '22' },
    { usd: '362', name: 'Prairie View', locale: '41' },
    { usd: '363', name: 'Holcomb', locale: '42' },
    { usd: '364', name: 'Marysville', locale: '22' },
    { usd: '365', name: 'Garnett', locale: '12' },
    { usd: '366', name: 'Woodson', locale: '21' },
    { usd: '367', name: 'Osawatomie', locale: '43' },
    { usd: '368', name: 'Unified School District 368', locale: '33' },
    { usd: '369', name: 'Burrton', locale: '21' },
    { usd: '371', name: 'Montezuma', locale: '23' },
    { usd: '372', name: 'Silver Lake', locale: '43' },
    { usd: '373', name: 'Newton', locale: '21' },
    { usd: '374', name: 'Sublette', locale: '42' },
    { usd: '375', name: 'Circle', locale: '33' },
    { usd: '376', name: 'Sterling', locale: '32' },
    { usd: '377', name: 'Atchison County', locale: '22' },
    { usd: '378', name: 'Riley County', locale: '22' },
    { usd: '379', name: 'Clay County', locale: '23' },
    { usd: '380', name: 'Vermillion', locale: '23' },
    { usd: '381', name: 'Spearville', locale: '13' },
    { usd: '382', name: 'Pratt', locale: '23' },
    { usd: '383', name: 'Manhattan-Ogden', locale: '42' },
    { usd: '384', name: 'Blue Valley USD 384', locale: '32' },
    { usd: '385', name: 'Andover', locale: '32' },
    { usd: '386', name: 'Madison-Virgil', locale: '11' },
    { usd: '387', name: 'Altoona-Midway', locale: '33' },
    { usd: '388', name: 'Ellis', locale: '31' },
    { usd: '389', name: 'Eureka', locale: '12' },
    { usd: '390', name: 'Hamilton', locale: '13' },
    { usd: '392', name: 'Osborne County', locale: '42' },
    { usd: '393', name: 'Solomon', locale: '12' },
    { usd: '394', name: 'Rose Hill Public Schools', locale: '13' },
    { usd: '395', name: 'LaCrosse', locale: '42' },
    { usd: '396', name: 'Douglass Public Schools', locale: '23' },
    { usd: '397', name: 'Centre', locale: '31' },
    { usd: '398', name: 'Peabody-Burns', locale: '41' },
    { usd: '399', name: 'Paradise', locale: '12' },
    { usd: '400', name: 'Smoky Valley', locale: '42' },
    { usd: '401', name: 'Chase-Raymond', locale: '43' },
    { usd: '402', name: 'Augusta', locale: '41' },
    { usd: '403', name: 'Otis-Bison', locale: '33' },
    { usd: '404', name: 'Riverton', locale: '12' },
    { usd: '405', name: 'Lyons', locale: '43' },
    { usd: '407', name: 'Russell County', locale: '13' },
    { usd: '408', name: 'Marion-Florence', locale: '43' },
    { usd: '409', name: 'Atchison Public Schools', locale: '12' },
    { usd: '410', name: 'Durham-Hillsboro-Lehigh', locale: '11' },
    { usd: '411', name: 'Goessel', locale: '32' },
    { usd: '412', name: 'Hoxie Community Schools', locale: '21' },
    { usd: '413', name: 'Chanute Public Schools', locale: '43' },
    { usd: '415', name: 'Hiawatha', locale: '42' },
    { usd: '416', name: 'Louisburg', locale: '21' },
    { usd: '417', name: 'Morris County', locale: '12' },
    { usd: '418', name: 'McPherson', locale: '12' },
    { usd: '419', name: 'Canton-Galva', locale: '42' },
    { usd: '420', name: 'Osage City', locale: '31' },
    { usd: '421', name: 'Lyndon', locale: '32' },
    { usd: '422', name: 'Kiowa County', locale: '33' },
    { usd: '423', name: 'Moundridge', locale: '13' },
    { usd: '426', name: 'Pike Valley', locale: '21' },
    { usd: '428', name: 'Great Bend', locale: '22' },
    { usd: '429', name: 'Troy Public Schools', locale: '33' },
    { usd: '430', name: 'South Brown County', locale: '32' },
    { usd: '431', name: 'Hoisington', locale: '41' },
    { usd: '432', name: 'Victoria', locale: '23' },
    { usd: '434', name: 'Santa Fe Trail', locale: '33' },
    { usd: '435', name: 'Abilene', locale: '22' },
    { usd: '436', name: 'Caney Valley', locale: '31' },
    { usd: '437', name: 'Auburn-Washburn', locale: '41' },
    { usd: '438', name: 'Skyline Schools', locale: '11' },
    { usd: '439', name: 'Sedgwick Public Schools', locale: '22' },
    { usd: '440', name: 'Halstead', locale: '43' },
    { usd: '443', name: 'Dodge City', locale: '31' },
    { usd: '444', name: 'Little River', locale: '21' },
    { usd: '445', name: 'Coffeyville', locale: '33' },
    { usd: '446', name: 'Independence', locale: '41' },
    { usd: '447', name: 'Cherryvale', locale: '23' },
    { usd: '448', name: 'Inman', locale: '22' },
    { usd: '449', name: 'Easton', locale: '21' },
    { usd: '450', name: 'Shawnee Heights', locale: '43' },
    { usd: '452', name: 'Stanton County', locale: '33' },
    { usd: '453', name: 'Leavenworth', locale: '21' },
    { usd: '454', name: 'Burlingame Public School', locale: '33' },
    { usd: '456', name: 'Marais Des Cygnes Valley', locale: '22' },
    { usd: '457', name: 'Garden City', locale: '43' },
    { usd: '458', name: 'Basehor-Linwood', locale: '23' },
    { usd: '459', name: 'Bucklin', locale: '31' },
    { usd: '460', name: 'Hesston', locale: '41' },
    { usd: '461', name: 'Neodesha', locale: '11' },
    { usd: '462', name: 'Central', locale: '13' },
    { usd: '463', name: 'Udall', locale: '11' },
    { usd: '464', name: 'Tonganoxie', locale: '41' },
    { usd: '465', name: 'Winfield', locale: '13' },
    { usd: '466', name: 'Scott County', locale: '23' },
    { usd: '467', name: 'Leoti', locale: '43' },
    { usd: '468', name: 'Healy Public Schools', locale: '31' },
    { usd: '469', name: 'Lansing', locale: '23' },
    { usd: '470', name: 'Arkansas City', locale: '43' },
    { usd: '471', name: 'Dexter', locale: '13' },
    { usd: '473', name: 'Chapman', locale: '13' },
    { usd: '474', name: 'Haviland', locale: '12' },
    { usd: '475', name: 'Geary County Schools', locale: '33' },
    { usd: '476', name: 'Copeland', locale: '41' },
    { usd: '477', name: 'Ingalls', locale: '41' },
    { usd: '479', name: 'Crest', locale: '21' },
    { usd: '480', name: 'Liberal', locale: '23' },
    { usd: '481', name: 'Rural Vista', locale: '12' },
    { usd: '482', name: 'Dighton', locale: '21' },
    { usd: '483', name: 'Kismet-Plains', locale: '13' },
    { usd: '484', name: 'Fredonia', locale: '21' },
    { usd: '487', name: 'Herington', locale: '11' },
    { usd: '489', name: 'Hays', locale: '42' },
    { usd: '490', name: 'El Dorado', locale: '31' },
    { usd: '491', name: 'Eudora', locale: '41' },
    { usd: '492', name: 'Flinthills', locale: '12' },
    { usd: '493', name: 'Columbus', locale: '31' },
    { usd: '494', name: 'Syracuse', locale: '32' },
    { usd: '495', name: 'Fort Larned', locale: '23' },
    { usd: '496', name: 'Pawnee Heights', locale: '12' },
    { usd: '497', name: 'Lawrence', locale: '42' },
    { usd: '498', name: 'Valley Heights', locale: '32' },
    { usd: '499', name: 'Galena', locale: '13' },
    { usd: '500', name: 'Kansas City', locale: '11' },
    { usd: '501', name: 'Topeka Public Schools', locale: '43' },
    { usd: '502', name: 'Lewis', locale: '32' },
    { usd: '503', name: 'Parsons', locale: '21' },
    { usd: '504', name: 'Oswego', locale: '32' },
    { usd: '505', name: 'Chetopa-St. Paul', locale: '41' },
    { usd: '506', name: 'Labette County', locale: '23' },
    { usd: '507', name: 'Satanta', locale: '33' },
    { usd: '508', name: 'Baxter Springs', locale: '11' },
    { usd: '509', name: 'South Haven', locale: '32' },
    { usd: '511', name: 'Attica', locale: '21' },
    { usd: '512', name: 'Shawnee Mission', locale: '31' },
  ];
    
  const initialDistricts = []

  for (let i = 0; i < Math.min(numDistricts, allDistricts.length); i++) {
    const local_usd = allDistricts[i].usd;
    const local_name = allDistricts[i].name;
    const local_locale = allDistricts[i].locale;
    const local_url = "";

    if (initialDistricts.find((d => d.usd.toString() === local_usd))>0) {
      console.log(`Districts: ${d.usd.toString(), local_usd2}`)
      continue;
    }
    else {
      initialDistricts.push({
        id: i+1,
        usd: local_usd,
        name: local_name,
        url: local_url,
        locale: local_locale,
        notes: `${local_name} notes`,
        created_at: now,
        updated_at: now,
        created_by: 'test-admin',
        updated_by: 'test-admin',
      })
    }
  }

  if (showData) console.log("Districts: ", initialDistricts);
  if (showPercentage) console.log("40%");
  //#endregion
  //#region Teachers
  const initialTeachers = [];
  initialTeachers.push({id: 1000, name: 'Patrick', email: 'patrick@ksu.edu', eid: '159643', wid: '1000', status: 0, pd_status: 0, cert_status: 0, ms_status: 0, grade_level: 'Freshman', num_students: 5});
  const maxTeachers = Math.min(numTeachers, fakeFN.length, fakeLN.length);

  for (let i = 0; i < maxTeachers; i++) {
    const local_name = getName(i);
    const local_email = `${local_name[0].toLowerCase()}${local_name[1].toLowerCase()}${i}@ksu.edu`; 
    const local_eid = `${local_name[1]}-${i}`;
    const local_status = 0;
    const local_pd_status = 0;
    const local_cert_status = 0;
    const local_ms_status = 0;
    const local_grade_level = "Freshman";
    const local_num_students = 5;
    
    initialTeachers.push({
      id: i+1,
      name: `${local_name[0]} ${local_name[1]}`,
      email: local_email,
      eid: local_eid,
      wid: i.toString(),
      status: local_status,
      pd_status: local_pd_status,
      cert_status: local_cert_status,
      ms_status: local_ms_status,
      grade_level: local_grade_level,
      num_students: local_num_students,
    });
  
  }

  if (showData) console.log("Teachers: ", initialTeachers);
  if (showPercentage) console.log("50%");
  //#endregion
  //#region Teacher Districts
  const initialTeacherDistricts = [];

  for (let i=0; i < numTeachers; i++) { 
    const local_teacher_id = i+1;
    const local_district_id = (i % Math.min(numDistricts, allDistricts.length)) + 1;
    const local_notes = `Teacher ${i} in District ${i}`;
    initialTeacherDistricts.push({
      teacher_id: local_teacher_id,
      district_id: local_district_id,
      notes: local_notes,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    });
  }

  if (showData) console.log("Teacher Districts: ", initialTeacherDistricts);
  if (showPercentage) console.log("60%");
  //#endregion
  //#region Cohorts
  const initialCohorts = [];
  let j = 0;
  for (let i = 0; i < numCohorts; i++) {
    const local_name = `Cohort ${i}`;
    const local_notes = `Cohort ${i} notes`;
    initialCohorts.push({
      id: i+1,
      name: local_name,
      notes: local_notes,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    });
    j++
  }

  if (showData) console.log("Cohorts: ", initialCohorts);
  if (showPercentage) console.log("70%");
  //#endregion
  //#region Courses
  const allCourses = [
    { name: 'CC 710', notes: 'Introduction to Computing for Educators' },
    { name: 'CC 711', notes: 'Computer Education Programming Fundamentals' },
    { name: 'CC 730', notes: 'Computer Programming Fundamentals' },
    { name: 'CC 750', notes: 'Data Structures and Algorithms for Educators I' },
    { name: 'CC 755', notes: 'Data Structures and Algorithms for Educators II' },
    { name: 'CC 760', notes: 'Advanced Computing for Educators' },
    { name: 'CC 798', notes: 'Topics in Computing for Educators' },
    { name: 'EDCI 765', notes: 'Placeholder'}
  ]

  const initialCourses = [];

  for (let i = 0; i < numCourses; i++) {
    var local_name
    var local_notes = ''

    if(i < allCourses.length){
      local_name = allCourses[i].name;
      local_notes = allCourses[i].notes;
    }
    else{
      local_name = `Course ${i}`;
      local_notes = `Course ${i} notes`;
    }

    if(local_name === 'CC 710'){
      initialCourses.push({
        id: i+1,
        name: local_name,
        notes: local_notes,
        created_at: now,
        updated_at: now,
        created_by: 'test-admin',
        updated_by: 'test-admin',
        academic_year: 2018+(i%7) + "-" + (2018+(i%7)+1),  
        course_id: 175999
      });
    }
    else{
      initialCourses.push({
        id: i+1,
        name: local_name,
        notes: local_notes,
        created_at: now,
        updated_at: now,
        created_by: 'test-admin',
        updated_by: 'test-admin',
        academic_year: 2018+(i%7) + "-" + (2018+(i%7)+1),  
      });
    }

    
  }

  if (showData) console.log("Courses: ", initialCourses);
  if (showPercentage) console.log("80%");
  //#endregion
  //#region Teacher Cohorts
  const initialTeacherCohorts = [];

  for (let i=0; i < numTeachers; i++) {
    const local_cohort_id = (i % numCohorts) + 1;
    const local_notes = `Teacher ${i} in Cohort ${i}`;
    initialTeacherCohorts.push({
      teacher_id: i+1,
      cohort_id: local_cohort_id,
      notes: local_notes,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    });
  }

  if (showData) console.log("Teacher Cohorts: ", initialTeacherCohorts);
  if (showPercentage) console.log("90%");
  //#endregion 
  //#region Teacher Courses
  const initialTeacherCourses = [];

  for (let i=0; i < numTeachers; i++) {
    const local_course_id = (i % numCourses) + 1;
    const local_notes = `Teacher ${i} in Course ${i}`;
    initialTeacherCourses.push({
      teacher_id: i+1,
      course_id: local_course_id,
      notes: local_notes,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    });
  }

  if (showData) console.log("Teacher Courses: ", initialTeacherCourses);
  if (showPercentage) console.log("100%");
  //#endregion
  //#endregion

  // Delete existing data
  await knex('users').del()
  await knex('roles').del()
  await knex('user_roles').del()
  await knex('districts').del()
  await knex('teachers').del()
  await knex('teacher_districts').del()
  await knex('cohorts').del()
  await knex('teacher_cohorts').del()
  await knex('courses').del()
  await knex('teacher_courses').del()

  // Insert initial data
  await knex('users').insert(initialUsers)
  await knex('roles').insert(initialRoles)
  await knex('user_roles').insert(initialUserRoles)
  await knex('districts').insert(initialDistricts)
  await knex('teachers').insert(initialTeachers)
  await knex('teacher_districts').insert(initialTeacherDistricts)
  await knex('cohorts').insert(initialCohorts)
  await knex('teacher_cohorts').insert(initialTeacherCohorts)
  await knex('courses').insert(initialCourses)
  await knex('teacher_courses').insert(initialTeacherCourses)
}