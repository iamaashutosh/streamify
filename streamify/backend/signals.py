import os
import threading
import subprocess
from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from .models import Movies,Plan,Subscription
from django.utils import timezone
import subprocess
from pathlib import Path
import logging
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

def process_video_async(instance):
    input_file = instance.video.path
    base_dir = Path(input_file).parent / 'hls' / f'{instance.pk}'
    base_dir.mkdir(parents=True, exist_ok=True)

    resolutions = {
        '480p': {'height': 480, 'bitrate': '800k'},
        '720p': {'height': 720, 'bitrate': '1400k'},
    }

    variant_playlists = []

    try:
        for label, settings in resolutions.items():
            output_path = base_dir / label
            output_path.mkdir(parents=True, exist_ok=True)

            playlist_path = output_path / 'index.m3u8'

            ffmpeg_cmd = [
                "ffmpeg", "-i", input_file,
                "-vf", f"scale=-2:{settings['height']}",
                "-c:a", "aac", "-ar", "48000", "-c:v", "h264",
                "-profile:v", "main", "-crf", "20", "-sc_threshold", "0",
                "-g", "48", "-keyint_min", "48",
                "-b:v", settings['bitrate'], "-maxrate", settings['bitrate'],
                "-bufsize", "1200k",
                "-hls_time", "10", "-hls_playlist_type", "vod",
                "-hls_segment_filename", str(output_path / "segment_%03d.ts"),
                str(playlist_path)
            ]

            result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)

            if result.returncode != 0:
                logger.error(f"FFmpeg failed for {label}: {result.stderr}")
                raise RuntimeError(f"FFmpeg error ({label}): {result.stderr}")

            variant_playlists.append({
                "path": f"{label}/index.m3u8",
                "resolution": f"0x{settings['height']}",
                "bandwidth": settings['bitrate'].replace('k', '000')
            })

        # Create master playlist
        master_playlist_path = base_dir / 'master.m3u8'
        with open(master_playlist_path, 'w') as m3u8:
            m3u8.write("#EXTM3U\n")
            for variant in variant_playlists:
                m3u8.write(f"#EXT-X-STREAM-INF:BANDWIDTH={variant['bandwidth']},RESOLUTION={variant['resolution']}\n")
                m3u8.write(f"{variant['path']}\n")

        # Optional: clean up original file
        if os.path.exists(input_file):
            os.remove(input_file)
            instance.video.delete(save=False)

    except Exception as e:
        logger.exception("Failed to process video for movie ID %d: %s", instance.pk, e)

@receiver(post_save, sender=Movies)
def process_video_in_thread(sender, instance, created, **kwargs):
    if created and instance.video:
        threading.Thread(target=process_video_async, args=(instance,)).start()

@receiver(post_save, sender=User)
def create_free_subscription(sender, instance, created, **kwargs):
    if created:
        try:
            free_plan = Plan.objects.get(name='Free')
        except Plan.DoesNotExist:
            free_plan = Plan.objects.create(
                name='Free',
                price=0.00,
                duration=5,
                description='Free trial plan'
            )

        Subscription.objects.create(
            user=instance,
            plan=free_plan,
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(days=free_plan.duration),
            active=False
        )
