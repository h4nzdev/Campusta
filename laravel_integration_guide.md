# CAMPUSTA Laravel Backend API Integration Guide

This guide will walk you through setting up a Laravel REST API backend and connecting it to your React frontend, transitioning from mock state (`localStorage`) to a real MySQL database.

---

## Part 1: Laravel Backend Setup

### 1. Database Migrations
Create the tables representing the CAMPUSTA database structures. Run `php artisan make:migration` to create each schema.

#### A. Users Table (Modified Default)
Ensure your users table has `school_id`, `role`, `department`, `course`, `year_level`, `contact`, and `profile_pic`:
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('school_id')->unique(); // e.g. 2024-00123
    $table->string('name');
    $table->string('username')->unique();
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['student', 'faculty', 'maintenance', 'admin'])->default('student');
    $table->string('department')->nullable();
    $table->string('course')->nullable();
    $table->string('year_level')->nullable();
    $table->string('contact')->nullable();
    $table->string('profile_pic')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

#### B. Locations Table
```php
Schema::create('locations', function (Blueprint $table) {
    $table->id();
    $table->string('code')->unique(); // e.g., USPF-MAIN-ITLAB2
    $table->string('building');       // e.g., Main Building
    $table->string('floor');          // e.g., 2nd Floor
    $table->string('room');           // e.g., IT Lab 2
    $table->string('name');           // e.g., Computer Laboratory 2
    $table->string('qr_code')->unique();
    $table->timestamps();
});
```

#### C. Categories Table
```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // e.g., IT & Equipment
    $table->text('description')->nullable();
    $table->string('department');     // Responsible dept: IT Support Department
    $table->timestamps();
});
```

#### D. Tickets Table
```php
Schema::create('tickets', function (Blueprint $table) {
    $table->id('id'); // Generates numeric id, you can format it as "TK-" . id in API response
    $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
    $table->string('category_name'); // Or foreignId to categories
    $table->text('description');
    $table->enum('priority', ['Low', 'Medium', 'High', 'Urgent'])->default('Medium');
    $table->enum('status', ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'])->default('Pending');
    $table->foreignId('assigned_personnel_id')->nullable()->constrained('users')->onDelete('set null');
    $table->string('photo_url')->nullable();
    $table->text('work_notes')->nullable();
    $table->string('completion_photo_url')->nullable();
    $table->timestamps();
});
```

#### E. Ticket Histories Table
Tracks workflow changes:
```php
Schema::create('ticket_histories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ticket_id')->constrained('tickets')->onDelete('cascade');
    $table->string('status');
    $table->string('note');
    $table->timestamp('timestamp')->useCurrent();
});
```

#### F. Notifications Table
```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->string('title');
    $table->text('message');
    $table->boolean('read')->default(false);
    $table->timestamps();
});
```

---

### 2. Laravel Models & Relationships

Configure Eloquent relationships in models:

#### `Ticket.php`
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'reporter_id', 'location_id', 'category_name', 'description', 
        'priority', 'status', 'assigned_personnel_id', 'photo_url', 
        'work_notes', 'completion_photo_url'
    ];

    public function reporter() {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function location() {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function assignedPersonnel() {
        return $this->belongsTo(User::class, 'assigned_personnel_id');
    }

    public function history() {
        return $this->hasMany(TicketHistory::class)->orderBy('timestamp', 'asc');
    }
}
```

---

### 3. API Routes (`routes/api.php`)
Protect routes using Laravel Sanctum middleware:

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (Requires Auth Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    
    // Tickets
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/read', [NotificationController::class, 'markAsRead']);
});
```

---

### 4. API Controllers

#### A. AuthController
Handles login sessions and issues Sanctum API Tokens:
```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        // For demo bypass, you can check plain password or use standard Hash::check
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

#### B. TicketController (Storing & Uploading files)
Handles creating tickets, assignment logs, and file uploads:
```php
namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\Notification;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    // List tickets
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history']);

        // Role-based restrictions
        if ($user->role === 'student' || $user->role === 'faculty') {
            $query->where('reporter_id', $user->id);
        } elseif ($user->role === 'maintenance') {
            $query->where('assigned_personnel_id', $user->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // File report
    public function store(Request $request)
    {
        $request->validate([
            'location_code' => 'required|exists:locations,code',
            'category_name' => 'required|string',
            'description' => 'required|string|min:10',
            'photo' => 'nullable|string' // base64 string from React
        ]);

        $location = Location::where('code', $request->location_code)->firstOrFail();
        $user = $request->user();

        $photoPath = null;
        if ($request->has('photo') && $request->photo) {
            // Decode base64 image and save to Laravel storage
            $image_parts = explode(";base64,", $request->photo);
            $image_type_aux = explode("image/", $image_parts[0]);
            $image_type = $image_type_aux[1];
            $image_base64 = base64_decode($image_parts[1]);
            $fileName = 'tickets/' . uniqid() . '.' . $image_type;
            Storage::disk('public')->put($fileName, $image_base64);
            $photoPath = Storage::url($fileName);
        }

        $ticket = Ticket::create([
            'reporter_id' => $user->id,
            'location_id' => $location->id,
            'category_name' => $request->category_name,
            'description' => $request->description,
            'photo_url' => $photoPath,
            'status' => 'Pending'
        ]);

        // Add history log
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'status' => 'Pending',
            'note' => 'Ticket created by ' . $user->name,
        ]);

        // Notify Admins
        // (Create helper to dispatch Notification objects to admins)

        return response()->json($ticket->load('history'), 201);
    }

    // Update ticket (Status, Assign, Resolve, Close)
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        $data = $request->only([
            'priority', 'status', 'assigned_personnel_id', 
            'work_notes', 'completion_photo', 'history_note'
        ]);

        if ($request->has('completion_photo') && $request->completion_photo) {
            $image_parts = explode(";base64,", $request->completion_photo);
            $image_type_aux = explode("image/", $image_parts[0]);
            $image_type = $image_type_aux[1];
            $image_base64 = base64_decode($image_parts[1]);
            $fileName = 'resolutions/' . uniqid() . '.' . $image_type;
            Storage::disk('public')->put($fileName, $image_base64);
            $ticket->completion_photo_url = Storage::url($fileName);
        }

        if (isset($data['priority'])) $ticket->priority = $data['priority'];
        if (isset($data['status'])) $ticket->status = $data['status'];
        if (isset($data['assigned_personnel_id'])) $ticket->assigned_personnel_id = $data['assigned_personnel_id'];
        if (isset($data['work_notes'])) $ticket->work_notes = $data['work_notes'];

        $ticket->save();

        // Write history logs
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'status' => $ticket->status,
            'note' => $request->history_note ?? 'Status changed to ' . $ticket->status,
        ]);

        // Dispatch notifications
        // ... (Send Notification to reporter on resolution, technician on assignment)

        return response()->json($ticket->load(['reporter', 'location', 'assignedPersonnel', 'history']));
    }
}
```

---

## Part 2: React Frontend Integration

With the backend active, we need to adapt the React code to communicate using HTTP requests (Axios).

### 1. Axios Base Configuration
Create an API service configuration inside `frontend/src/utils/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel server address
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: automatically append Bearer token to every request if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
```

---

### 2. Rewriting `AuthContext.jsx` for API communication

Swap local storage states with HTTP calls inside your `AuthContext.jsx`:

```jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize: Load user profile and initial data if token exists
  useEffect(() => {
    const token = localStorage.getItem("campusta_token");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch tickets and notifications whenever the user changes
  useEffect(() => {
    if (user) {
      fetchTickets();
      fetchNotifications();
    } else {
      setTickets([]);
      setNotifications([]);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post("/login", { username, password });
      localStorage.setItem("campusta_token", res.data.access_token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Invalid username or password" 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("campusta_token");
      setUser(null);
    }
  };

  const addTicket = async (ticketData) => {
    try {
      const res = await api.post("/tickets", ticketData);
      setTickets((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to submit ticket.");
    }
  };

  const updateTicket = async (ticketId, updatedFields) => {
    try {
      const res = await api.put(`/tickets/${ticketId}`, updatedFields);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? res.data : t))
      );
      fetchNotifications(); // reload notifications
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await api.put("/notifications/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to update notifications", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tickets,
        notifications,
        loading,
        login,
        logout,
        addTicket,
        updateTicket,
        markNotificationsAsRead
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 3. Frontend Form Adjustments
Ensure your forms send base64 data to matching controllers, or switch to `FormData` boundaries to support direct file blobs instead of base64 strings! 

Enjoy backend development! If you run into CORS issues during connection, make sure to configure Laravel's CORS middleware (`config/cors.php`) to allow requests from your React origin (usually `http://localhost:5173`).
