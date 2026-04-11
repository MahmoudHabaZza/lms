<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Request</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .info-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #ff6b35;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #495057;
            width: 40%;
        }
        .info-value {
            color: #212529;
            font-weight: 500;
            text-align: left;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .timestamp {
            font-size: 12px;
            color: #adb5bd;
            margin-top: 10px;
        }
        .highlight {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .highlight h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Kids Programming Academy</h1>
            <p>New Booking Request</p>
        </div>

        <div class="content">
            <div class="highlight">
                <h3>Student Details</h3>
            </div>

            <div class="info-card">
                <div class="info-item">
                    <span class="info-label">Full Name</span>
                    <span class="info-value">{{ $data['fullName'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Age</span>
                    <span class="info-value">{{ $data['age'] }} years</span>
                </div>
                <div class="info-item">
                    <span class="info-label">WhatsApp</span>
                    <span class="info-value">{{ $data['whatsappNumber'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Country</span>
                    <span class="info-value">{{ $data['country'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">City</span>
                    <span class="info-value">{{ $data['city'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">School</span>
                    <span class="info-value">{{ $data['school'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Requested Course</span>
                    <span class="info-value">{{ $data['course'] }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Attendance Mode</span>
                    <span class="info-value">{{ $data['isOnline'] ? 'Online' : 'In-person' }}</span>
                </div>
            </div>

            <div class="highlight">
                <h3>Next Step</h3>
                <p>A new booking request has been received via Kids Programming Academy. Please contact the student to confirm details and schedule the course start date.</p>
            </div>
        </div>

        <div class="footer">
            <p>This email was sent automatically by Kids Programming Academy.</p>
            <p class="timestamp">Sent at: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
