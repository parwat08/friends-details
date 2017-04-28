## **API EndPoints**

### **SignUp, Email Verification and Authentication**

**POST:** *`localhost:8080/api/signup`* 

- user enters valid gmail and password, a mail is sent to the entered gmail for verification with verification link.

**GET:** *`localhost:8080/api/verify`*

- redirect link to the app which was sent to the user email, after this process the user account becomes active

**POST:** *`localhost:8080/api/login`*

- after the verification is done, user is eligiable for login with verified email and password

----------

### **User**

- below API's are only accessible, if a user is logged-in, where jwt token will be present in authorization headers

**GET, PUT, DELETE:** *`localhost:8080/api/profile`*

- **GET** method here is to retrieve the current logged in user profile details, with the jwt token in authorization headers

-  **PUT** method here is used to update the current logged-in user's profile details with the fields present in schema

- **DELETE** method is used to delete the current logged-in user's account, All the friends will also be removed

**POST:** *`localhost:8080/api/image`*

- This API is used to upload the profile picture of the logged-in user with the multipart Content-Type

- Here to upload the image this API will be called and the response will the  path of the image inside static folder `public`

- The response of this `/image` endpoint will be used in the field `image`, while updating the user profile, the image path will be provided to insert in the database **PUT**: *`localhost:8080/api/profile`*


-------


### **Friend**

**GET, POST:** *`localhost:8080/api/friends`*

- The **GET** method provides the Array `[{}, {}, {}]` of friends.

- The **POST** method is used to Insert the friend details, with valid schema fields

**GET, PUT, DELETE:** *`localhost:8080/api/friend/{id}`*

- The **GET** method is used to retrive a specific friends detail with the id provided as the url path `{id}`

- The **PUT** method is used to update the friend with the schema fields through the friend `id` being provided

- The **DELETE** method is used to remove the friend 


## **Mail Configurations**

- */support/mail/emailVerification.js* provide your email and password in *auth* object in `createTransport` method.

- after the configuration is done, when a user signup's google will send a email to the user config email, to tell about less secure configuration, accept it, just for testing purpose


