# Generated by Django 4.2.1 on 2024-06-05 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('libreria_franklin', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id_coupon', models.AutoField(primary_key=True, serialize=False)),
                ('coupon_name', models.CharField(max_length=100)),
                ('discount_percent', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
            options={
                'verbose_name': 'Coupon',
                'verbose_name_plural': 'Coupons',
                'db_table': 'Coupon',
            },
        ),
        migrations.CreateModel(
            name='SubscriptionBook',
            fields=[
                ('id_subscription_book', models.AutoField(primary_key=True, serialize=False)),
                ('book_name', models.CharField(max_length=100)),
                ('active', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'SubscriptionBook',
                'verbose_name_plural': 'SubscriptionBooks',
                'db_table': 'SubscriptionBook',
            },
        ),
    ]
