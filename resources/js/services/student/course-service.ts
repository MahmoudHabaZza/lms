export type StudentCourse = {
    id: number;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    category: string | null;
    instructor: string | null;
    total_duration_minutes: number;
    lessons_count: number;
    resources_count: number;
    tasks_count: number;
    quizzes_count: number;
    progress: {
        completed_lessons: number;
        total_lessons: number;
        percentage: number;
    };
    next_lesson_id: number | null;
    is_enrolled: boolean;
    is_favorited: boolean;
    show_url: string;
    enroll_url: string | null;
    favorite_url: string;
};

export type StudentCourseDirectory = {
    stats: {
        enrolled_count: number;
        available_count: number;
        favorites_count: number;
        completed_lessons: number;
    };
    enrolled: StudentCourse[];
    available: StudentCourse[];
    favorites: StudentCourse[];
};

export type StudentCourseFilter = 'all' | 'enrolled' | 'favorites' | 'available';

export const studentCourseService = {
    filterCourses(directory: StudentCourseDirectory, filter: StudentCourseFilter, query: string): StudentCourse[] {
        const normalizedQuery = query.trim().toLowerCase();
        const baseCourses =
            filter === 'enrolled'
                ? directory.enrolled
                : filter === 'favorites'
                  ? directory.favorites
                  : filter === 'available'
                    ? directory.available
                    : [...directory.enrolled, ...directory.available.filter((course) => !directory.enrolled.some((enrolled) => enrolled.id === course.id))];

        if (!normalizedQuery) {
            return baseCourses;
        }

        return baseCourses.filter((course) =>
            [course.title, course.description, course.category, course.instructor]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(normalizedQuery)),
        );
    },
};
