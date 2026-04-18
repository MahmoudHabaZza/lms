<?php

use App\Http\Controllers\Admin\AcademySectionController;
use App\Http\Controllers\Admin\CourseEnrollmentRedirectController;
use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\BannerSlideController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\ProgrammingCourseController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Admin\StudentFeedbackImageController;
use App\Http\Controllers\Admin\StudentReelController;
use App\Http\Controllers\Admin\TopStudentController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\EndUser\BookingController;
use App\Http\Controllers\EndUser\ContactController;
use App\Http\Controllers\EndUser\CourseController as EndUserCourseController;
use App\Http\Controllers\EndUser\FavoriteController as EndUserFavoriteController;
use App\Http\Controllers\EndUser\HomeController;
use App\Http\Controllers\EndUser\InstructorApplicationController;
use App\Http\Controllers\Student\FavoriteController as StudentFavoriteController;
use App\Http\Controllers\Student\EnrollmentController as StudentEnrollmentController;
use App\Http\Controllers\Student\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/dashboard', DashboardRedirectController::class)->middleware('auth')->name('dashboard');
Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
Route::post('/bookings', [BookingController::class, 'store'])->middleware('throttle:10,1')->name('bookings.store');
Route::get('/bookings/success', [BookingController::class, 'success'])->name('bookings.success');
Route::get('/courses/{course}', [EndUserCourseController::class, 'show'])->name('courses.show');
Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:8,1')->name('contact.store');
Route::inertia('/privacy-policy', 'EndUser/PrivacyPolicy')->name('privacy-policy');
Route::get('/join-us', [InstructorApplicationController::class, 'create'])->name('join-us.create');
Route::post('/join-us', [InstructorApplicationController::class, 'store'])->middleware('throttle:5,10')->name('join-us.store');

Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AdminAuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('guest')->prefix('student')->name('student.')->group(function () {
    Route::get('login', [\App\Http\Controllers\Student\Auth\StudentAuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [\App\Http\Controllers\Student\Auth\StudentAuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');
Route::post('/student/logout', [\App\Http\Controllers\Student\Auth\StudentAuthenticatedSessionController::class, 'destroy'])->name('student.logout');
Route::middleware(['auth', 'is_student'])->get('/favorites', [EndUserFavoriteController::class, 'index'])->name('favorites.index');

Route::middleware(['auth', 'is_student'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('profile', [StudentController::class, 'profile'])->name('profile');
    Route::get('courses', [\App\Http\Controllers\Student\CourseController::class, 'index'])->name('courses');
    Route::get('courses/{course}', [\App\Http\Controllers\Student\CourseController::class, 'show'])->name('courses.show');
    Route::post('courses/{course}/favorite', [StudentFavoriteController::class, 'toggle'])->name('courses.favorite');
    Route::post('courses/{course}/enroll', [StudentEnrollmentController::class, 'enroll'])->name('courses.enroll');
    Route::get('favorites', [StudentFavoriteController::class, 'index'])->name('favorites.index');
    Route::get('notifications', [\App\Http\Controllers\Student\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/read-all', [\App\Http\Controllers\Student\NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::post('notifications/{notification}/read', [\App\Http\Controllers\Student\NotificationController::class, 'markRead'])->name('notifications.read');
    Route::get('lessons/{lesson}', [\App\Http\Controllers\Student\LessonController::class, 'show'])->name('lessons.show');
    Route::post('lessons/{lesson}/complete', [\App\Http\Controllers\Student\LessonController::class, 'complete'])->name('lessons.complete');
    Route::get('tasks', [\App\Http\Controllers\Student\TaskController::class, 'index'])->name('tasks.index');
    Route::post('tasks/{task}/submit', [\App\Http\Controllers\Student\TaskController::class, 'submit'])->name('tasks.submit');
    Route::post('courses/{course}/reviews', [\App\Http\Controllers\Student\ReviewController::class, 'store'])->name('courses.reviews.store');
    Route::get('quizzes/{exam}', [\App\Http\Controllers\Student\QuizController::class, 'show'])->name('quizzes.show');
    Route::post('quiz-attempts/{attempt}/submit', [\App\Http\Controllers\Student\QuizController::class, 'submit'])->name('quiz-attempts.submit');
    Route::post('quiz-attempts/{attempt}/security-event', [\App\Http\Controllers\Student\QuizController::class, 'securityEvent'])->name('quiz-attempts.security-event');
    Route::get('certificates', [\App\Http\Controllers\Student\CertificateController::class, 'index'])->name('certificates.index');
    Route::get('certificates/{certificate}/download', [\App\Http\Controllers\Student\CertificateController::class, 'download'])->name('certificates.download');
    Route::get('resources/{resource}/download', [\App\Http\Controllers\Student\ResourceController::class, 'download'])->name('resources.download');
    // Web profile management (Inertia server-side flows)
    Route::get('profile/edit', [\App\Http\Controllers\Student\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('profile', [\App\Http\Controllers\Student\ProfileController::class, 'update'])->name('profile.update');
    Route::post('profile/password', [\App\Http\Controllers\Student\ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('logout', [AdminAuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::resource('banner-slides', BannerSlideController::class)->middleware('has_permission:manage-banner-slides')->except('show');
    Route::resource('academy-sections', AcademySectionController::class)->middleware('has_permission:manage-academy-sections')->except('show');
    Route::get('programming-courses', [ProgrammingCourseController::class, 'index'])->middleware('has_permission:manage-programming-courses')->name('programming-courses.index');
    Route::get('programming-courses/create', [ProgrammingCourseController::class, 'create'])->middleware('has_permission:manage-programming-courses')->name('programming-courses.create');
    Route::get('programming-courses/{programmingCourse}/edit', [ProgrammingCourseController::class, 'edit'])->middleware('has_permission:manage-programming-courses')->name('programming-courses.edit');
    Route::resource('courses', CourseController::class)->middleware('has_permission:manage-courses')->except('show');
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->middleware('has_permission:manage-categories')->except('show');
    Route::resource('student-reels', StudentReelController::class)->middleware('has_permission:manage-student-reels')->except('show');
    Route::resource('course-reels', \App\Http\Controllers\Admin\CourseReelController::class)->middleware('has_permission:manage-course-reels')->except('show');
    Route::resource('top-students', TopStudentController::class)->middleware('has_permission:manage-top-students')->except('show');
    Route::resource('student-feedback-images', StudentFeedbackImageController::class)->middleware('has_permission:manage-student-feedback-images')->except('show');
    Route::resource('faqs', FaqController::class)->middleware('has_permission:manage-faqs')->except('show');
    Route::resource('lessons', \App\Http\Controllers\Admin\LessonController::class)->middleware('has_permission:manage-lessons')->except('show');
    Route::resource('resources', \App\Http\Controllers\Admin\ResourceController::class)->middleware('has_permission:manage-resources')->except('show');
    Route::resource('enrollments', \App\Http\Controllers\Admin\EnrollmentController::class)->middleware('has_permission:manage-enrollments')->except('show');
    Route::get('course-enrollments', [CourseEnrollmentRedirectController::class, 'index'])->middleware('has_permission:manage-course-enrollments')->name('course-enrollments.index');
    Route::get('course-enrollments/create', [CourseEnrollmentRedirectController::class, 'create'])->middleware('has_permission:manage-course-enrollments')->name('course-enrollments.create');
    Route::get('course-enrollments/{courseEnrollment}/edit', [CourseEnrollmentRedirectController::class, 'edit'])->middleware('has_permission:manage-course-enrollments')->name('course-enrollments.edit');
    Route::resource('wishlist-items', \App\Http\Controllers\Admin\WishlistItemController::class)->middleware('has_permission:manage-wishlist-items')->except('show');
    Route::resource('tasks', \App\Http\Controllers\Admin\TaskController::class)->middleware('has_permission:manage-tasks')->except('show');
    Route::resource('task-submissions', \App\Http\Controllers\Admin\TaskSubmissionController::class)->middleware('has_permission:manage-task-submissions')->except('show');
    Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class)->middleware('has_permission:manage-exams')->except('show');
    Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class)->middleware('has_permission:manage-questions')->except('show');
    Route::resource('attempts', \App\Http\Controllers\Admin\StudentExamAttemptController::class)->middleware('has_permission:manage-attempts')->except('show');
    Route::resource('student-answers', \App\Http\Controllers\Admin\StudentAnswerController::class)->middleware('has_permission:manage-student-answers')->except('show');
    Route::resource('certificates', \App\Http\Controllers\Admin\CertificateController::class)->middleware('has_permission:manage-certificates')->except('show');
    Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class)->middleware('has_permission:manage-roles')->except('show');
    Route::resource('permissions', \App\Http\Controllers\Admin\PermissionController::class)->middleware('has_permission:manage-permissions')->except('show');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->middleware('has_permission:manage-users')->only(['index', 'edit', 'update']);
    Route::resource('students', AdminStudentController::class)->middleware('has_permission:manage-users')->except(['show']);
    Route::resource('notifications', \App\Http\Controllers\Admin\NotificationController::class)->middleware('has_permission:manage-notifications')->except('show');
    Route::resource('certificate-requests', \App\Http\Controllers\Admin\CertificateRequestController::class)->middleware('has_permission:manage-certificate-requests')->except('show');
    Route::resource('lesson-progress', \App\Http\Controllers\Admin\LessonProgressController::class)->middleware('has_permission:manage-lesson-progress')->except('show');
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
    Route::post('settings/logo', [SettingController::class, 'uploadLogo'])->name('settings.logo');
    Route::post('settings/test-email', [SettingController::class, 'testEmail'])->name('settings.test-email');
});

require __DIR__.'/settings.php';
