# REST API server for PROFILE MANAGEMENT SYSTEM

# ENV Vars

```env
MONGODB_URL=Your_Mongo_Database_URL
APP_SECRET=token_encryption_secret_for_jwt
```
## important : "/api" is used with every path before the URLs given

## API DOCS

### USER ROUTES   
---

| Description            |                 URL              | Method |         Body         |   Status    |
| ---------------------- | -------------------------------- | ------ | -------------------- | ----------- |
|        Sign Up         |        /user/signup              | POST   |      SignUp body     | CREATED     |
|        LogIn           |        /user/login               | POST   |     email, password  | OK          |
|   Get User details     |        /user                     | GET    |          \_\_        | OK          |
|   Update User details  |        /user                     | PATCH  |      SignUp body     | OK          |
|         Add User       |        /user/add                 | POST   |      SignUp body     | CREATED     |

---


```json
SignUp Body = {
    "firstName": "your_first_name (required)",
    "middleName": "your_middle_name (optional)",
    "lastName": "your_last_name (required)",
    "email": "your_email (required)",
    "password": "your_password (required)",
    "role": "your_role (required)",
    "department": "your_department (optional)",
}
```