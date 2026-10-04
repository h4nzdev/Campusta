PROJECT CONCEPT BRIEF
Web Systems and Technologies 2 • Project-Based Learning
 University of Southern Philippines Foundation — College of Computer Studies
Proposed Project Title
CAMPUSTA: A Smart Campus Maintenance and Service Management System for USPF

Problem Statement
At the University of Southern Philippines Foundation (USPF), students, faculty, and other campus users may encounter problems involving classrooms, laboratories, facilities, equipment, cleanliness, internet connectivity, and other campus services. These concerns may be reported through informal methods such as directly approaching personnel, sending messages, or verbally informing staff.
This informal process can make it difficult to ensure that every concern is properly recorded, assigned, prioritized, and monitored until it is resolved. Users may also have difficulty knowing the appropriate department or personnel responsible for a specific problem. At the same time, administrators and maintenance personnel may lack a centralized system for tracking pending requests, monitoring ongoing work, reviewing maintenance history, and identifying frequently occurring campus problems.
As a result, some campus concerns may experience delays in response or lack a clear record of their progress and resolution.

Target Users
Primary users: USPF students and faculty who encounter campus maintenance, facility, cleanliness, IT, or service-related concerns.
Secondary users: Maintenance and service personnel responsible for handling assigned campus concerns.
Administrators / staff: Designated USPF administrators or campus coordinators who review, prioritize, assign, and monitor service requests.
Stakeholders: USPF departments and campus administration, who can use maintenance records and reports to improve campus facilities and services.

Proposed Solution
CAMPUSTA is a web-based campus maintenance and service management system designed to provide USPF students and faculty with a centralized way to report campus concerns.
The system will use QR-based campus location identification, allowing users to scan a QR code placed in classrooms, laboratories, offices, and other facilities. After scanning, the system automatically identifies the location where the concern occurred, reducing the need for users to manually enter location information.
Users can select a concern category, provide a description, upload a photo, and submit the report. The system generates a unique ticket for each request.
Administrators can review submitted tickets, determine their priority, and assign them to the appropriate maintenance or service personnel. Assigned personnel can view their tasks, update the status, add work notes, upload completion photos, and mark requests as resolved.
Users can then track the progress of their submitted concerns through their My Reports page, while administrators can monitor overall campus concerns through a centralized dashboard containing ticket statistics, maintenance history, and basic reports.

Key Features
Role-based accounts for Student, Faculty, Maintenance/Service Personnel, and Administrator.
Campus location management for buildings, rooms, laboratories, offices, and facilities.
QR-based reporting that automatically identifies the location of a reported concern.
Campus concern reporting for facility, cleanliness, IT/equipment, safety, and other service-related problems.
Ticket generation that provides every report with a unique ticket number.
Ticket management for reviewing, prioritizing, assigning, updating, resolving, and closing requests.
Maintenance personnel dashboard where assigned personnel can view and manage their tasks.
Request status tracking allowing students and faculty to monitor their submitted reports.
Photo and file attachments for documenting reported problems and completed work.
In-system notifications for important ticket status updates.
Admin dashboard showing reports, pending requests, urgent concerns, and other maintenance statistics.
Maintenance history and reports for identifying recurring problems and frequently reported campus locations.
Digital queue management as an optional secondary feature for selected high-traffic school offices.

Expected Data to Be Managed
User accounts — name, school/employee ID, email, role, course/department, year level, contact information, and profile picture.
Campus locations — building, floor, room, facility name, location code, and QR code.
Issue categories — concern name, description, and responsible department.
Maintenance tickets — ticket number, reporter, location, category, description, priority, status, and timestamps.
Ticket assignments — assigned personnel, assigning administrator, and assignment date.
Ticket updates — status changes, work notes, resolution details, attachments, and update timestamps.
Notifications — notification title, message, recipient, read status, and timestamp.
Attachments — uploaded photos or files associated with maintenance tickets.
Queue services — participating offices and available services.
Queue tickets — queue number, requesting user, service, queue status, and timestamps.

Main System Workflow
The core CAMPUSTA process will follow:
Campus User Encounters a Problem
 ↓
 Scans QR Code
 ↓
 System Identifies Campus Location
 ↓
 Selects Concern Category
 ↓
 Adds Description and Photo
 ↓
 Submits Report
 ↓
 System Generates Ticket
 ↓
 Administrator Reviews Request
 ↓
 Administrator Sets Priority
 ↓
 Administrator Assigns Personnel
 ↓
 Personnel Receives Task
 ↓
 Personnel Starts Work
 ↓
 Status: In Progress
 ↓
 Personnel Resolves Concern
 ↓
 Adds Resolution Details / Photo
 ↓
 Administrator Verifies Resolution
 ↓
 Status: Closed
 ↓
 User Receives Update

Team Members and Roles
You can keep your actual team members here:
Team Member
Role
Hanz Magbal
Front-End Development / UI-UX Design
Raniel Pianar
Back-End Development
Davis Sentillas
Database / System Integration





Initial Technology Ideas
Front-end: React with JSX and Vite for building a responsive, component-based user interface.
Back-end: Laravel PHP Framework for the application logic, REST API, ticket management, user roles, assignments, notifications, and reporting.
Database: MySQL for persistent storage of users, campus locations, tickets, assignments, notifications, and maintenance records.
Authentication: Laravel Sanctum for secure authentication and role-based access for students, faculty, maintenance personnel, and administrators.
File Storage: Laravel Storage for uploaded problem photos, attachments, and maintenance completion images.
QR Code: QR code generation and scanning for identifying predefined campus locations such as buildings, classrooms, laboratories, and offices.
API Communication: Laravel API endpoints will connect the React frontend with the backend and database.
Deployment: React frontend and Laravel backend can be deployed using suitable cloud hosting platforms such as Vercel and a Laravel-compatible hosting service.
Development Scope: Web-based system initially focused on USPF campus maintenance and service management.
Proposed MVP Scope
For the proposal, I strongly recommend making the maintenance ticket system the main MVP.
Core MVP
User authentication
Role-based access
Student/faculty concern reporting
QR-based location identification
Campus location management
Issue categories
Ticket generation
Ticket prioritization
Ticket assignment
Maintenance personnel dashboard
Ticket status updates
Resolution details and photos
My Reports
In-system notifications
Admin dashboard
Basic maintenance reports/history
Secondary / Optional
Digital Queue Management
This can be presented as an additional service module, but it shouldn't distract from the main CAMPUSTA purpose.
Future Enhancements
AI image recognition
Predictive maintenance
IoT sensors
Mobile application
Push notifications
SMS notifications
Email notifications
Interactive campus map
Automatic personnel assignment
Equipment inventory
Smart classroom monitoring
AI chatbot

One Important Change From Your Original CAMPUSTA Concept
For the proposal, I would avoid making CAMPUSTA sound too large.
Your original concept contains a lot of possible features. That's good for the long-term system, but for a Web Systems and Technologies 2 project, the proposal should clearly communicate:
"We are primarily building a QR-based campus concern reporting and ticket management system."
Everything else supports that main workflow.
So the simplest way to explain CAMPUSTA during your proposal defense is:
CAMPUSTA is a web-based system that allows students and faculty to report campus concerns by scanning a QR code at the location of the problem. The report becomes a ticket that administrators can prioritize and assign to maintenance personnel. Personnel can update the progress and resolution, while the reporter can track the request until it is closed.
