<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::query()
            ->withCount('schools')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/cities/index', [
            'cities' => $cities,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/cities/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
        ]);

        City::create($data);

        return to_route('admin.cities.index');
    }

    public function edit(City $city)
    {
        return Inertia::render('admin/cities/edit', ['city' => $city]);
    }

    public function update(Request $request, City $city)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
        ]);

        $city->update($data);

        return to_route('admin.cities.index');
    }

    public function destroy(City $city)
    {
        $city->delete();

        return to_route('admin.cities.index');
    }
}
