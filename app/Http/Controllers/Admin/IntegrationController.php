<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class IntegrationController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('admin/integrations/Index', [
            'integrations' => [
                'gtm_container_id' => Setting::get('gtm_container_id'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gtm_container_id' => ['nullable', 'string', 'max:50', 'regex:/^GTM-[A-Z0-9]+$/'],
        ]);

        Setting::set('gtm_container_id', $validated['gtm_container_id'] ?: null, 'string', 'integrations');

        return to_route('admin.integrations.index')->with('success', 'تم حفظ إعدادات التكامل بنجاح');
    }
}
