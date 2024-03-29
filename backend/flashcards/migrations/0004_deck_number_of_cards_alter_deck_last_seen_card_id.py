# Generated by Django 4.2.6 on 2024-03-23 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("flashcards", "0003_course_owner_deck_last_seen_card_id_deck_owner_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="deck",
            name="number_of_cards",
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="deck",
            name="last_seen_card_id",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
