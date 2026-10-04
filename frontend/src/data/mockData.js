export const initialUsers = [
  {
    id: "U-101",
    schoolId: "2024-00123",
    name: "Hanz Magbal",
    username: "hanz_student",
    role: "student",
    email: "hanz.student@uspf.edu.ph",
    department: "College of Computer Studies",
    course: "BS in Information Technology",
    yearLevel: "3rd Year",
    contact: "09123456789",
    profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hanz"
  },
  {
    id: "U-102",
    schoolId: "2018-00542",
    name: "Prof. Davis Sentillas",
    username: "prof_davis",
    role: "faculty",
    email: "davis.sentillas@uspf.edu.ph",
    department: "College of Computer Studies",
    contact: "09987654321",
    profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Davis"
  },
  {
    id: "U-103",
    schoolId: "EMP-9988",
    name: "Raniel Pianar",
    username: "raniel_maintenance",
    role: "maintenance",
    email: "raniel.maintenance@uspf.edu.ph",
    department: "Facilities & Maintenance Dept",
    contact: "09156789012",
    profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Raniel"
  },
  {
    id: "U-104",
    schoolId: "EMP-0001",
    name: "USPF Administrator",
    username: "admin_uspf",
    role: "admin",
    email: "admin.campusta@uspf.edu.ph",
    department: "USPF Campus Admin",
    contact: "09001112222",
    profilePic: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
  }
];

export const initialLocations = [
  { code: "USPF-MAIN-101", building: "Main Building", floor: "1st Floor", room: "Room 101", name: "Lecture Classroom 101", qrCode: "QR-MAIN-101" },
  { code: "USPF-MAIN-102", building: "Main Building", floor: "1st Floor", room: "Room 102", name: "Lecture Classroom 102", qrCode: "QR-MAIN-102" },
  { code: "USPF-MAIN-ITLAB2", building: "Main Building", floor: "2nd Floor", room: "IT Lab 2", name: "Computer Laboratory 2", qrCode: "QR-MAIN-ITLAB2" },
  { code: "USPF-IT-LAB301", building: "IT Building", floor: "3rd Floor", room: "Room 301 (Lab 1)", name: "Advanced Programming Lab", qrCode: "QR-IT-LAB301" },
  { code: "USPF-IT-LAB302", building: "IT Building", floor: "3rd Floor", room: "Room 302 (Lab 2)", name: "Network Security Lab", qrCode: "QR-IT-LAB302" },
  { code: "USPF-LIBRARY", building: "Main Building", floor: "2nd Floor", room: "Library", name: "University Main Library", qrCode: "QR-LIBRARY" },
  { code: "USPF-GYMNASIUM", building: "Gymnasium Complex", floor: "Ground Floor", room: "Gymnasium", name: "USPF Gymnasium", qrCode: "QR-GYM" },
  { code: "USPF-ADMIN-OFFICE", building: "Admin Building", floor: "1st Floor", room: "Registrar Office", name: "Registrar & Student Services", qrCode: "QR-ADMIN-OFFICE" }
];

export const initialCategories = [
  { id: "cat-it", name: "IT & Equipment", description: "Wi-Fi connectivity, computers, projectors, display screens, and laboratory hardware issues.", department: "IT Support Department" },
  { id: "cat-facility", name: "Facility & Maintenance", description: "Damaged chairs, broken tables, malfunctioning door locks, wall boards, lights, and windows.", department: "Facilities & Maintenance Dept" },
  { id: "cat-clean", name: "Cleanliness & Sanitation", description: "Spills, overflowing bins, restroom cleanliness, and sweeping/janitorial needs.", department: "Housekeeping & Janitorial Services" },
  { id: "cat-safety", name: "Safety & Hazards", description: "Exposed wiring, water leaks, slippery steps, broken steps, fire safety, and hazard signage.", department: "Security & Safety Office" },
  { id: "cat-service", name: "Other Services", description: "Requesting additional desks/chairs for an event, audio system setup, or general assistance.", department: "Event & Logistics Services" }
];

export const initialTickets = [
  {
    id: "TK-1001",
    reporterName: "Hanz Magbal",
    reporterRole: "student",
    locationCode: "USPF-MAIN-ITLAB2",
    categoryName: "IT & Equipment",
    description: "The primary ceiling projector is showing a heavy blue tint and flickers every few seconds, making it impossible to read code during class.",
    priority: "High",
    status: "Assigned",
    assignedPersonnelId: "U-103", // Raniel Pianar
    assignedPersonnelName: "Raniel Pianar",
    reporterId: "U-101",
    createdAt: "2026-08-28T09:15:00Z",
    updatedAt: "2026-08-28T10:30:00Z",
    photoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80",
    workNotes: "Assigned to electric/hardware team.",
    history: [
      { status: "Pending", note: "Ticket created by Hanz Magbal", timestamp: "2026-08-28T09:15:00Z" },
      { status: "Assigned", note: "Assigned to Raniel Pianar and priority set to High by Administrator", timestamp: "2026-08-28T10:30:00Z" }
    ]
  },
  {
    id: "TK-1002",
    reporterName: "Prof. Davis Sentillas",
    reporterRole: "faculty",
    locationCode: "USPF-GYMNASIUM",
    categoryName: "Facility & Maintenance",
    description: "Several high-bay lights on the north side of the basketball court are flickering rapidly, causing a distraction during sports training.",
    priority: "Medium",
    status: "Pending",
    assignedPersonnelId: null,
    assignedPersonnelName: null,
    reporterId: "U-102",
    createdAt: "2026-08-29T08:00:00Z",
    updatedAt: "2026-08-29T08:00:00Z",
    photoUrl: null,
    history: [
      { status: "Pending", note: "Ticket created by Prof. Davis Sentillas", timestamp: "2026-08-29T08:00:00Z" }
    ]
  },
  {
    id: "TK-1003",
    reporterName: "Hanz Magbal",
    reporterRole: "student",
    locationCode: "USPF-LIBRARY",
    categoryName: "Safety & Hazards",
    description: "A continuous water leak is dripping from the AC ventilation ducts directly onto the library entrance floor, creating a major slip hazard.",
    priority: "Urgent",
    status: "In Progress",
    assignedPersonnelId: "U-103", // Raniel Pianar
    assignedPersonnelName: "Raniel Pianar",
    reporterId: "U-101",
    createdAt: "2026-08-29T08:45:00Z",
    updatedAt: "2026-08-29T09:00:00Z",
    photoUrl: "https://images.unsplash.com/photo-1542013936693-8848e5740a7a?auto=format&fit=crop&w=400&q=80",
    workNotes: "I have placed a warning sign and am checking the main condensation drain pipeline now.",
    history: [
      { status: "Pending", note: "Ticket created by Hanz Magbal", timestamp: "2026-08-29T08:45:00Z" },
      { status: "Assigned", note: "Assigned to Raniel Pianar and priority set to Urgent by Administrator", timestamp: "2026-08-29T08:55:00Z" },
      { status: "In Progress", note: "Raniel Pianar marked task as In Progress", timestamp: "2026-08-29T09:00:00Z" }
    ]
  },
  {
    id: "TK-1004",
    reporterName: "Hanz Magbal",
    reporterRole: "student",
    locationCode: "USPF-MAIN-101",
    categoryName: "Facility & Maintenance",
    description: "One of the wooden lecture armchairs near the back window has a loose and split support bracket. It is unsafe to sit on.",
    priority: "Low",
    status: "Closed",
    assignedPersonnelId: "U-103",
    assignedPersonnelName: "Raniel Pianar",
    reporterId: "U-101",
    createdAt: "2026-08-27T10:00:00Z",
    updatedAt: "2026-08-27T16:00:00Z",
    photoUrl: null,
    workNotes: "Replaced the split bracket with a new steel hinge reinforcement. Chair is sturdy now.",
    completionPhotoUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=400&q=80",
    history: [
      { status: "Pending", note: "Ticket created by Hanz Magbal", timestamp: "2026-08-27T10:00:00Z" },
      { status: "Assigned", note: "Assigned to Raniel Pianar and priority set to Low by Administrator", timestamp: "2026-08-27T11:00:00Z" },
      { status: "In Progress", note: "Raniel Pianar marked task as In Progress", timestamp: "2026-08-27T13:30:00Z" },
      { status: "Resolved", note: "Raniel Pianar resolved the concern with notes: 'Replaced the split bracket with a new steel hinge reinforcement.'", timestamp: "2026-08-27T15:30:00Z" },
      { status: "Closed", note: "Administrator verified and closed the ticket.", timestamp: "2026-08-27T16:00:00Z" }
    ]
  }
];

export const initialNotifications = [
  { id: "nt-1", userId: "U-101", title: "Ticket Resolved", message: "Your report regarding the broken desk in Room 101 (TK-1004) has been resolved.", read: false, timestamp: "2026-08-27T15:30:00Z" },
  { id: "nt-2", userId: "U-103", title: "New Assignment", message: "You have been assigned to TK-1003: AC water leak in the Library.", read: false, timestamp: "2026-08-29T08:55:00Z" },
  { id: "nt-3", userId: "U-104", title: "New Ticket Filed", message: "A new concern regarding gymnasium lighting has been submitted by Prof. Davis Sentillas.", read: false, timestamp: "2026-08-29T08:00:00Z" }
];
