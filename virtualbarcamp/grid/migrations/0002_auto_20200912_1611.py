# Generated by Django 3.1.1 on 2020-09-12 15:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("django_celery_beat", "0012_periodictask_expire_seconds"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("grid", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="room",
            name="discord_category_id",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="room",
            name="discord_discussion_channel_id",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="room",
            name="discord_presentation_channel_id",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="room",
            name="discord_presenter_role_id",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="slot",
            name="slot_end_scheduled_action",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="django_celery_beat.periodictask",
            ),
        ),
        migrations.AddField(
            model_name="slot",
            name="slot_start_scheduled_action",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="django_celery_beat.periodictask",
            ),
        ),
        migrations.AlterField(
            model_name="talk",
            name="other_speakers",
            field=models.ManyToManyField(
                blank=True, related_name="_talk_other_speakers_+", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]