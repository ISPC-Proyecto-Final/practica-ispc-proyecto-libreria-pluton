# Generated by Django 4.2.1 on 2024-06-07 03:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('libreria_franklin', '0005_contactmessage_delete_subscriptionbook'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=7),
        ),
    ]