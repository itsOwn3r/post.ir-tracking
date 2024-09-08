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

با ست کردن کرون جاب روی این فایل میتونید آپدیت هارو به صورت خودکار دریافت کنید.

در صورتی که فقط یک عدد کد رهگیری فعال دارید، نیازی به دادن کوئری پارامتر `code` نیست.