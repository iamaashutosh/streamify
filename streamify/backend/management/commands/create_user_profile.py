from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from backend.models import UserProfile  # Adjust the import based on your app structure

class Command(BaseCommand):
    help = 'Create user profiles for existing users'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        for user in users:
            # Check if the user already has a profile
            #if not hasattr(user, 'userprofile'):
            userprofile, created = UserProfile.objects.get_or_create(user=user)
            userprofile.first_name = user.first_name
            userprofile.last_name = user.last_name
            userprofile.email=user.email
            userprofile.save()

            if created:
                self.stdout.write(self.style.SUCCESS(f'Profile created for user: {user.username}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Profile updated for user: {user.username}'))
            #else:
               #self.stdout.write(self.style.WARNING(f'Profile already exists for user: {user.username}'))