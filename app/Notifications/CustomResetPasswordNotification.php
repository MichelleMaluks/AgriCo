<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPasswordNotification extends ResetPasswordNotification
{
    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url') . '/reset-password/' . $this->token;

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('You requested a password reset.')
            ->action('Reset Password', $frontendUrl)
            ->line('If you did not request this, no action is required.');
    }
}
