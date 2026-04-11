<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait AuthorizesTeachifyRoles
{
    protected function forbidden(string $message = 'You do not have permission to perform this action.'): JsonResponse
    {
        return response()->json([
            'detail' => $message,
        ], Response::HTTP_FORBIDDEN);
    }

    protected function requireStudent(?User $user): ?JsonResponse
    {
        if (! $user || ! $user->isStudent()) {
            return $this->forbidden('Only students can perform this action.');
        }

        return null;
    }

    protected function requireInstructor(?User $user): ?JsonResponse
    {
        if (! $user || ! $user->isInstructorLike()) {
            return $this->forbidden('Only instructors can perform this action.');
        }

        return null;
    }

    protected function canManageOwnedInstructorResource(?User $user, int $ownerId): bool
    {
        if (! $user) {
            return false;
        }

        return $user->is_superuser || $user->is_admin || $user->id === $ownerId;
    }
}
