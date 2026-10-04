<?php

namespace Database\Seeders;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $student = User::updateOrCreate(
            ['username' => 'hanz_student'],
            [
                'school_id' => '2024-00123',
                'name' => 'Hanz Magbal',
                'email' => 'hanz.student@uspf.edu.ph',
                'password' => Hash::make('password'),
                'role' => UserRole::STUDENT,
                'department' => 'College of Computer Studies',
                'course' => 'BS in Information Technology',
                'year_level' => '3rd Year',
                'contact' => '09123456789',
                'profile_pic' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hanz',
            ]
        );

        $faculty = User::updateOrCreate(
            ['username' => 'prof_davis'],
            [
                'school_id' => '2018-00542',
                'name' => 'Prof. Davis Sentillas',
                'email' => 'davis.sentillas@uspf.edu.ph',
                'password' => Hash::make('password'),
                'role' => UserRole::FACULTY,
                'department' => 'College of Computer Studies',
                'contact' => '09987654321',
                'profile_pic' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Davis',
            ]
        );

        $maintenance = User::updateOrCreate(
            ['username' => 'raniel_maintenance'],
            [
                'school_id' => 'EMP-9988',
                'name' => 'Raniel Pianar',
                'email' => 'raniel.maintenance@uspf.edu.ph',
                'password' => Hash::make('password'),
                'role' => UserRole::MAINTENANCE,
                'department' => 'Facilities & Maintenance Dept',
                'contact' => '09156789012',
                'profile_pic' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Raniel',
            ]
        );

        $admin = User::updateOrCreate(
            ['username' => 'admin_uspf'],
            [
                'school_id' => 'EMP-0001',
                'name' => 'USPF Administrator',
                'email' => 'admin.campusta@uspf.edu.ph',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
                'department' => 'USPF Campus Admin',
                'contact' => '09001112222',
                'profile_pic' => 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
            ]
        );

        // 2. Seed Locations
        $locations = [
            ['code' => 'USPF-MAIN-101', 'building' => 'Main Building', 'floor' => '1st Floor', 'room' => 'Room 101', 'name' => 'Lecture Classroom 101', 'qr_code' => 'QR-MAIN-101'],
            ['code' => 'USPF-MAIN-102', 'building' => 'Main Building', 'floor' => '1st Floor', 'room' => 'Room 102', 'name' => 'Lecture Classroom 102', 'qr_code' => 'QR-MAIN-102'],
            ['code' => 'USPF-MAIN-ITLAB2', 'building' => 'Main Building', 'floor' => '2nd Floor', 'room' => 'IT Lab 2', 'name' => 'Computer Laboratory 2', 'qr_code' => 'QR-MAIN-ITLAB2'],
            ['code' => 'USPF-IT-LAB301', 'building' => 'IT Building', 'floor' => '3rd Floor', 'room' => 'Room 301 (Lab 1)', 'name' => 'Advanced Programming Lab', 'qr_code' => 'QR-IT-LAB301'],
            ['code' => 'USPF-IT-LAB302', 'building' => 'IT Building', 'floor' => '3rd Floor', 'room' => 'Room 302 (Lab 2)', 'name' => 'Network Security Lab', 'qr_code' => 'QR-IT-LAB302'],
            ['code' => 'USPF-LIBRARY', 'building' => 'Main Building', 'floor' => '2nd Floor', 'room' => 'Library', 'name' => 'University Main Library', 'qr_code' => 'QR-LIBRARY'],
            ['code' => 'USPF-GYMNASIUM', 'building' => 'Gymnasium Complex', 'floor' => 'Ground Floor', 'room' => 'Gymnasium', 'name' => 'USPF Gymnasium', 'qr_code' => 'QR-GYM'],
            ['code' => 'USPF-ADMIN-OFFICE', 'building' => 'Admin Building', 'floor' => '1st Floor', 'room' => 'Registrar Office', 'name' => 'Registrar & Student Services', 'qr_code' => 'QR-ADMIN-OFFICE'],
        ];

        $locationMap = [];
        foreach ($locations as $loc) {
            $createdLoc = Location::updateOrCreate(['code' => $loc['code']], $loc);
            $locationMap[$loc['code']] = $createdLoc->id;
        }

        // 3. Seed Categories
        $categories = [
            ['name' => 'IT & Equipment', 'description' => 'Wi-Fi connectivity, computers, projectors, display screens, and laboratory hardware issues.', 'department' => 'IT Support Department'],
            ['name' => 'Facility & Maintenance', 'description' => 'Damaged chairs, broken tables, malfunctioning door locks, wall boards, lights, and windows.', 'department' => 'Facilities & Maintenance Dept'],
            ['name' => 'Cleanliness & Sanitation', 'description' => 'Spills, overflowing bins, restroom cleanliness, and sweeping/janitorial needs.', 'department' => 'Housekeeping & Janitorial Services'],
            ['name' => 'Safety & Hazards', 'description' => 'Exposed wiring, water leaks, slippery steps, broken steps, fire safety, and hazard signage.', 'department' => 'Security & Safety Office'],
            ['name' => 'Other Services', 'description' => 'Requesting additional desks/chairs for an event, audio system setup, or general assistance.', 'department' => 'Event & Logistics Services'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }

        // 4. Seed Initial Tickets (only if tickets table is empty)
        if (Ticket::count() === 0) {
            // Ticket 1: AC Projector in IT Lab 2 (Assigned)
            $t1 = Ticket::create([
                'reporter_id' => $student->id,
                'location_id' => $locationMap['USPF-MAIN-ITLAB2'],
                'category_name' => 'IT & Equipment',
                'description' => 'The primary ceiling projector is showing a heavy blue tint and flickers every few seconds, making it impossible to read code during class.',
                'priority' => TicketPriority::HIGH,
                'status' => TicketStatus::ASSIGNED,
                'assigned_personnel_id' => $maintenance->id,
                'photo_url' => 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80',
                'work_notes' => 'Assigned to electric/hardware team.',
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1)->addHours(1),
            ]);

            TicketHistory::create([
                'ticket_id' => $t1->id,
                'status' => TicketStatus::PENDING->value,
                'note' => 'Ticket created by Hanz Magbal',
                'timestamp' => Carbon::now()->subDays(1),
            ]);

            TicketHistory::create([
                'ticket_id' => $t1->id,
                'status' => TicketStatus::ASSIGNED->value,
                'note' => 'Assigned to Raniel Pianar and priority set to High by Administrator',
                'timestamp' => Carbon::now()->subDays(1)->addHours(1),
            ]);

            // Ticket 2: Gymnasium lights (Pending)
            $t2 = Ticket::create([
                'reporter_id' => $faculty->id,
                'location_id' => $locationMap['USPF-GYMNASIUM'],
                'category_name' => 'Facility & Maintenance',
                'description' => 'Several high-bay lights on the north side of the basketball court are flickering rapidly, causing a distraction during sports training.',
                'priority' => TicketPriority::MEDIUM,
                'status' => TicketStatus::PENDING,
                'assigned_personnel_id' => null,
                'created_at' => Carbon::now()->subHours(5),
                'updated_at' => Carbon::now()->subHours(5),
            ]);

            TicketHistory::create([
                'ticket_id' => $t2->id,
                'status' => TicketStatus::PENDING->value,
                'note' => 'Ticket created by Prof. Davis Sentillas',
                'timestamp' => Carbon::now()->subHours(5),
            ]);

            // Ticket 3: Library water leak (In Progress)
            $t3 = Ticket::create([
                'reporter_id' => $student->id,
                'location_id' => $locationMap['USPF-LIBRARY'],
                'category_name' => 'Safety & Hazards',
                'description' => 'A continuous water leak is dripping from the AC ventilation ducts directly onto the library entrance floor, creating a major slip hazard.',
                'priority' => TicketPriority::URGENT,
                'status' => TicketStatus::IN_PROGRESS,
                'assigned_personnel_id' => $maintenance->id,
                'photo_url' => 'https://images.unsplash.com/photo-1542013936693-8848e5740a7a?auto=format&fit=crop&w=400&q=80',
                'work_notes' => 'I have placed a warning sign and am checking the main condensation drain pipeline now.',
                'created_at' => Carbon::now()->subHours(3),
                'updated_at' => Carbon::now()->subHours(2),
            ]);

            TicketHistory::create([
                'ticket_id' => $t3->id,
                'status' => TicketStatus::PENDING->value,
                'note' => 'Ticket created by Hanz Magbal',
                'timestamp' => Carbon::now()->subHours(3),
            ]);

            TicketHistory::create([
                'ticket_id' => $t3->id,
                'status' => TicketStatus::ASSIGNED->value,
                'note' => 'Assigned to Raniel Pianar and priority set to Urgent by Administrator',
                'timestamp' => Carbon::now()->subHours(2)->subMinutes(50),
            ]);

            TicketHistory::create([
                'ticket_id' => $t3->id,
                'status' => TicketStatus::IN_PROGRESS->value,
                'note' => 'Raniel Pianar marked task as In Progress',
                'timestamp' => Carbon::now()->subHours(2),
            ]);

            // Ticket 4: Room 101 armchair (Closed)
            $t4 = Ticket::create([
                'reporter_id' => $student->id,
                'location_id' => $locationMap['USPF-MAIN-101'],
                'category_name' => 'Facility & Maintenance',
                'description' => 'One of the wooden lecture armchairs near the back window has a loose and split support bracket. It is unsafe to sit on.',
                'priority' => TicketPriority::LOW,
                'status' => TicketStatus::CLOSED,
                'assigned_personnel_id' => $maintenance->id,
                'work_notes' => 'Replaced the split bracket with a new steel hinge reinforcement. Chair is sturdy now.',
                'completion_photo_url' => 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=400&q=80',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(2)->addHours(4),
            ]);

            TicketHistory::create([
                'ticket_id' => $t4->id,
                'status' => TicketStatus::PENDING->value,
                'note' => 'Ticket created by Hanz Magbal',
                'timestamp' => Carbon::now()->subDays(2),
            ]);

            TicketHistory::create([
                'ticket_id' => $t4->id,
                'status' => TicketStatus::ASSIGNED->value,
                'note' => 'Assigned to Raniel Pianar and priority set to Low by Administrator',
                'timestamp' => Carbon::now()->subDays(2)->addHours(1),
            ]);

            TicketHistory::create([
                'ticket_id' => $t4->id,
                'status' => TicketStatus::IN_PROGRESS->value,
                'note' => 'Raniel Pianar marked task as In Progress',
                'timestamp' => Carbon::now()->subDays(2)->addHours(2),
            ]);

            TicketHistory::create([
                'ticket_id' => $t4->id,
                'status' => TicketStatus::RESOLVED->value,
                'note' => 'Raniel Pianar resolved the concern with notes: \'Replaced the split bracket with a new steel hinge reinforcement.\'',
                'timestamp' => Carbon::now()->subDays(2)->addHours(3),
            ]);

            TicketHistory::create([
                'ticket_id' => $t4->id,
                'status' => TicketStatus::CLOSED->value,
                'note' => 'Reporter Hanz Magbal confirmed the resolution and closed the ticket.',
                'timestamp' => Carbon::now()->subDays(2)->addHours(4),
            ]);
        }

        // 5. Seed Notifications
        Notification::updateOrCreate(
            ['title' => 'Ticket Resolved', 'user_id' => $student->id],
            [
                'message' => 'Your report regarding the broken desk in Room 101 (TK-1004) has been resolved.',
                'read' => false,
            ]
        );

        Notification::updateOrCreate(
            ['title' => 'New Assignment', 'user_id' => $maintenance->id],
            [
                'message' => 'You have been assigned to TK-1003: AC water leak in the Library.',
                'read' => false,
            ]
        );

        Notification::updateOrCreate(
            ['title' => 'New Ticket Filed', 'user_id' => $admin->id],
            [
                'message' => 'A new concern regarding gymnasium lighting has been submitted by Prof. Davis Sentillas.',
                'read' => false,
            ]
        );
    }
}
