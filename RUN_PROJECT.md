To run the project, simply run these two commands following the same order :
- `npm install`
- `npm run docker` (you must have the `docker compose` command already installed)
- `npm run dev` (there is no build yet)
- `npm run database:seed --workspace=backend` (only if you want to seed data)

NOTE: You MUST run `npm run dev` before any seeding, for when the db was just created, else, you'll just get an error because the tables aren't initialized.

Now, you can access the [Frontend](http://127.0.0.1:5000) or the [Backend](http://127.0.0.1:5001)

If you have seeded the database, you can login with the owner user :
- Username: `TestUser`
- Password: `Test123&`

Enjoy!