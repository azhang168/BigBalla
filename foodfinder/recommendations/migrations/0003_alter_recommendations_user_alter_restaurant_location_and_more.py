# Generated by Django 5.1.4 on 2025-01-11 23:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommendations', '0002_recommendations_user_restaurant_location_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recommendations',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recommendations.user'),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='location',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=50),
        ),
    ]
