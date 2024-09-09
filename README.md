یک اپ ساده که میتونه آخرین وضعیت و مکان مرسوله ی پستی رو با ریکوئست POST از tracking.post.ir بخونه و علاوه بر ذخیره کردنش در دیتابیس، میتونه اون رو براتون توی تلگرام ارسال کنه!

## نحوه کار

ابتدا مشخصات دیتابیس رو توی فایل `.env` وارد کنید.

نمونه ی پایین، آدرس پیش فرضی هست که توسط Prisma ساخته شده:

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```
دستور `npx prisma db push` رو اجرا کنید تا تیبل های دیتابیس ساخته بشه.

از آدرس زیر میتونید کد رهگیری مرسوله رو بدید  به اپ:
```bash
http://localhost:3000/api/post/set?code=24CharacterCodeHere
```

با ست کردن کرون جاب روی آدرس پایین میتونید آپدیت هارو به صورت خودکار دریافت کنید.

```bash
http://localhost:3000/api/post?code=24CharacterCodeHere
```

در صورتی که فقط یک عدد کد رهگیری فعال دارید، نیازی به دادن کوئری پارامتر `code` نیست.

برای ارسال نوتیفیکیشن، من از یه بات تلگرام استفاده میکنم و برای ارتباط با api تلگرام یک پروژه جدید ساختم و توی یک `api route` میاد `URL` رو میگیره و بازش میکنه:) به همین راحتی.
پروژه رو روی ورسل دیپلوی کردم و چون ورسل هم فیلتره(!)، آدرس یک سابدامین از سایت خودم، که پشت کلودفلره، رو برای دیپلوی دادم به ورسل.

در آخر اینکه این پروژه قراره روی سرور خونگیم ران بشه و این پایین نمونه فایل `.env` رو میذارم. امیدوارم مفید واقع بشه این پروژه.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
SEND_NOTIFS="yes" # if set to anything else, sending notifications will be disabled.
URL="https://apiroute.domain.com" # URL that has free access to the internet and will send the notification via telegram api
CHAT_ID="-100111111111" # user id of the receiver on telegram
```
