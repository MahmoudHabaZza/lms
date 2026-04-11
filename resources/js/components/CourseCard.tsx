import React from 'react';

export default function CourseCard({ course, onEnroll }: { course: any; onEnroll?: () => void }) {
    return (
        <div className="border rounded p-4">
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm mt-1">{course.short_description}</p>
            <div className="mt-3 flex items-center justify-between">
                <a href={course.drive_link || '#'} target="_blank" rel="noreferrer" className="text-primary">Open</a>
                {onEnroll && <button onClick={onEnroll} className="btn">Enroll</button>}
            </div>
        </div>
    );
}
