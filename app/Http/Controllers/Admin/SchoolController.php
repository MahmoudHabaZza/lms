<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::query()
            ->with('city')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/schools/index', [
            'schools' => $schools,
        ]);
    }

    public function create()
    {
        $cities = City::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/schools/create', ['cities' => $cities]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        School::create($data);

        return to_route('admin.schools.index');
    }

    public function edit(School $school)
    {
        $cities = City::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/schools/edit', ['school' => $school, 'cities' => $cities]);
    }

    public function update(Request $request, School $school)
    {
        $data = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $school->update($data);

        return to_route('admin.schools.index');
    }

    public function destroy(School $school)
    {
        $school->delete();

        return to_route('admin.schools.index');
    }
}
