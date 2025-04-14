from django.core.mail import send_mail

def send_email(email):
    send_mail(
        "Subscription Confirmed",
        f"Your Subscription to Streamify's services have been confirmed. You can now access the premium content.",
        "theboys.ytube420@gmail.com",
        [email],
        fail_silently=False,
    )