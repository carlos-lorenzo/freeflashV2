# Generated by Django 4.2.6 on 2024-04-28 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_remove_user_surname"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]
